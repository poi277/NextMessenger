// components/FindIdPage.jsx
'use client';

import styles from '@/../css/FindIdPage.module.css';
import useFindId from './useFindId';

export default function FindIdPage() {
  const {
    email,
    code,
    foundId,
    emailSuccess,
    errors,
    handleSendCode,
    handleSubmit,
    handleEmailChange,
    handleCodeChange,
  } = useFindId();

  return (
    <div className={styles.findIdWrapper}>
      <div className={styles.findIdContainer}>
        <div className={styles.findIdCenterContainer}>
          <h1 className={styles.findIdTitle}>아이디 찾기</h1>

          <div className={styles.findIdInputWrapper}>
            {!foundId ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.findIdInputContainer}>

                  {/* 이메일 입력 */}
                  <div className={styles.formRowOther}>
                    <div className={styles.findIdFormField}>이메일</div>
                    <div className={styles.findIdRowInputContainerButtonOn}>
                      <div className={styles.inputButtonContainer}>
                        <div className={styles.inputFieldButtonOn}>
                          <input
                            type="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={handleEmailChange}
                            className={styles.inputLabel}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendCode}
                          className={styles.findIdMiddleButton}
                        >
                          인증코드 발송
                        </button>
                      </div>

                      <div className={styles.warningMesseage}>
                        <div className={
                          emailSuccess
                            ? styles.successMesseageFont
                            : styles.warningMesseageFont
                        }>
                          {emailSuccess || errors.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 인증코드 입력 */}
                  <div className={styles.formRowOther}>
                    <div className={styles.findIdFormField}>인증코드</div>
                    <div className={styles.rowInputContainerButtonOff}>
                      <div className={styles.inputFieldButtonOff}>
                        <input
                          type="text"
                          placeholder="인증코드 입력"
                          value={code}
                          onChange={handleCodeChange}
                          className={styles.inputLabel}
                        />
                      </div>

                      <div className={styles.warningMesseage}>
                        <div className={styles.warningMesseageFont}>
                          {errors.code}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={styles.findIdBtn}>
                    아이디 찾기
                  </button>

                </div>
              </form>
            ) : (
              <div className={styles.resultContainer}>
                <div className={styles.foundIdBox}>
                  <p className={styles.resultText}>당신의 아이디는</p>
                  <p className={styles.foundId}><strong>{foundId}</strong></p>
                  <p className={styles.resultText}>입니다.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}