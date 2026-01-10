'use client';

import PostForm from '@/features/post/create/CreatePostForm';

export default function UpdatePostForm({
  post,
  onSubmit,
  isPending,
}) {
  return (
    <PostForm
      post={post}
      onSubmit={onSubmit}
      isPending={isPending}
      submitButtonText="수정 완료"
    />
  );
}
