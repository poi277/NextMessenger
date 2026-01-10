// components/MyInformationForm.jsx
'use client';

import styles from '@/../css/MyInformation.module.css';
import useMyInformation from './useMyInformation';

export default function MyInformationForm({ userinfo }) {
  const {
    photoURL,
    name,
    setName,
    introduce,
    setIntroduce,
    loading,
    isProfileDelete,
    showPopup,
    setShowPopup,
    formAction,
    isPending,
    handleFileChange,
    handleOpenPopup,
    handleRegisterPhoto,
    handleDeletePhoto,
    handleCopyUUID,
    isChanged,
  } = useMyInformation(userinfo);

  if (loading) return <div className={styles.loading}>로딩중...</div>;
  
  return (    
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="uuid" value={userinfo.uuid} />
      <input type="hidden" name="isProfileDelete" value={isProfileDelete} /> 
      
      <div className={styles.userFeedBackground}>
        <div className={styles.userFeedWrapper}>
          <div className={styles.profileCard}>
            <div className={styles.profileFont}>프로필 편집</div>
            
            <div className={styles.profileInContainer}>
              {/* 프로필 사진 섹션 */}
              <div className={styles.profilePhotoWrapper}>
                <img
                  className={styles.profilePhotoImg}
                  src={photoURL}
                  alt="프로필"
                />
                <div className={styles.profilePhotoText}>
                  {userinfo.id || 'Null'}
                </div>
                <label
                  className={styles.photoChangeBtn}
                  onClick={handleOpenPopup}
                >
                  사진 변경
                </label>
                <input
                  id="fileInput"
                  type="file"
                  name="newProfileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* 팝업 UI */}
              {showPopup && (
                <div
                  className={styles.popupOverlay}
                  onClick={() => setShowPopup(false)}
                >
                  <div
                    className={styles.popup}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.popupTitle}>프로필 사진</div>
                    <button 
                      type="button" 
                      className={styles.popupBtn} 
                      onClick={handleRegisterPhoto}
                    >
                      사진 등록
                    </button>
                    <button 
                      type="button" 
                      className={styles.popupBtnDelete} 
                      onClick={handleDeletePhoto}
                    >
                      사진 삭제
                    </button>
                    <button 
                      type="button" 
                      className={styles.popupCancel} 
                      onClick={() => setShowPopup(false)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* UUID 섹션 */}
              <div className={styles.uuidContainer}>
                내 UUID {userinfo.uuid}
                <div className={styles.copyIcon} onClick={handleCopyUUID}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 11C6 8.172 6 6.757 6.879 5.879C7.757 5 9.172 5 12 5H15C17.828 5 19.243 5 20.121 5.879C21 6.757 21 8.172 21 11V16C21 18.828 21 20.243 20.121 21.121C19.243 22 17.828 22 15 22H12C9.172 22 7.757 22 6.879 21.121C6 20.243 6 18.828 6 16V11Z"
                      stroke="#000"
                      strokeWidth="1"
                    />
                    <path
                      d="M6 19C5.20435 19 4.44129 18.6839 3.87868 18.1213C3.31607 17.5587 3 16.7956 3 16V10C3 6.229 3 4.343 4.172 3.172C5.344 2.001 7.229 2 11 2H15C15.7956 2 16.5587 2.31607 17.1213 2.87868C17.6839 3.44129 18 4.20435 18 5"
                      stroke="#000"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>

              {/* 입력 필드 섹션 */}
              <div className={styles.profileInContainer2}>
                {/* 이름 입력 */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputGroupText}>이름</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputInContainer}>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputField}
                        maxLength={8}
                        required
                      />
                      <span className={styles.charCount}>
                        {name.length} / 8
                      </span>
                    </div>
                    <div className={styles.warningMessage}></div>
                  </div>
                </div>

                {/* 소개 입력 */}
                <div className={styles.inputGroup}>
                  <label className={styles.inputGroupText}>소개</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputInContainer}>
                      <input
                        type="text"
                        name="introduce"
                        value={introduce}
                        onChange={(e) => setIntroduce(e.target.value)}
                        className={styles.inputField}
                        maxLength={30}
                      />
                      <span className={styles.charCount}>
                        {introduce.length} / 30
                      </span>
                    </div>
                    <div className={styles.warningMessage}></div>
                  </div>
                </div>

                {/* 저장 버튼 */}
                {isChanged ? (
                  <button 
                    className={styles.saveBtn} 
                    type="submit" 
                    disabled={isPending}
                  >
                    {isPending ? '저장 중...' : '저장'}
                  </button>
                ) : (
                  <button disabled className={styles.saveBtnBefore}>
                    저장
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}