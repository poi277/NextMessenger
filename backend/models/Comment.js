// models/Comment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    default: null // isDeleted일 때 null 가능하도록
  },
  authorId: {
    type: Schema.Types.ObjectId,  
    ref: 'User',
    default: null // 삭제 시 null로 변경
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'comments'
});

module.exports = mongoose.model('Comment', commentSchema);
