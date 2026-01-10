// frontend/lib/actions.js
'use server';

import { revalidatePath } from 'next/cache';
import { savePosts, updatePosts } from './Posts';
import { redirect } from 'next/navigation';

export async function createPost(formData) {
  const posts = {
    title: formData.get('title'),
    content: formData.get('content'),
    visibility: formData.get('visibility'),
    files: formData.getAll('files'),
  };

  if (!posts.content || posts.content.trim() === '') {
    return { success: false, message: '내용을 입력하세요.' };
  }

  const result = await savePosts(posts);
  return result;
}

export async function updatePost(formData) {
  const posts = {
    id: formData.get('postid'),
    title: formData.get('title'),
    content: formData.get('content'),
    visibility: formData.get('visibility'),
    files: formData.getAll('files'),
    removeImages: JSON.parse(formData.get('removeImages') || '[]'),
  };

  if (!posts.content || posts.content.trim() === '') {
    return { error: '내용을 입력하세요.' };
  }
  const result = await updatePosts(posts);

  // ✅ 에러가 있으면 redirect 하지 않음
  if (!result.success) {
    return result;
  }
  // 성공 시 해당 게시물 페이지로 이동
  redirect(`/posts/${posts.id}`);
}
