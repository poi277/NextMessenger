// components/CommentItem.jsx
'use client';

import styles from '@/../css/PostDetailComment.module.css';
import PostDetailCommentUpdate from './PostDetailCommentUpdate';
import { PostDetailCommentInput } from './PostDetailCommentInput';
import useCommentItem from './UseCommentItem';

export default function CommentItem({ comment, userObjectId, postId }) {
  const {
    editing,
    setEditing,
    editValue,
    setEditValue,
    replying,
    setReplying,
    deleting,
    handleUpdate,
    handleDelete,
    handleReplyComment,
  } = useCommentItem(comment, postId);

  const isAuthor = comment.authorId?._id === userObjectId;

  // 삭제된 댓글 렌더링
  if (comment.isDeleted) {
    return (
      <div>
        <div className={styles.deletedComment}>
          <p style={{ color: '#999', fontStyle: 'italic' }}>삭제된 댓글입니다</p>
        </div>
        {/* 대댓글들은 계속 표시 */}
        {comment.replies?.length > 0 && (
          <div className={styles.replies}>
            {comment.replies.map(reply => (
              <CommentItem 
                key={reply._id} 
                comment={reply} 
                userObjectId={userObjectId}
                postId={postId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.commentline}>
        {/* 본문 */}
        <div className={styles.postHeader}>
          <div className={styles.profilePic}>
            <img
              src={comment.authorId?.profileImage?.url || "/default-profile.png"}
              alt={comment.authorId?.profileImage?.key || "profile"}
            />
          </div>
          <div className={styles.postUserInfo}>
            <span className={styles.username}>
              {comment.authorId?.name || '알 수 없음'}
            </span>
          </div>
        </div>
        
        <div>
          {editing ? (
            <PostDetailCommentUpdate 
              editValue={editValue}
              setEditValue={setEditValue}
              handleUpdate={handleUpdate}
            />
          ) : (
            <>{comment.content}</>
          )} 
        </div>

        {/* 날짜 + 버튼 */}
        <div className={styles.commentSubRow}>
          <span>{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>

          <div className={styles.commentButtons}>
            <button onClick={handleReplyComment}>
              {replying ? (
                <svg className={styles.cancelButton} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none">
                  <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={styles.reply}>
                  <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2v64H176C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96h96v64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z"></path>
                </svg>
              )}
            </button>

            {isAuthor && (
              <>
                {editing ? (
                  <button onClick={() => setEditing(false)}>
                    <svg className={styles.cancelButton} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" fill="none">
                      <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => setEditing(true)} className={styles.editBtn}>
                    <svg height="1em" viewBox="0 0 512 512">
                      <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className={styles.deleteBtn}
                  disabled={deleting}
                >
                  <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg">
                    <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>  

      {/* 답글 입력폼 */}
      {replying && (
        <PostDetailCommentInput 
          postId={postId} 
          parentId={comment._id} 
          onSuccess={() => setReplying(false)}
        />
      )}

      {/* 대댓글들 재귀 렌더링 */}
      {comment.replies?.length > 0 && (
        comment.replies.map(reply => (
          <div key={reply._id} className={styles.repliesArrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#cfcfcf">
              <path d="M14 11v-4l7 7-7 7v-4c-6 0-10-3-11-8 2.5 3.5 6 5 11 5z"/>
            </svg>
            <div className={styles.replies}>
              <CommentItem
                key={reply._id}
                comment={reply}
                userObjectId={userObjectId}
                postId={postId}
              />
            </div>
          </div>  
        ))
      )}
    </div>
  );
}