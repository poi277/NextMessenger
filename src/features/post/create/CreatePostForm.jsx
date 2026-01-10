// components/PostForm.jsx
'use client';
import React from 'react';
import styles from '@/../css/CreatePost.module.css';
import usePostForm from './CreatePost';

export default function PostForm({
  post = null,
  onSubmit,
  isPending,
  submitButtonText = '게시물 등록'
}) {
  const {
    isEditMode,
    visibility,
    setVisibility,
    selectedFiles,
    existingImages,
    handleFileChange,
    removeNewFile,
    removeExistingImage,
    handleSubmit,
  } = usePostForm(post, onSubmit);

  return (
    <div className={styles.writeWrapper}>
      <div className={styles.writeContainer}>
        <div className={styles.writeCard}>
          <h2 className={styles.writeCardTitle}>
            {isEditMode ? '게시물 수정' : '새 게시물 작성'}
          </h2>
          
          <form action={handleSubmit} className={styles.form}>
            {isEditMode && <input type="hidden" name="postid" value={post._id} />}

            {/* 제목 */}
            <div className={styles.writeFormGroup}>
              <label className={styles.writeLabel}>제목</label>
              <div className={styles.writeInputBox}>
                <input
                  type="text"
                  name="title"
                  className={styles.writeInput}
                  defaultValue={post?.title || ''}
                  required
                  placeholder="제목을 입력하세요"
                />
              </div>
            </div>

            {/* 내용 */}
            <div className={styles.writeFormGroup}>
              <label className={styles.writeLabel}>내용</label>
              <div className={styles.writeInputBox}>
                <textarea
                  name="content"
                  className={styles.writeTextarea}
                  defaultValue={post?.content || ''}
                  required
                  placeholder="내용을 입력하세요"
                />
              </div>
            </div>

            {/* 공개 범위 */}
            <div className={styles.writeFormGroup}>
              <label className={styles.writeLabel}>공개 범위</label>
              <div className={styles.writeInputBox}>
                <select
                  name="visibility"
                  className={styles.writeSelectBox}
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">공개</option>
                  <option value="friends">친구만</option>
                  <option value="private">비공개</option>
                </select>
              </div>
            </div>

            {/* 기존 이미지 (수정 모드만) */}
            {isEditMode && existingImages.length > 0 && (
              <div className={styles.writeFormGroup}>
                <label className={styles.writeLabel}>기존 사진</label>
                <div className={styles.writeFilePreviewGrid}>
                  {existingImages.map((img, idx) => (
                    <div key={idx} className={styles.writeFilePreview}>
                      <div className={styles.writeFilePreviewImgWrapper}>
                        <img src={img} alt={`existing-${idx}`} />
                        <button
                          type="button"
                          className={styles.writeFilePreviewBtn}
                          onClick={() => removeExistingImage(img, idx)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 사진 업로드 */}
            <div className={styles.writeFormGroup}>
              <label className={styles.writeLabel}>
                {isEditMode ? '새 사진 추가' : '사진 업로드'}
              </label>
              <div className={styles.writeFileUpload}>
                <label className={styles.writeFileLabel}>
                  <span>사진 선택</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={isPending}
                    style={{ display: 'none' }}
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className={styles.writeFilePreviewGrid}>
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className={styles.writeFilePreview}>
                        <div className={styles.writeFilePreviewImgWrapper}>
                          <img src={URL.createObjectURL(file)} alt="preview" />
                          <button
                            type="button"
                            onClick={() => removeNewFile(idx)}
                            className={styles.writeFilePreviewBtn}
                          >
                            ×
                          </button>
                        </div>
                        <p className={styles.writeFilePreviewText}>
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isPending}
              className={`${styles.writeSubmitBtn} ${
                isPending ? styles.writeSubmitBtnDisabled : ''
              }`}
            >
              {isPending ? '처리 중...' : submitButtonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}