'use client';

import styles from '@/../css/Header.module.css';
import { useHeaderLogic } from './Header.logic';

export default function Header() {
  const {
    user,
    loading,
    searchTerm,
    setSearchTerm,
    searchResults,
    isMenuOpen,
    setIsMenuOpen,
    menuRef,
    handleLoginClick,
    handleStoreClick,
    handleWriteClick,
    handleMyPage,
    handleLogout,
    handleSelectUser,
    router,
  } = useHeaderLogic();

  if (loading) return <header>로딩 중...</header>;

  return (
    <header className={styles.header}>
      <div className={styles.Frame12}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          <strong>MyApp</strong>
        </div>

        <div className={styles.search}>
          <div className={styles.Frame8}>
            <div className={styles.Frame7}>
              <div className={styles.Frame7_1}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <g clipPath="url(#clip0_187_92)">
                    <path
                      d="M15.8333 8.74996C15.8333 10.1509 15.4179 11.5204 14.6395 12.6852C13.8612 13.8501 12.7549 14.758 11.4606 15.2941C10.1663 15.8302 8.7421 15.9705 7.36807 15.6972C5.99404 15.4239 4.73191 14.7493 3.74129 13.7586C2.75067 12.768 2.07605 11.5059 1.80273 10.1318C1.52942 8.75782 1.6697 7.33359 2.20582 6.03928C2.74194 4.74498 3.64983 3.63871 4.81467 2.86038C5.97952 2.08206 7.34901 1.66663 8.74996 1.66663C10.6286 1.66663 12.4303 2.4129 13.7586 3.74129C15.087 5.06967 15.8333 6.87134 15.8333 8.74996Z"
                      stroke="#777777"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.7592 13.7592L18.3333 18.3333"
                      stroke="#777777"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_187_92">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <input
                type="text"
                placeholder="검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.Frame7_2}
              />
            </div>
          </div>

          {searchTerm && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((u) => (
                <div
                  key={u.uuid}
                  onClick={() => {
                    handleSelectUser
                  }}
                >
                  <img
                    src={u.profileImage?.url || '/default-profile.png'}
                    alt={u.name}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      marginRight: 8,
                    }}
                  />
                  {u.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.userMenuWrapper} ref={menuRef}>
        <button className={styles.writeButton} onClick={handleStoreClick}>
          스토어
        </button>

        {user ? (
          <>
            <button className={styles.writeButton} onClick={handleWriteClick}>
              글쓰기
            </button>

            <img
              src={user?.profileImageUrl || '/default-avatar.png'}
              alt="프로필"
              onClick={() => setIsMenuOpen((p) => !p)}
              className={styles.profileImage}
            />

            {isMenuOpen && (
              <div className={styles.menuPopup}>
                <button
                  className={styles.menuButton}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(`/myinfo`);
                  }}
                >
                  내 정보
                </button>

                <hr style={{ margin: '5px 0', borderColor: '#eee' }} />

                <button
                  className={styles.menuButton}
                  onClick={handleMyPage}
                >
                  내 페이지
                </button>

                <hr style={{ margin: '5px 0', borderColor: '#eee' }} />

                <button
                  className={styles.menuButton}
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </>
        ) : (
          <button className={styles.loginButton} onClick={handleLoginClick}>
            회원가입/로그인
          </button>
        )}
      </div>
    </header>
  );
}
