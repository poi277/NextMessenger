// components/FriendSidebar.jsx
"use client";

import styles from '@/../css/FriendSidebar.module.css';
import useFriendSidebar from './useFriendSidebar';

export default function FriendSidebar() {
  const {
    mode,
    setMode,
    friends,
    newFriendId,
    setNewFriendId,
    isAddOpen,
    setIsAddOpen,
    pendingRequests,
    openDropdownId,
    loading,
    addDropdownRef,
    friendDropdownRefs,
    handleSendFriendRequest,
    handleAccept,
    handleReject,
    handleDeleteFriend,
    toggleDropdown,
    handleGoToFriendPage,
    handleChating,
  } = useFriendSidebar();

  if (loading) {
    return <div className={styles.friendSidebar}>로딩 중...</div>;
  }

  return (
    <div className={styles.friendSidebar}>
      <div className={styles.topMenu}>
        <div className={styles.frame37}>
          <button
            className={`${styles.topMenuButton} ${styles.friends} ${mode === "friends" ? styles.active : ""}`}
            onClick={() => setMode("friends")}
          >
            친구 목록
          </button>

          <button
            className={`${styles.topMenuButton} ${styles.pending} ${mode === "pending" ? styles.active : ""}`}
            onClick={() => setMode("pending")}
          >
            친구 대기
          </button>
        </div>

        <div ref={addDropdownRef}>
          <button
            className={`${styles.topMenuButton} ${styles.addFriend} ${isAddOpen ? styles.active : ""}`}
            onClick={() => setIsAddOpen(!isAddOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <g clipPath="url(#clip0_167_852)">
                <rect width="24" height="24" transform="translate(0 0.5)" fill="white"/>
                <path d="M18 18.5H17.8477C17.668 17.625 17.3516 16.8203 16.8984 16.0859C16.4453 15.3516 15.8945 14.7188 15.2461 14.1875C14.5977 13.6562 13.8672 13.2422 13.0547 12.9453C12.2422 12.6484 11.3906 12.5 10.5 12.5C9.8125 12.5 9.14844 12.5898 8.50781 12.7695C7.86719 12.9492 7.26953 13.1992 6.71484 13.5195C6.16016 13.8398 5.65625 14.2305 5.20312 14.6914C4.75 15.1523 4.35938 15.6602 4.03125 16.2148C3.70312 16.7695 3.44922 17.3672 3.26953 18.0078C3.08984 18.6484 3 19.3125 3 20H1.5C1.5 19.0625 1.63672 18.1602 1.91016 17.293C2.18359 16.4258 2.57812 15.625 3.09375 14.8906C3.60938 14.1562 4.21875 13.5039 4.92188 12.9336C5.625 12.3633 6.42188 11.9141 7.3125 11.5859C6.42969 11.0078 5.74219 10.2812 5.25 9.40625C4.75781 8.53125 4.50781 7.5625 4.5 6.5C4.5 5.67188 4.65625 4.89453 4.96875 4.16797C5.28125 3.44141 5.70703 2.80469 6.24609 2.25781C6.78516 1.71094 7.42188 1.28125 8.15625 0.96875C8.89062 0.65625 9.67188 0.5 10.5 0.5C11.3281 0.5 12.1055 0.65625 12.832 0.96875C13.5586 1.28125 14.1953 1.70703 14.7422 2.24609C15.2891 2.78516 15.7188 3.42188 16.0312 4.15625C16.3438 4.89062 16.5 5.67188 16.5 6.5C16.5 7.01562 16.4375 7.51953 16.3125 8.01172C16.1875 8.50391 16 8.96875 15.75 9.40625C15.5 9.84375 15.207 10.2461 14.8711 10.6133C14.5352 10.9805 14.1406 11.3047 13.6875 11.5859C14.5625 11.9219 15.3672 12.3828 16.1016 12.9688C16.8359 13.5547 17.4688 14.2422 18 15.0312V18.5ZM6 6.5C6 7.125 6.11719 7.70703 6.35156 8.24609C6.58594 8.78516 6.90625 9.26172 7.3125 9.67578C7.71875 10.0898 8.19531 10.4141 8.74219 10.6484C9.28906 10.8828 9.875 11 10.5 11C11.1172 11 11.6992 10.8828 12.2461 10.6484C12.793 10.4141 13.2695 10.0938 13.6758 9.6875C14.082 9.28125 14.4062 8.80469 14.6484 8.25781C14.8906 7.71094 15.0078 7.125 15 6.5C15 5.88281 14.8828 5.30078 14.6484 4.75391C14.4141 4.20703 14.0938 3.73047 13.6875 3.32422C13.2812 2.91797 12.8008 2.59375 12.2461 2.35156C11.6914 2.10938 11.1094 1.99219 10.5 2C9.875 2 9.29297 2.11719 8.75391 2.35156C8.21484 2.58594 6.73828 2.90625 7.32422 3.3125C6.91016 3.71875 6.58594 4.19922 6.35156 4.75391C6.11719 5.30859 6 5.89062 6 6.5ZM21 20H24V21.5H21V24.5H19.5V21.5H16.5V20H19.5V17H21V20Z" fill="#777777"/>
              </g>
              <defs>
                <clipPath id="clip0_167_852">
                  <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
              </defs>
            </svg>
            <div className={styles.vector}>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
                <path d="M17 18.5H16.8477C16.668 17.625 16.3516 16.8203 15.8984 16.0859C15.4453 15.3516 14.8945 14.7188 14.2461 14.1875C13.5977 13.6562 12.8672 13.2422 12.0547 12.9453C11.2422 12.6484 10.3906 12.5 9.5 12.5C8.8125 12.5 8.14844 12.5898 7.50781 12.7695C6.86719 12.9492 6.26953 13.1992 5.71484 13.5195C5.16016 13.8398 4.65625 14.2305 4.20312 14.6914C3.75 15.1523 3.35938 15.6602 3.03125 16.2148C2.70312 16.7695 2.44922 17.3672 2.26953 18.0078C2.08984 18.6484 2 19.3125 2 20H0.5C0.5 19.0625 0.636719 18.1602 0.910156 17.293C1.18359 16.4258 1.57812 15.625 2.09375 14.8906C2.60938 14.1562 3.21875 13.5039 3.92188 12.9336C4.625 12.3633 5.42188 11.9141 6.3125 11.5859C5.42969 11.0078 4.74219 10.2812 4.25 9.40625C3.75781 8.53125 3.50781 7.5625 3.5 6.5C3.5 5.67188 3.65625 4.89453 3.96875 4.16797C4.28125 3.44141 4.70703 2.80469 5.24609 2.25781C5.78516 1.71094 6.42188 1.28125 7.15625 0.96875C7.89062 0.65625 8.67188 0.5 9.5 0.5C10.3281 0.5 11.1055 0.65625 11.832 0.96875C12.5586 1.28125 13.1953 1.70703 13.7422 2.24609C14.2891 2.78516 14.7188 3.42188 15.0312 4.15625C15.3438 4.89062 15.5 5.67188 15.5 6.5C15.5 7.01562 15.4375 7.51953 15.3125 8.01172C15.1875 8.50391 15 8.96875 14.75 9.40625C14.5 9.84375 14.207 10.2461 13.8711 10.6133C13.5352 10.9805 13.1406 11.3047 12.6875 11.5859C13.5625 11.9219 14.3672 12.3828 15.1016 12.9688C15.8359 13.5547 16.4688 14.2422 17 15.0312V18.5ZM5 6.5C5 7.125 5.11719 7.70703 5.35156 8.24609C5.58594 8.78516 5.90625 9.26172 6.3125 9.67578C6.71875 10.0898 7.19531 10.4141 7.74219 10.6484C8.28906 10.8828 8.875 11 9.5 11C10.1172 11 10.6992 10.8828 11.2461 10.6484C11.793 10.4141 12.2695 10.0938 12.6758 9.6875C13.082 9.28125 13.4062 8.80469 13.6484 8.25781C13.8906 7.71094 14.0078 7.125 14 6.5C14 5.88281 13.8828 5.30078 13.6484 4.75391C13.4141 4.20703 13.0938 3.73047 12.6875 3.32422C12.2812 2.91797 11.8008 2.59375 11.2461 2.35156C10.6914 2.10938 10.1094 1.99219 9.5 2C8.875 2 8.29297 2.11719 7.75391 2.35156C7.21484 2.58594 6.73828 2.90625 6.32422 3.3125C5.91016 3.71875 5.58594 4.19922 5.35156 4.75391C5.11719 5.30859 5 5.89062 5 6.5ZM20 20H23V21.5H20V24.5H18.5V21.5H15.5V20H18.5V17H20V20Z" fill="#777777"/>
              </svg>
            </div>
          </button>
          {isAddOpen && (
            <div className={styles.addDropdown} onClick={(e) => e.stopPropagation()}>
              <input 
                type="text" 
                placeholder="친구 ID 입력" 
                value={newFriendId} 
                onChange={e => setNewFriendId(e.target.value)} 
                onKeyDown={e => {if(e.key === 'Enter') handleSendFriendRequest();}} 
                className={styles.addFriendInput} 
              />
              <button onClick={handleSendFriendRequest} className={styles.addFriendButton}>
                추가
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* 친구 목록 */}
        {mode === "friends" &&
          (friends.length === 0 ? (
            <p>친구가 없습니다.</p>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                className={styles.friendItem}
                onClick={() => toggleDropdown(friend._id)}
                ref={(el) => (friendDropdownRefs.current[friend._id] = el)}
              >
                <div className={styles.friendInfo}>
                  <div className={styles.profileCircle}>
                    {friend.profileImage && (
                      <img src={friend.profileImage.url} alt={friend.name} />
                    )}
                    {friend.isOnline && <span className={styles.onlineDot}></span>}
                  </div>
                  <span className={styles.frame15}>{friend.name}</span>
                </div>

                {openDropdownId === friend._id && (
                  <div 
                    className={styles.dropdownMenu}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className={`${styles.dropdownButton} ${styles.gotoPageBtn}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoToFriendPage(friend.uuid);
                      }}
                    >
                      친구페이지로
                    </button>

                    <button
                      className={`${styles.dropdownButton} ${styles.deleteBtn}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFriend(friend._id);
                      }}
                    >
                      친구 삭제
                    </button>
                    <button
                      className={`${styles.dropdownButton} ${styles.gotoPageBtn}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChating(friend.uuid);
                      }}
                    >
                      채팅
                    </button>
                  </div>
                )}
              </div>
            ))
          ))}

        {/* 대기 목록 */}
        {mode === "pending" &&
          (pendingRequests.length === 0 ? (
            <p>대기 중인 친구 요청이 없습니다.</p>
          ) : (
            pendingRequests.map((req) => (
              <div key={req._id} className={styles.pendingItem}>
                <div className={styles.pendingInfo}>
                  <div className={styles.pendingProfileCircle}>
                    <img 
                      src={req.requester?.profileImage.url || "/default-profile.png"} 
                      alt={req.requester?.name || "사용자"} 
                    />
                  </div>
                  <span>{req.requester?.name || "알 수 없음"} 님이 친구 요청을 보냈습니다.</span>
                </div>

                <div className={styles.pendingActions}>
                  <button 
                    className={`${styles.pendingActionButton} ${styles.acceptBtn}`}
                    onClick={() => handleAccept(req._id)}
                  >
                    수락
                  </button>
                  <button 
                    className={`${styles.pendingActionButton} ${styles.rejectBtn}`}
                    onClick={() => handleReject(req._id)}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          ))}
      </div>
    </div>
  );
}