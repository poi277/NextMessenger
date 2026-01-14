// components/PostDetailComment.jsx
'use client';

import styles from '@/../css/PostDetailComment.module.css';
import { PostDetailCommentInput } from './PostDetailCommentInput';
import { useAuth } from '@/context/AuthContext';
import CommentItem from './CommentItem';

export default function PostDetailComment({ postId, comments }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: '50px' }}>로딩중...</div>;
  
  const commentList = comments?.comments || [];
  
  return (
    <div className={styles.commentSection}>
      <PostDetailCommentInput postId={postId} />
      <div>
        {commentList.map(comment => (
          <CommentItem 
            key={comment._id} 
            comment={comment} 
            userObjectId={user?.userObjectId ?? ""} 
            postId={postId} 
          />
        ))}
      </div>
    </div>
  );
}