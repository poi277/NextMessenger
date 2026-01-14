'use client';

import Profile from "../../profile/Profile";
import PostCard from "../common/PostCard";
import UserMyMessenger from "./UserMyMessenger";
import styles from '@/../css/UserMyMessenger.module.css'

export default function UserMyMessengerForm() {
  const {
    loading,
    user,
    uuid,
    posts,
    filter,
    setFilter,
    goToPost,
  } = UserMyMessenger();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.feedWrapper}>
      <Profile uuid={uuid}/>
      <div>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButtonSelect} ${filter === "myPosts" ? "active" : ""}`}
            onClick={() => setFilter("myPosts")}
          >
            내 게시물
          </button>
          <div className={styles.filterButtonGap}>|</div>
          <button
            className={`${styles.filterButtonSelect} ${filter === "myPhotos" ? "active" : ""}`}
            onClick={() => setFilter("myPhotos")}
          >
            내 사진
          </button>
          <div className={styles.filterButtonGap}>|</div>
          <button
            className={`${styles.filterButtonSelect} ${filter === "likedPosts" ? "active" : ""}`}
            onClick={() => setFilter("likedPosts")}
          >
            좋아요한 게시물
          </button>
        </div>

        <div className={styles.feedContainer}>
          {filter === "myPhotos" ? (
            <div className={styles.photoGrid}>
              {posts.length === 0 ? (
                <p>
                  사진이 없습니다.
                </p>
              ) : 
                posts.flatMap(post => post.photos).map((photo, index) => (
                  <img
                    key={`photo-${photo?.key}-${index}`}
                    src={photo?.url}
                    alt={`photo-${photo?.key}`}
                    className={styles.photoItem}
                    onClick={() => router.push(`/posts/${photo.postId}`)}
                  />
                ))
              }
            </div>
          ) : posts.length === 0 ? (
            <p>
              게시물이 없습니다.
            </p>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}