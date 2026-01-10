// frontend/lib/savePosts.js
'use server';

import { uploadImagesToS3 } from './imagesave';
import { API_URL } from '../util/URLconfig';
import { apiFetch } from '../util/apiClient';

export async function getPostOne(postId) {
  return await apiFetch(`${API_URL}/api/posts/${postId}`);
}


export async function getPostAndComment(postId) {
  const postRes = await apiFetch(`${API_URL}/api/posts/${postId}`);
  if (!postRes.success) return postRes;

  const commentRes = await apiFetch(`${API_URL}/api/comments/${postId}`);
  return {
    success: true,
    data: {
      ...postRes.data,
      comments: commentRes.success ? commentRes.data : [],
    },
  };
}

export async function getAllPosts() {
  return await apiFetch(`${API_URL}/api/posts`);
}


export async function getPostsPage({ pageParam = 1 }) {
  return apiFetch(
    `${API_URL}/api/posts/all/page?page=${pageParam}&limit=10`,
    {
      method: 'GET',
      auth: false,
    }
  );
} 

export async function savePosts(posts) {
  const uploadedFilesRes = [];

  if (posts.files?.length) {
    for (const file of posts.files) {
      if (!file.size) continue;

      try {
        uploadedFilesRes.push(await uploadImagesToS3(file, "posts"));
      } catch {
        return {
          success: false,
          message: `파일 업로드 실패: ${file.name}`,
        };
      }
    }
  }

  const uploadedImages = uploadedFilesRes
    .filter(res => res.success)
    .map(res => res.data);

  const res = await apiFetch(`${API_URL}/api/posts`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({
      title: posts.title,
      content: posts.content,
      visibility: posts.visibility,
      image: uploadedImages,
    }),
  });

  return res;
}

export async function updatePosts(posts) {
  const uploadedFilesRes = [];

  if (posts.files?.length) {
    for (const file of posts.files) {
      if (!file.size) continue;

      try {
        uploadedFilesRes.push(await uploadImagesToS3(file, "posts"));
      } catch {
        return {
          success: false,
          status: 400,
          message: `파일 업로드 실패: ${file.name}`,
        };
      }
    }
  }

  const uploadedImages = uploadedFilesRes
    .filter(res => res.success)
    .map(res => res.data);

  const res = await apiFetch(`${API_URL}/api/posts/${posts.id}`, {
    auth: true,
    method: "PUT",
    body: JSON.stringify({
      title: posts.title,
      content: posts.content,
      visibility: posts.visibility,
      removeImagesKey: posts.removeImages,
      newImages: uploadedImages,
    }),
  });

  return res;
}

export async function deletePost(postId) {
  const res = await apiFetch(`${API_URL}/api/posts/${postId}`, {
    auth: true,
    method: 'DELETE',
  });

  return res;
}
