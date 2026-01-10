'use client';

import styles from '@/../css/HomePage.module.css';
import PostCard from '@/features/post/common/PostCard';
import {getPostsPage} from '@/lib/Posts'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

export default function HomePageForm({ initialPosts }) {
  const bottomRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getPostsPage({ pageParam }),
    initialPageParam: 1,

    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.success) return undefined;
      return lastPage.data.hasNext
        ? pages.length + 1
        : undefined;
    },

    initialData: {
      pages: [
        {
          success: true,
          data: {
            posts: initialPosts,
            hasNext: true, // 첫 페이지 기준
          },
        },
      ],
      pageParams: [1],
    },
  });

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts =
    data?.pages.flatMap(page => page?.data?.posts ?? []) ?? [];
  return (
    <div className={styles.displayWrapper}>
      <div className={styles.feedWrapper}>
        <div className={styles.feedContainer}>
           {posts.map(post => (
            <PostCard key={post._id} post={post} />
           ))}
             <div ref={bottomRef} style={{ height: 1 }} />

        </div>
      </div>
    </div>
  );
}