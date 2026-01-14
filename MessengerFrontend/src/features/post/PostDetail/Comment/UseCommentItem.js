'use client';

import { useState } from 'react';
import { UpdateCommentHandler, DeleteCommentHandler } from '@/../src/lib/CommentActions'

export default function useCommentItem(comment, postId) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async () => {
    if (!editValue.trim()) return alert("내용을 입력하세요.");

    const result = await UpdateCommentHandler(comment._id, editValue, postId);
    if (result.success) {
      setEditing(false);
    } else {
      alert(result.message || "수정 실패");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setDeleting(true);
    const result = await DeleteCommentHandler(comment._id, postId);
    
    if (result.error) {
      alert(result.error);
      setDeleting(false);
    } else {
      alert(result.message || "댓글이 삭제되었습니다.");
    }
  };

  const handleReplyComment = () => {
    setReplying(prev => !prev);
  };

  return {
    editing,
    setEditing,
    editValue,
    setEditValue,
    replying,
    setReplying,
    deleting,
    handleUpdate,
    handleDelete,
    handleReplyComment,
  };
}