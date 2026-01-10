'use client';

import { useRouter } from 'next/navigation';
import styles from '@/../css/PostCard.module.css'; 
import { PostLikeComponent } from './PostLikeComponent';
import PostImageComponent from './PostImageComponent';
import DeleteButton from './DeleteButton';

export default function PostCard({ post, showDeleteButton = false, onClick }) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(post._id);
    } else {
      router.push(`/posts/${post._id}`);
    }
  };

  return (
    <div className={styles.postCard} onClick={handleClick}>
      {/* 헤더 */}
      <div className={styles.postHeader}>
        <div className={styles.profilePic}>
          <img
            src={post.authorId?.profileImage?.url || "/default-profile.png"}
            alt={post.authorId?.profileImage?.key || "profile"}
          />
        </div>
        <div className={styles.postUserInfo}>
          <span className={styles.username}>{post.authorId?.name || "알 수 없음"}</span>
          <span className={styles.postTime}>
            {new Date(post.createdAt).toLocaleString()}
          </span>
          {post.visibility && (
            <span className={styles.postTime}>
              {`(공개 범위 : ${post.visibility})`}
            </span>
          )}
        </div>
      </div>

      {/* 본문 */}
      <div className={styles.postContent}>{post.content}</div>

      {/* 이미지 */}
      <PostImageComponent post={post} />

      {/* 좋아요 + 댓글 */}
      <div className={styles.postActions}>
        <div 
          className={styles.postActionsLeft}
          onClick={e => e.stopPropagation()}
        >
          <PostLikeComponent post={post} />
        </div>
        <div className={styles.postActionsRight}>
          <span className={styles.commentCount}>
            댓글 {post.commentCount ?? 0}개
          </span>
          {showDeleteButton && <DeleteButton post={post} />}
        </div>
      </div>
    </div>
  );
}