const express = require('express');
const User = require('../models/User'); 
const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.json([]);
    }

    const users = await User.find({
      name: { $regex: searchTerm, $options: "i" }
    }).select('uuid name profileImage.url');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '헤더 서버 오류' });
  }
});


module.exports = router;