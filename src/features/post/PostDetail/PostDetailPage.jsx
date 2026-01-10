'use client';

import styles from '@/../css/PostDetail.module.css';
import PostCard from '@/features/post/common/PostCard';
import PostDetailComment from './Comment/PostDetailComment';

export default function PostDetailPage({ post }) {
  return (
      <div className={styles.feedWrapper}>
        <div className={styles.feedContainer}>
          <div className={styles.postAndComments}>
          <PostCard post={post} showDeleteButton={true} />
            <PostDetailComment
                  postId={post._id}
                  comments={post.comments}
                />
          </div>
        </div>
      </div>
  );
}
