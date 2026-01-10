// PostDetailCommentInput.jsx
import { CommentSubmitHandler } from '@/../src/lib/CommentActions'
import { useState } from 'react';
import styles from '@/../css/PostDetailCommentInput.module.css';
import { useAuth } from '@/context/AuthContext';

export function PostDetailCommentInput({ postId, parentId = null, onSuccess }) {
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuth();

  const CommentSubmitButton = async () => { 
    if (!newComment.trim()) return alert("댓글을 입력해주세요.");
    if (!user) return alert("로그인이 필요합니다.");

    setSubmitting(true);

    try {
      console.log('제출:', postId, newComment, parentId);
      const result = await CommentSubmitHandler(postId, newComment, parentId);
      
      if (result.error) {
        alert(result.error);
      } else if (result.success) {
        setNewComment("");
        
        // 답글 작성 후 입력폼 닫기
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "댓글 작성 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return (
              <div className={styles.registerFormRowOther}>
                <div className={styles.registerRowInputContainerButtonon}>
                  <div className={styles.inputButtoncontainer}>
                    <div className={styles.inputFieldButtonon}>
                      <input
                        className={styles.inputLabel}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder={parentId ? "답글을 입력하세요" : "댓글을 입력하세요"}
                        disabled={submitting}
                      />
                    </div>
                    <button type="button" className={styles.registerMiddleButton} onClick={CommentSubmitButton}>
                      확인
                    </button>
                  </div>
                </div>
              </div>
  );
}