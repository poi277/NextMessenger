'use server'
import { revalidatePath } from 'next/cache';
import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

// 댓글 조회
export async function CommentGetHandler(postId) {
  return apiFetch(`${API_URL}/api/comments/${postId}`, {
    auth: true,
  });
}
// 댓글 작성
export async function CommentSubmitHandler(postId, newComment, parentId) {
  const result = await apiFetch(`${API_URL}/api/comments/${postId}`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({
      newComment,
      parentId,
    }),
  });

  if (result.success) {
    revalidatePath(`/posts/${postId}`);
  }

  return result;
}
// 댓글 수정
export async function UpdateCommentHandler(commentId, newContent, postId) {
  const result = await apiFetch(`${API_URL}/api/comments/${commentId}`, {
    auth: true,
    method: 'PUT',
    body: JSON.stringify({ content: newContent }),
  });

  if (result.success) {
    revalidatePath(`/posts/${postId}`);
  }

  return result;
}
// 댓글 삭제
export async function DeleteCommentHandler(commentId, postId) {
  const result = await apiFetch(`${API_URL}/api/comments/${commentId}`, {
    auth: true,
    method: 'DELETE',
  });

  if (result.success) {
    revalidatePath(`/posts/${postId}`);
  }

  return result;
}
