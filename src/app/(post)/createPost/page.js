'use client';
import React from 'react';
import { useRequireAuth } from '@/context/RequireAuth';
import { createPost } from '../../../lib/Postaction';
import PostForm from '@/features/post/create/CreatePostForm';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const { user, loading } = useRequireAuth();
  const router = useRouter();
  if (loading) return <div style={{ padding: '50px' }}>로딩중...</div>;

    const handleSubmit = async (formData) => {
    const res = await createPost(formData);

    if (!res.success) {
      alert(res.message);
      return;
    }

    router.push(`/posts/${res.data._id}`);
  };


  return (
    <PostForm
      onSubmit={handleSubmit}
      isPending={false}
      submitButtonText="게시물 등록"
    />
  );
}