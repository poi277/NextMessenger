const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const { authMiddleware, isLogin } = require('../middleware/auth');
const { checkPostPermission } = require('../utils/checkPostPermission');
const router = express.Router();

router.get('/:postId', isLogin, async (req, res) => {
  const { postId } = req.params;
  const { isLogin, userObjectId } = req.auth;

  try {
    const permissionCheck = await checkPostPermission(postId, userObjectId, isLogin);
    
    if (!permissionCheck.hasPermission) {
      return res.status(permissionCheck.status).json({ 
        success: false, 
        message: permissionCheck.message 
      });
    }

    // 댓글 조회
    const comments = await Comment.find({ postId })
      .sort({ createdAt: 1 })
      .populate('authorId', 'name profileImage')
      .lean();

    // 트리 구조로 변환
    const commentMap = {};
    const roots = [];

    comments.forEach(comment => {
      commentMap[comment._id.toString()] = {
        ...comment,
        replies: []
      };
    });

    comments.forEach(comment => {
      const commentId = comment._id.toString();
      
      if (comment.parentId) {
        const parentId = comment.parentId.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(commentMap[commentId]);
        }
      } else {
        roots.push(commentMap[commentId]);
      }
    });

    res.json({ comments: roots });
  } catch (err) {
    res.status(500).json({ success: false, message: '댓글 조회 실패' });
  }
});

//작성
router.post('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  let { newComment, parentId } = req.body; //let으로 선언해야 재할당 가능

  try {
    const authorId = req.user.userObjectId;
    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (parent && parent.parentId) {
        // 부모가 원댓글이 아니라 대댓글이면
        // 대대댓글 방지: 최상위 댓글의 _id로 변경
        parentId = parent.parentId;
      }
    }

    const comment = await Comment.create({
      content: newComment,
      authorId,
      postId,
      parentId: parentId || null,
      isDeleted: false
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'name profileImage');

    res.status(201).json({ success: true, comment: populatedComment });

  } catch (err) {
    res.status(500).json({ success: false, message: '댓글 작성 실패' });
  }
});


// 수정
router.put('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "내용이 비었습니다." });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ success: false, message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.isDeleted) {
      return res.status(400).json({ success: false, message: "삭제된 댓글은 수정할 수 없습니다." });
    }

    if (comment.authorId.toString() !== req.user.userObjectId) {
      return res.status(403).json({ success: false, message: "수정 권한이 없습니다." });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findById(commentId)
      .populate('authorId', 'name profileImage');

    res.json({
      success: true,
      message: "댓글이 수정되었습니다.",
      comment: updatedComment
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "댓글 수정 실패" });
  }
});

// 삭제
router.delete('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: '댓글을 찾을 수 없습니다' 
      });
    }

    // 권한 체크
    if (comment.authorId.toString() !== req.user.userObjectId) {
      return res.status(403).json({ 
        success: false, 
        message: '삭제 권한이 없습니다' 
      });
    }

    // 뒤에 형제 댓글이 있는지 확인
    const hasLaterSiblings = await Comment.exists({
      parentId: comment.parentId,
      createdAt: { $gt: comment.createdAt }
    });

    if (hasLaterSiblings) {
      // 뒤에 댓글이 있음 → Soft delete
      await Comment.updateOne(
        { _id: commentId },
        { 
          content: null, 
          isDeleted: true,
          authorId: null 
        }
      );
      
      res.json({ 
        success: true, 
        message: '댓글이 삭제되었습니다',
        deleteType: 'soft'
      });
    } else {
      // 뒤에 댓글이 없음 → Hard delete
      await Comment.deleteOne({ _id: commentId });
      
      // 앞의 삭제된 댓글들도 정리
      await cleanupPreviousComments(comment);
      
      res.json({ 
        success: true, 
        message: '댓글이 삭제되었습니다',
        deleteType: 'hard'
      });
    }

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: '댓글 삭제 실패' 
    });
  }
});

// 앞의 삭제된 댓글들을 연쇄적으로 정리하는 함수
async function cleanupPreviousComments(deletedComment) {
  let currentComment = deletedComment;
  
  while (true) {
    // 바로 앞의 삭제된 댓글 찾기
    const previousDeleted = await Comment.findOne({
      parentId: currentComment.parentId,
      isDeleted: true,
      createdAt: { $lt: currentComment.createdAt }
    })
    .sort({ createdAt: -1 });
    
    if (!previousDeleted) break;
    
    // 이 댓글 뒤에 살아있는 댓글이 있는지 확인
    const hasLaterSiblings = await Comment.exists({
      parentId: previousDeleted.parentId,
      createdAt: { $gt: previousDeleted.createdAt }
    });
    
    if (hasLaterSiblings) {
      break; // 뒤에 댓글 있으면 중단
    }
    
    // 없으면 삭제하고 계속 진행
    await Comment.deleteOne({ _id: previousDeleted._id });
    currentComment = previousDeleted;
  }
}

module.exports = router;