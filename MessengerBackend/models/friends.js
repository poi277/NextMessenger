// models/Friendship.js
const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
  requester: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 복합 인덱스 (중복 방지 + 검색 최적화)
friendsSchema.index({ requester: 1, recipient: 1 }, { unique: true });
friendsSchema.index({ recipient: 1, status: 1 });
friendsSchema.index({ requester: 1, status: 1 });

module.exports = mongoose.model('friends', friendsSchema);