// routes/userinfo.js
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const User = require('../models/User');
const { deleteFile } = require('./s3');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.session.userObjectId, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json(user.toObject());
  } catch (error) {
    res.status(500).json({ message: '서버 오류: 사용자 정보를 불러올 수 없습니다.' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, profileImage, introduce } = req.body;

    if (!name && !profileImage && !introduce) {
      return res.status(400).json({ message: '수정할 데이터가 없습니다.' });
    }

    // 세션의 사용자 ID로 수정
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userObjectId,
      {
        name,
        profileImage,
        introduce,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true,
        select: '-password' // 비밀번호 제외
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({ 
      user: updatedUser.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류: 사용자 정보를 저장할 수 없습니다.' });
  }
});

//프로필 이미지 삭제 (본인만)
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { key } = req.body;
    
      
    // 세션의 사용자로만 조회
    const existingUser = await User.findById(req.session.userObjectId);
    
    if (!existingUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    if (existingUser.profileImage?.key === key) {
      await deleteFile(existingUser.profileImage.key);
      return res.json({ success: true, message: '이미지가 삭제되었습니다.' });
    } else {
      return res.status(404).json({ message: '프로필 이미지를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

module.exports = router;