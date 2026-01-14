const express = require("express");
const router = express.Router();
const WebSocket = require('ws');
const ChatRoom = require("../models/chatingroom");
const ChatMessage = require("../models/chatingMessage");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");
const { getProducer } = require('../kafka/producer');
const { v4: uuidv4 } = require('uuid');
const friends = require("../models/friends");


function initializeWebSocket(app) {
  const wss = app.get('wss');
  const clients = app.get('wsClients');       // Map<userId, Set<ws>>
  const sessionMiddleware = app.get('sessionMiddleware');
  const onlineUsers = app.get('onlineUsers'); // Set<userId>

  /* =========================
     공통 유틸 함수
     ========================= */

  // ✅ 특정 유저의 친구 ID 목록 조회 (DB 1회)
  const getFriendIds = async (userId) => {
    const friendships = await friends.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    });

    return friendships.map(f =>
      f.requester.toString() === userId
        ? f.recipient.toString()
        : f.requester.toString()
    );
  };

  // ✅ 친구 ID 중 온라인인 사람만 필터
  const filterOnlineUsers = (userIds) => {
    return userIds.filter(id => onlineUsers.has(id));
  };

  /* =========================
     온라인 친구 목록 전송
     ========================= */

  // ✅ 본인에게 온라인 친구 목록 전송
  const sendOnlineFriendsToUser = async (ws, userId) => {
    try {
      const friendIds = await getFriendIds(userId);
      const onlineFriends = filterOnlineUsers(friendIds);

      ws.send(JSON.stringify({
        type: 'online-users',
        users: onlineFriends
      }));
    } catch (error) {
      console.error('온라인 친구 전송 오류:', error);
    }
  };

  // ✅ 특정 유저 상태 변경 → 친구들에게 알림
  const notifyFriendsAboutStatus = async (userId) => {
    try {
      const friendIds = await getFriendIds(userId);

      for (const friendId of friendIds) {
        const friendClients = clients.get(friendId);
        if (!friendClients) continue;

        const onlineFriendsForFriend = filterOnlineUsers(
          await getFriendIds(friendId)
        );

        const message = JSON.stringify({
          type: 'online-users',
          users: onlineFriendsForFriend
        });

        friendClients.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
          }
        });
      }
    } catch (error) {
      console.error('친구 상태 알림 오류:', error);
    }
  };

  /* =========================
     WebSocket 연결 처리
     ========================= */

  wss.on('connection', (ws, req) => {
    sessionMiddleware(req, {}, async () => {
      const session = req.session;

      if (!session?.userObjectId) {
        ws.close(4001, '인증 필요');
        return;
      }

      const userId = session.userObjectId.toString();

      /* ===== 접속 처리 ===== */
      onlineUsers.add(userId);
      ws.userId = userId;
      ws.rooms = new Set();
      ws.isAlive = true;

      if (!clients.has(userId)) {
        clients.set(userId, new Set());
      }
      clients.get(userId).add(ws);

      console.log(`🟢 ONLINE: ${userId}`);
      console.log(`📊 Total online: ${onlineUsers.size}`);

      ws.send(JSON.stringify({ type: 'connected' }));

      // ✅ 본인에게 온라인 친구 목록
      await sendOnlineFriendsToUser(ws, userId);

      // ✅ 친구들에게 내 상태 알림
      await notifyFriendsAboutStatus(userId);

      /* ===== 메시지 처리 ===== */
      ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case 'ping':
            ws.isAlive = true;
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: new Date().toISOString()
            }));
            break;

          case 'join-room':
            ws.rooms.add(message.roomId);
            ws.send(JSON.stringify({
              type: 'joined-room',
              roomId: message.roomId
            }));
            break;

          case 'leave-room':
            ws.rooms.delete(message.roomId);
            ws.send(JSON.stringify({
              type: 'left-room',
              roomId: message.roomId
            }));
            break;

          case 'send-message':
            await handleSendMessage(ws, message);
            break;

          case 'get-online-users':
            await sendOnlineFriendsToUser(ws, userId);
            break;

          default:
            console.warn(`⚠️ Unknown message type: ${message.type}`);
        }
      });

      /* ===== 종료 처리 ===== */
      ws.on('close', async () => {
        onlineUsers.delete(userId);

        const set = clients.get(userId);
        if (set) {
          set.delete(ws);
          if (set.size === 0) clients.delete(userId);
        }

        console.log(`🔴 OFFLINE: ${userId}`);
        console.log(`📊 Total online: ${onlineUsers.size}`);

        await notifyFriendsAboutStatus(userId);
      });

      ws.on('error', (err) => {
        console.error(`❌ WebSocket error (${userId}):`, err);
      });

      ws.on('pong', () => {
        ws.isAlive = true;
      });
    });
  });

  /* =========================
     Heartbeat
     ========================= */

  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        console.log(`💀 Terminating dead connection: ${ws.userId}`);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);
}


async function handleSendMessage(ws, message) {
  const { roomId, content, receiveruuid } = message;

  if (!ws.rooms.has(roomId)) {
    ws.send(JSON.stringify({ type: 'error', message: '방 참여 필요' }));
    return;
  }

  try {
    const sender = await User.findById(ws.userId);
    if (!sender) {
      ws.send(JSON.stringify({ type: 'error', message: '발신자 정보 없음' }));
      return;
    }

    const producer = await getProducer();

    await producer.send({
      topic: 'chat-message',
      messages: [{
        key: roomId,
        value: JSON.stringify({ 
          messageId: uuidv4(),
          roomId,
          senderId: sender._id,
          content,
          createdAt: new Date().toISOString()
        })
      }]
    });

    ws.send(JSON.stringify({ type: 'sent', roomId }));
    console.log(`✅ Message sent to Kafka: roomId=${roomId}, userId=${ws.userId}`);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    ws.send(JSON.stringify({ type: 'error', message: '메시지 전송 실패' }));
  }
}

router.get("/one-to-one", authMiddleware, async (req, res) => {
  try {
    const { receiveruuid } = req.query;
    const sender = await User.findById(req.session.userObjectId).select("_id");
    const receiver = await User.findOne({ uuid: receiveruuid }).select("_id");

    if (!sender || !receiver) {
      return res.status(400).json({ message: "유효한 유저가 아닙니다." });
    }

    const sortedIds = [sender._id.toString(), receiver._id.toString()].sort();
    const roomId = `${sortedIds[0]}_${sortedIds[1]}`;

    let room = await ChatRoom.findOne({ roomId });

    if (!room) {
      room = await ChatRoom.create({
        roomId,
        participants: [sender._id, receiver._id],
        type: "OneToOne",
      });
    }

    const chatMessages = await ChatMessage.find({ roomId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });
    res.json({roomId,chatMessages});
  } catch (err) {
    console.error('❌ Error fetching chat:', err);
    res.status(500).json({ message: "채팅 불러오던중 서버 오류" });
  }
});

router.get("/:receiveruuid", authMiddleware, async (req, res) => {
  try {
    const { receiveruuid } = req.params;
    
    const user = await User.findOne(
      { uuid: receiveruuid },
      { name: 1, online: 1, profileImage: 1 }
    );

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.json({
      receiverName: user.name,
      receiveronline: user.online ?? false,
      profileImage: user.profileImage?.url ?? "",
    });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ message: "채팅 조회중 서버 오류" });
  }
});

router.initializeWebSocket = initializeWebSocket;
module.exports = router;