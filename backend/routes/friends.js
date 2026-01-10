const express = require('express');
const router = express.Router();
const friends = require('../models/friends');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { activeSessions } = require('../utils/sessionHelper');

// 친구 요청 보내기
router.post('/request',authMiddleware, async (req, res) => {
  try {
    const { recipientuuid } = req.body;
    const user = await User.findOne({ uuid: recipientuuid });
    if (!user) {
    return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다' });
    }
    const recipientId = user._id
    const requesterId = req.user.userObjectId;

    // 자신에게 요청 방지
    if (requesterId === recipientId) {
      return res.status(400).json({ message: '자기 자신에게 친구 요청할 수 없습니다' });
    }
    // 이미 존재하는 관계 확인
    const existing = await friends.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: '이미 관계가 존재합니다' });
    }

    const friendship = new friends({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    await friendship.save();
    res.status(201).json({ message: '친구 요청을 보냈습니다', friendship });
  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류' });
  }
});

// 친구 요청 수락
router.put('/accept/:friendshipId',authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;
    const { friendshipId } = req.params;

    const friendship = await friends.findOne({
      _id: friendshipId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ message: '친구 요청을 찾을 수 없습니다' });
    }

    friendship.status = 'accepted';
    friendship.updatedAt = Date.now();
    await friendship.save();

    res.json({ message: '친구 요청을 수락했습니다', friendship });
  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류' });
  }
});

// 친구 요청 거절
router.put('/reject/:friendshipId',authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;
    const { friendshipId } = req.params;

    const friendship = await friends.findOne({
      _id: friendshipId,
      recipient: userId,
      status: 'pending'
    });

    if (!friendship) {
      return res.status(404).json({ message: '친구 요청을 찾을 수 없습니다' });
    }

    friendship.status = 'rejected';
    friendship.updatedAt = Date.now();
    await friendship.save();

    res.json({ message: '친구 요청을 거절했습니다' });
  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류' });
  }
});


router.get('/list', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;

    const friendships = await friends.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
    .populate('requester', 'name profileImage uuid online lastSeen')
    .populate('recipient', 'name profileImage uuid online lastSeen');

    const friendList = friendships.map(f => {
      const friend = f.requester._id.toString() === userId 
        ? f.recipient 
        : f.requester;
      
      return {
        ...friend.toObject()
      };
    });

    res.json({ friends: friendList });
  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류' });
  }
});

// 받은 친구 요청 목록
router.get('/requests/received',authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;

    const requests = await friends.find({
      recipient: userId,
      status: 'pending'
    })
    .populate('requester', 'name email profileImage')
    .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류'  });
  }
});

// 보낸 친구 요청 목록
router.get('/requests/sent',authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;

    const requests = await friends.find({
      requester: userId,
      status: 'pending'
    })
    .populate('recipient', 'name profileImage')
    .sort({ createdAt: -1 });

    res.json({ requests,message:"친구 요청을 보냈습니다." });
  } catch (error) {
    res.status(500).json({message: '친구 요청 서버 오류' });
  }
});

// 친구 삭제
router.delete('/:friendObjectId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userObjectId;      
    const { friendObjectId } = req.params;       

    // requester/recipient 관계가 두 ID 조합으로 일치하는 친구 찾기
    const friendship = await friends.findOne({
      $or: [
        { requester: userId, recipient: friendObjectId },
        { requester: friendObjectId, recipient: userId }
      ],
      status: 'accepted'
    });
    if (!friendship) {
      return res.status(404).json({ message: '친구 관계를 찾을 수 없습니다' });
    }
    await friendship.deleteOne();

    res.json({ message: '친구를 삭제했습니다' });

  } catch (error) {
    res.status(500).json({ message: '친구 요청 서버 오류' });
  }
});


module.exports = router;