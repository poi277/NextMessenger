'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import UpdatePostForm from './UpdatePostForm';
import { updatePost } from '@/lib/Postaction';

export default function UpdatePost({ post }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (formData) => {
    if (isPending) return;
    setIsPending(true);

    const res = await updatePost(formData);

    if (!res.success) {
      alert(res.message);
      setIsPending(false);
      return;
    }

    router.push(`/posts/${post._id}`);
  };

  return (
    <UpdatePostForm
      post={post}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}
