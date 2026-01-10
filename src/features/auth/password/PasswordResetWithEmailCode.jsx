'use client';

import styles from '@/../css/PasswordResetWithEmail.module.css';
import usePasswordReset from './usePasswordReset';

export default function PasswordResetWithEmailCode() {
  const {
    Id,
    setId,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    step,
    message,
    codeSent,
    emailSuccess,
    codeSuccess,
    errors,
    setErrors,
    setCodeSent,
    setEmailSuccess,
    setCodeSuccess,
    handleSendCode,
    handleVerifyCode,
    handleResetPassword,
    handleSubmit
  } = usePasswordReset();

 return (
    <div className={styles.findIdWrapper}>
      <div className={styles.findIdContainer}>
        <div className={styles.findIdCenterContainer}>
          <h1 className={styles.findIdTitle}>비밀번호 찾기</h1>

          <div className={styles.findIdInputWrapper}>
            {step === 1 && (
              <form onSubmit={handleSubmit}>
                <div className={styles.findIdInputContainer}>

                  {/* 아이디 입력 */}
                  <div className={styles.formRowOther}>
                    <div className={styles.findIdFormField}>아이디</div>
                    <div className={styles.rowInputContainerButtonOff}>
                      <div className={styles.inputFieldButtonOff}>
                        <input
                          type="text"
                          placeholder="아이디 입력"
                          value={Id}
                          onChange={(e) => {
                            setId(e.target.value);
                            if (errors.id) setErrors(prev => ({ ...prev, id: '' }));
                          }}
                          required
                          className={styles.inputLabel}
                        />
                      </div>
                      <div className={styles.warningMesseage}>
                        <div className={styles.warningMesseageFont}>{errors.id}</div>
                      </div>
                    </div>
                  </div>

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
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                              if (emailSuccess) setEmailSuccess('');
                              if (codeSent) setCodeSent(false);
                            }}
                            required
                            className={styles.inputLabel}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleSendCode}
                          className={styles.findIdMiddleButton}
                        >
                          코드 발송
                        </button>
                      </div>
                      <div className={styles.warningMessage}>
                        <div className={emailSuccess ? styles.successMesseageFont : styles.warningMesseageFont}>
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
                          onChange={(e) => {
                            setCode(e.target.value);
                            if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
                            if (codeSuccess) setCodeSuccess('');
                          }}
                          required
                          className={styles.inputLabel}
                        />
                      </div>
                      <div className={styles.warningMessage}>                            
                        <div className={codeSuccess ? styles.successMesseageFont : styles.warningMesseageFont}>
                          {codeSuccess || errors.code}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <button type="button" onClick={handleVerifyCode} className={styles.findIdBtn}>
                    인증 하기
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <div className={styles.findIdInputContainer}>

                  {/* 새 비밀번호 */}
                  <div className={styles.formRowOther}>
                    <div className={styles.findIdFormField}>새 비밀번호</div>
                    <div className={styles.rowInputContainerButtonOff}>
                      <div className={styles.inputFieldButtonOff}>
                        <input
                          type="password"
                          placeholder="새 비밀번호 설정"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                          }}
                          required
                          className={styles.inputLabel}
                        />
                      </div>
                      <div className={styles.warningMessage}>
                        <div className={styles.warningMesseageFont}>{errors.newPassword}</div>
                      </div>
                    </div>
                  </div>

                  {/* 비밀번호 확인 */}
                  <div className={styles.formRowOther}>
                    <div className={styles.findIdFormField}>비밀번호 확인</div>
                    <div className={styles.rowInputContainerButtonOff}>
                      <div className={styles.inputFieldButtonOff}>
                        <input
                          type="password"
                          placeholder="비밀번호 확인"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }}
                          required
                          className={styles.inputLabel}
                        />
                      </div>
                      <div className={styles.warningMessage}>
                        <div className={styles.warningMesseageFont}>{errors.confirmPassword}</div>
                      </div>
                    </div>
                  </div>

                  {/* 제출 버튼 */}
                  <button type="button" onClick={handleResetPassword} className={styles.findIdBtn}>
                    제출 하기
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div className={`${styles.findIdMessage} ${message.includes('발송') || message.includes('성공') ? styles.success : styles.error}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
