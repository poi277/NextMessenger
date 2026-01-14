// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { toggleLikeHandler } from '@/lib/postlike';
// import styles from '@/../css/PostLikeComponent.module.css';
// // PostLikeComponent.jsx
// export function PostLikeComponent({ post }) {
//   const { user } = useAuth();
  
//     if (!post) {
//     return null;
//   }

//   const initialLiked = user ? post.likes?.includes(user.userObjectId) : false;
//   const [liked, setLiked] = useState(initialLiked);
//   const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

//   useEffect(() => {
//     if (user) {
//       setLiked(post.likes?.includes(user.userObjectId));
//       setLikeCount(post.likes?.length || 0);
//     } else {
//       setLiked(false);
//     }
//   }, [user, post.likes]);

//   const handleToggleLike = async () => {
//     if (!user) return alert("로그인 후 이용 가능합니다.");

//     const previousLiked = liked;
//     const previousCount = likeCount;

//     const newLiked = !liked;
//     setLiked(newLiked);
//     setLikeCount(newLiked ? previousCount + 1 : previousCount - 1);

//     try {
//       await toggleLikeHandler(post._id);
//     } catch (err) {
//       console.error("좋아요 토글 실패:", err);
//       setLiked(previousLiked);
//       setLikeCount(previousCount);
//     }
//   };

//   const heartId = `heart-${post._id}`;

//   return (
//     <div className={styles.likeButton}>
      
//       <input
//         className={styles.on}
//         id={heartId}
//         type="checkbox"
//         checked={liked}
//         onChange={handleToggleLike}
//       />

//       <label className={styles.like} htmlFor={heartId}>
//         <svg
//             className={styles.likeIcon}
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//             >
//         <path
//             d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
//         ></path>
//         </svg>

//         <span className={styles.likeText}>
//           {"좋아요"}
//         </span>
//       </label>

//       {/* 좋아요 OFF 상태에서 보이는 숫자 */}
//       <span className={`${styles.likeCount} ${styles.one}`}>
//         {liked ? likeCount - 1 : likeCount}
//       </span>
//       {/* 좋아요 ON 상태에서 보이는 숫자 */}
//       <span className={`${styles.likeCount} ${styles.two}`}>
//         {liked ? likeCount : likeCount + 1}
//       </span>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toggleLikeHandler } from '@/lib/postlike';
import styles from '@/../css/PostLikeComponent.module.css';

export function PostLikeComponent({ post }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  if (!post) return null;

  const initialLiked = user ? post.likes?.includes(user.userObjectId) : false;
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    if (!user) {
      setLiked(false);
      return;
    }
    setLiked(post.likes?.includes(user.userObjectId));
    setLikeCount(post.likes?.length || 0);
  }, [post.likes, user]);

  const mutation = useMutation({
    mutationFn: () => toggleLikeHandler(post._id),

   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });// 이게 뭐지?
    },
    onError: (err, variables, context) => {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);

      if (context?.previousData) {
        queryClient.setQueryData(['posts'], context.previousData);
      }
      alert('좋아요 실패');
    },
    onMutate: async () => {
      
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousData = queryClient.getQueryData(['posts']);
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;

      setLiked(newLiked);
      setLikeCount(newCount);

      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((p) => {
                if (p._id === post._id) {
                  const newLikes = newLiked
                    ? [...(p.likes || []), user.userObjectId]
                    : (p.likes || []).filter(
                        (id) => id !== user.userObjectId
                      );

                  return { ...p, likes: newLikes };
                }
                return p;
              }),
            },
          })),
        };
      });

      return { previousData };
    },
  });


  const handleToggleLike = () => {
    if (!user) return alert('로그인 후 이용 가능합니다.');
    mutation.mutate();
  };

  const heartId = `heart-${post._id}`;

  return (
    <div className={styles.likeButton}>
      <input
        className={styles.on}
        id={heartId}
        type="checkbox"
        checked={liked}
        onChange={handleToggleLike}
      />

      <label className={styles.like} htmlFor={heartId}>
        <svg
          className={styles.likeIcon}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>

        <span className={styles.likeText}>좋아요</span>
      </label>

      {/* 좋아요 OFF */}
      <span className={`${styles.likeCount} ${styles.one}`}>
        {liked ? likeCount - 1 : likeCount}
      </span>

      {/* 좋아요 ON */}
      <span className={`${styles.likeCount} ${styles.two}`}>
        {liked ? likeCount : likeCount + 1}
      </span>
    </div>
  );
}