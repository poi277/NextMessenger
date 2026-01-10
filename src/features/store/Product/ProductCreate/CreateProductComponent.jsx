// components/CreateProductComponent.jsx
'use client';

import styles from '@/../css/CreateProduct.module.css';
import useCreateProduct from './useCreateProduct'

export default function CreateProductComponent() {
    const {
        productName,
        setProductName,
        price,
        setPrice,
        imagePreviews,
        handleImageChange,
        removeImage,
        handleSubmit,
        handleCancel,
    } = useCreateProduct();

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <h1 className={styles.title}>상품 등록</h1>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 상품명 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            상품명 <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="상품명을 입력하세요"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* 가격 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            가격 <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="가격을 입력하세요"
                            className={styles.input}
                            required
                            min="0"
                        />
                    </div>

                    {/* 이미지 업로드 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>상품 이미지</label>
                        <div className={styles.imageUploadBox}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className={styles.fileInput}
                                id="imageInput"
                            />
                            <label htmlFor="imageInput" className={styles.fileLabel}>
                                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none">
                                    <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <p>이미지를 선택하세요</p>
                                <span className={styles.fileHint}>여러 이미지를 선택할 수 있습니다</span>
                            </label>
                        </div>

                        {/* 이미지 미리보기 */}
                        {imagePreviews.length > 0 && (
                            <div className={styles.previewGrid}>
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className={styles.previewItem}>
                                        <img 
                                            src={preview} 
                                            alt={`preview ${index}`} 
                                            className={styles.previewImage} 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className={styles.removeBtn}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 버튼 */}
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={handleCancel}
                        >
                            취소
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            상품 등록
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}