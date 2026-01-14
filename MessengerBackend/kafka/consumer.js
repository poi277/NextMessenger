const kafka = require('./kafka');
const ChatRoom = require('../models/chatingroom');
const ChatMessage = require('../models/chatingMessage');
const User = require('../models/User');
const WebSocket = require('ws');
const redisClient = require('../utils/redisClient');
const mongoose = require('mongoose'); 

const consumer = kafka.consumer({
  groupId: 'chat-consumer-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  retry: {
    retries: 5,
  },
});

async function startChatConsumer(app) {
  const clients = app.get('wsClients');

  await consumer.connect();
  await consumer.subscribe({ topic: 'chat-message' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      const { roomId, senderId, content, createdAt } = payload;
      const chat = await ChatMessage.create({
        roomId,
        sender: senderId,
        content,
        createdAt
      });

      const populatedChat = await ChatMessage.findById(chat._id)
        .populate('sender', 'name profileImage').lean();

      clients.forEach((socketSet) => {
        socketSet.forEach(ws => {
          if (
            ws.readyState === WebSocket.OPEN &&
            ws.rooms.has(roomId)
          ) {
          ws.send(JSON.stringify({
            type: 'new-message',
            roomId,
            message: {
              ...populatedChat,
              sender: {
                ...populatedChat.sender,
                _id: populatedChat.sender._id.toString(),
              }
            }
          }));
          }
        });
      });
    }
  });
}


module.exports = { startChatConsumer };