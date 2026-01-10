// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    default: 'Messenger'
  },

  uuid: {
    type: String,
    required: true,
    unique: true
  },
  introduce: String,
  
  profileImage: {
    type: mongoose.Schema.Types.Mixed,  // Object 타입
    default: []
  },
  
  online: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,  // createdAt, updatedAt 자동 관리
  collection: 'users',  // 컬렉션 이름 명시
  versionKey: false  // ✅ __v 제거
});

module.exports = mongoose.model('User', userSchema);