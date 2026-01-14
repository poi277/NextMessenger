// backend/routes/posts.js
const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const { authMiddleware, isLogin } = require('../middleware/auth');
const { deleteFile } = require('./s3');
const Comment = require('../models/Comment');
const { 
  checkPostPermission, 
  getFriendIds, 
  createPostFilter 
} = require('../utils/checkPostPermission');

const router = express.Router();

router.get('/all/page', isLogin, async (req, res) => {
  const { isLogin, userObjectId } = req.auth;

  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const skip = (page - 1) * limit;

  try {
    const friendIds = isLogin ? await getFriendIds(userObjectId) : [];
    const filter = createPostFilter(isLogin, userObjectId, friendIds);

    // posts + 1개 더 가져와서 hasNext 판단
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit + 1)
      .populate('authorId', 'name profileImage')
      .lean();

    const hasNext = posts.length > limit;
    const slicedPosts = hasNext ? posts.slice(0, limit) : posts;

    const postsWithCount = await Promise.all(
      slicedPosts.map(async post => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );
    res.json({
      success: true,
      data: {
        posts: postsWithCount,
        page,
        limit,
        hasNext,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '게시글 리스트 서버 오류' });
  }
});


//특정 게시글 조회
router.get('/:id', isLogin, async (req, res) => {
  const { isLogin, userObjectId } = req.auth;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      message: '게시물을 찾을 수 없습니다.',
    });
  }
  try {
    const permissionCheck = await checkPostPermission(
      id,
      userObjectId,
      isLogin
    );
    if (!permissionCheck.hasPermission) {
      return res.status(permissionCheck.status || 403).json({
        message: permissionCheck.message || '접근 권한이 없습니다.',
      });
    }
    const commentCount = await Comment.countDocuments({ postId: id });
    return res.json({
      success: true,
      data: {
        ...permissionCheck.post,
        commentCount,
      },
    });

  } catch (error) {
    console.error('POST DETAIL ERROR', error);
    return res.status(500).json({
      message: '게시글 서버 오류',
    });
  }
});

//게시글 생성
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, visibility, image } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '내용 필요' });
    }
    if (!['public', 'friends', 'private'].includes(visibility)) {
      return res.status(400).json({ message: '공개 범위 오류' });
    }

    const newPost = await Post.create({
      title: title || '제목 없음',
      content,
      visibility,
      image: image || [],
      authorName: req.session.userName,
      authorId: new mongoose.Types.ObjectId(req.session.userObjectId),
      likes: [],
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '생성중 서버 오류' });
  }
});

//게시글 수정
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, content, visibility, removeImagesKey = [], newImages = [] } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시물 없음' });

    if (!post.authorId.equals(req.session.userObjectId)) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    let updatedImages = post.image || [];
    for (const key of removeImagesKey) {
      try {
        await deleteFile(key);
        updatedImages = updatedImages.filter(img => img.key !== key);
      } catch (err) {
        console.warn('이미지 삭제 실패:', key, err);
      }
    }

    if (newImages.length > 0) updatedImages = [...updatedImages, ...newImages];

    post.title = title;
    post.content = content;
    post.visibility = visibility;
    post.image = updatedImages;
    post.updatedAt = new Date();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '수정중 서버 오류' });
  }
});

// 게시글 삭제
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: '게시물 없음' });

    if (!post.authorId.equals(req.session.userObjectId)) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }

    if (post.image?.length > 0) {
      for (const img of post.image) {
        if (img.key) await deleteFile(img.key);
      }
    }
    await post.deleteOne();
    res.json({ message: '삭제 완료' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '삭제중 서버 오류' });
  }
});

// 유저 게시글 목록
router.get('/userpostlist/:uuid', isLogin, async (req, res) => {
  const { isLogin, userObjectId } = req.auth;
  
  try {
    const targetUser = await User.findOne({ uuid: req.params.uuid });
    if (!targetUser) return res.status(404).json({ message: "유저 없음" });

    const friendIds = isLogin ? await getFriendIds(userObjectId) : [];
    const filter = createPostFilter(isLogin, userObjectId, friendIds, {
      authorId: targetUser._id
    });

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('authorId', 'name profileImage')
      .lean();  

    const postsWithCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );

    res.json(postsWithCount);
  } catch (error) {
    res.status(500).json({ message: '유저 게시글 목록 서버 오류'});
  }
});

// 유저 좋아요 게시글 목록
router.get('/userlikepost/:uuid', isLogin, async (req, res) => {
  const { isLogin, userObjectId } = req.auth;
  
  try {
    const targetUser = await User.findOne({ uuid: req.params.uuid });
    if (!targetUser) return res.status(404).json({ message: "유저 없음" });

    const friendIds = isLogin ? await getFriendIds(userObjectId) : [];
    const filter = createPostFilter(isLogin, userObjectId, friendIds, {
      likes: targetUser._id
    });

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate('authorId', 'name profileImage')
      .lean();

    const postsWithCount = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ postId: post._id });
        return { ...post, commentCount };
      })
    );

    res.json(postsWithCount);
  } catch (error) {
    res.status(500).json({ message: "좋아요 게시글 서버 오류" });
  }
});

// 유저 포토 목록
router.get('/userphotolist/:uuid', isLogin, async (req, res) => {
  const { isLogin, userObjectId } = req.auth;
  
  try {
    const targetUser = await User.findOne({ uuid: req.params.uuid });
    if (!targetUser) return res.status(404).json({ message: "유저 없음" });

    const friendIds = isLogin ? await getFriendIds(userObjectId) : [];
    const filter = createPostFilter(isLogin, userObjectId, friendIds, {
      authorId: targetUser._id
    });

    const posts = await Post.find(filter).sort({ createdAt: -1 }).lean();

    const photos = posts.flatMap(post =>
      (post.image || []).map(img => ({
        id: img.key,
        photoUrl: img.url,
        postId: post._id
      }))
    );

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: "포토 서버 오류"});
  }
});

module.exports = router;

