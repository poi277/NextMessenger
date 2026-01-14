// models/Post.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  
  authorName: {
    type: String,
    required: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'  // ⭐ User 모델과 연결
  },
  likes: [{
  type: Schema.Types.ObjectId,
  }],
  image: {
    type: mongoose.Schema.Types.Mixed,  // 어떤 값도 허용
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'posts'
});

module.exports = mongoose.model('Post', postSchema);