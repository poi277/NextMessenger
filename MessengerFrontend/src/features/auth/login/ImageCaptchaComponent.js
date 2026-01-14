'use client'
import { useState, useEffect } from 'react';
import styles from '@/../css/ImageCaptcha.module.css';
import { API_URL } from '@/util/URLconfig'

export default function ImageCaptcha({ userId, onSuccess, onClose }) {
  const [captchaData, setCaptchaData] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // 캡차 이미지 로드
  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/api/captcha/generate/${userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCaptchaData(data);
      setSelectedIndices([]);
    } catch (err) {
      console.error('캡차 로드 실패:', err);
      setError('캡차를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleImage = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleVerify = async () => {
    if (selectedIndices.length === 0) {
      setError('최소 1개 이상의 이미지를 선택해주세요.');
      return;
    }

    try {
      setVerifying(true);
      setError('');
      
      const response = await fetch(`${API_URL}/api/captcha/verify`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captchaId: captchaData.captchaId,
          selectedIndices
        })
      });

      const result = await response.json();

      if (result.success) {
        // 인증 성공 - verifiedToken을 부모 컴포넌트로 전달
        onSuccess(result.verifiedToken);
      } else {
        // 인증 실패 - 새로운 캡차 로드
        setError(result.message || '선택이 올바르지 않습니다.');
        setTimeout(() => {
          loadCaptcha();
        }, 1500);
      }
    } catch (err) {
      console.error('캡차 검증 실패:', err);
      setError('캡차 검증에 실패했습니다.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.captchaOverlay}>
        <div className={styles.captchaModal}>
          <div className={styles.loadingSpinner}>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.captchaOverlay}>
      <div className={styles.captchaModal}>
        <div className={styles.captchaHeader}>
          <h3>로봇이 아닙니다</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.captchaInstruction}>
          <strong>{captchaData?.categoryName}</strong>이(가) 포함된 이미지를 모두 선택하세요
        </div>

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        <div className={styles.imageGrid}>
          {captchaData?.images.map((imageUrl, index) => (
            <div
              key={index}
              className={`${styles.imageBox} ${selectedIndices.includes(index) ? styles.selected : ''}`}
              onClick={() => toggleImage(index)}
            >
              <img src={imageUrl} alt={`captcha-${index}`} />
              {selectedIndices.includes(index) && (
                <div className={styles.checkmark}>✓</div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.captchaFooter}>
          <button 
            className={styles.refreshBtn} 
            onClick={loadCaptcha}
            disabled={verifying}
          >
            🔄 새로고침
          </button>
          <button 
            className={styles.verifyBtn} 
            onClick={handleVerify}
            disabled={verifying || selectedIndices.length === 0}
          >
            {verifying ? '확인 중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}