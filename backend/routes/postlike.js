const express = require('express');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware/auth');
const Post = require('../models/Post'); 

const router = express.Router();

// 좋아요 토글 API (_id 기준)
router.post('/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const userObjectId = req.session.userObjectId;

    // 게시글 조회
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    let liked;
    const index = post.likes.findIndex(id => id.toString() === userObjectId.toString());

    if (index !== -1) {
      // 좋아요 취소
      post.likes.splice(index, 1);
      liked = false;
    } else {
      // 좋아요 추가
      post.likes.push(new mongoose.Types.ObjectId(userObjectId));
      liked = true;
    }


    // likeCount 계산
    post.likeCount = post.likes.length;

    await post.save();

    res.json({
      likes: post.likes,
      likeCount: post.likeCount,
      liked,
    });
  } catch (err) {
    res.status(500).json({ message: '좋아요 처리 서버 오류' });
  }
});

module.exports = router;
