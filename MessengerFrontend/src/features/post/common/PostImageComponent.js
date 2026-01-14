  'use client'

  import { useState } from 'react';
  import styles from '@/../css/PostImageComponent.module.css';


  export default function PostImageComponent({ post })
  {
        // 사진 슬라이드 인덱스 상태
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const changePhotoIndex = (delta) => {
      if (!post.image || post.image?.length === 0) return;
      setCurrentPhotoIndex(prev => {
        let next = prev + delta;
        if (next < 0) next = post.image.length - 1;
        if (next >= post.image.length) next = 0;
        return next;
      });
    };
    
    if (!post) {
      return null;
    }

    return(
        <>
        {post.image?.length > 0 && (
          <div className={styles.postImageWrapper}>
            <img
              className={styles.postImageSingle}
              src={post.image[currentPhotoIndex].url}
              alt=""
            />

            {post.image.length > 1 && (
              <>
                <button
                  className={`${styles.photoNavBtn} ${styles.left}`}
                  onClick={e => { e.stopPropagation(); changePhotoIndex(-1); }}
                >◀</button>

                <button
                  className={`${styles.photoNavBtn} ${styles.right}`}
                  onClick={e => { e.stopPropagation(); changePhotoIndex(1); }}
                >▶</button>

                <div className={styles.photoIndicators}>
                  {post.image.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.indicatorDot} ${index === currentPhotoIndex ? styles.active : ''}`}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        </>
    )
}