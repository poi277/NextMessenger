'use client';

import styles from "@/../css/Profile.module.css";

export default function ProfileView({ user }) {
  return (
    <div className={styles.profileSidebar}>
      {/* 프로필 사진 */}
      <div className={styles.profilePhoto}>
        <img
          src={user?.photoUrl || "/default-profile.png"}
          alt={user?.name || "프로필"}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      </div>

      {/* 프로필 정보 */}
      <div className={styles.profileContainer}>
        <div className={styles.profileContainerName}>
          {user?.name || "사용자"}
        </div>

        <div className={styles.profileContainerPost}>
          게시물 {user?.postCount ?? 0}
        </div>

        <div className={styles.profileContainerIntroduction}>
          {user?.introduce || "소개글이 없습니다."}
        </div>
      </div>
    </div>
  );
}
