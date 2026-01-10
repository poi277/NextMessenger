const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/profile/:uuid
router.get('/:uuid', async (req, res) => {
  const { uuid } = req.params;

  try {
    const user = await User.findOne({ uuid })
      .select('name profileImage.url introduce')
      .lean();
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const postCount = await Post.countDocuments({ authorId: user._id });
    res.json({
      ...user,
      postCount,
      photoUrl: user.profileImage?.url || "/default-profile.png"
    });

  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;

