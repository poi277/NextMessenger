'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  MylikepostList,
  MyphotoList,
  UserPostList
} from '@/lib/userPostList';

export default function UserMyMessenger() {
  const { loading, user } = useAuth();
  const { uuid } = useParams();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('myPosts');

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
        let res;
        if (filter === 'myPosts') {
          res = await UserPostList(uuid);
        }

        if (filter === 'likedPosts') {
          res = await MylikepostList(uuid);
        }

        if (filter === 'myPhotos') {
          const photoRes = await MyphotoList(uuid);
          if(!photoRes.success)
          {
            throw new Error(photoRes.message);
          }
          const formattedPosts = photoRes.data.map(post => ({
            _id: post.id,
            photos: [
              {
                url: post.photoUrl,
                key: post.id,
              },
            ],
            postId: post.postId,
          }));

          setPosts(formattedPosts);
          return;
        }

        // 공통 에러 처리
        if (!res.success) {
          throw new Error(res.message);
        }
        setPosts(res.data ?? []);
      } 
    fetchData();
  }, [uuid, filter]);

  const goToPost = (postId) => {
    router.push(`/posts/${postId}`);
  };

  return {
    loading,
    user,
    uuid,
    posts,
    filter,
    setFilter,
    goToPost,
  };
}
