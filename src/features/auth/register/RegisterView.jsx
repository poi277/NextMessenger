'use client';

import styles from '@/../css/UserRegister.module.css';
import useRegister from './useRegister';

export default function RegisterView() {
  const {
    formData,
    errors,
    successMessages,
    emailVerified,
    codeSent,
    handleChange,
    handleDuplicateCheckId,
    checkPairPassword,
    sendCode,
    verifyCode,
    submitHandler,
  } = useRegister();

 return (
    <div className={styles.registerWrapper}>
      <div className={styles.registerContainer}>
        <h1 className={styles.registerTitle}>Messenger</h1>

        <form onSubmit={submitHandler} className={styles.registerInputWrapper}>

          {/* 아이디 */}
          <div className={styles.registerFormRowFirst}>
            <div className={styles.registerFormField}>아이디</div>
            <div className={styles.registerRowInputContainerButtonon}>
              <div className={styles.inputButtoncontainer}>
                <div className={styles.inputFieldButtonon}>
                  <input
                    name="id"
                    type="text"
                    placeholder="아이디"
                    value={formData.id}
                    onChange={handleChange}
                    className={styles.inputLabel}
                  />
                </div>
                <button
                  type="button"
                  className={styles.registerMiddleButton}
                  onClick={handleDuplicateCheckId}
                >
                  중복 확인
                </button>
              </div>
            </div>
            <div className={styles.warningMessage}>
              <div className={errors.id ? styles.warningMessageFont : styles.successMessageFont}>
                {errors.id || successMessages.id}
              </div>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className={styles.registerFormRowOther}>
            <div className={styles.registerFormField}>비밀번호</div>
            <div className={styles.registerRowInputContainerButtonoff}>
              <div className={styles.registerInputFieldButtonoff}>
                <input
                  name="password"
                  type="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.inputLabel}
                />
              </div>
              <div className={styles.warningMessage}>
                <div className={styles.warningMessageFont}>
                  {errors.password}
                </div>
              </div>
            </div>  
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.registerFormRowOther}>
            <div className={styles.registerFormField}>비밀번호 확인</div>
            <div className={styles.registerRowInputContainerButtonon}>
              <div className={styles.inputButtoncontainer}>
                <div className={styles.inputFieldButtonon}>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="비밀번호 확인"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={styles.inputLabel}
                  />
                </div>
                <button type="button" className={styles.registerMiddleButton} onClick={checkPairPassword}>
                  확인
                </button>
              </div>
              <div className={styles.warningMessage}>
                <div className={errors.confirmPassword ? styles.warningMessageFont : styles.successMessageFont}>
                  {errors.confirmPassword || successMessages.confirmPassword}
                </div>
              </div>
            </div>
          </div>

          {/* 닉네임 */}
          <div className={styles.registerFormRowOther}>
            <div className={styles.registerFormField}>닉네임</div>
            <div className={styles.registerRowInputContainerButtonoff}>
              <div className={styles.registerInputFieldButtonoff}>
                <input
                  name="name"
                  type="text"
                  placeholder="닉네임"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.inputLabel}
                />
              </div>
              <div className={styles.warningMessage}>
                <div className={styles.warningMessageFont}>
                  {errors.name}
                </div>
              </div>
            </div>
          </div>

          {/* 이메일 */}
          <div className={styles.registerFormRowOther}>
            <div className={styles.registerFormField}>이메일</div>
            <div className={styles.registerRowInputContainerButtonon}>
              <div className={styles.inputButtoncontainer}>
                <div className={styles.inputFieldButtonon}>
                  <input
                    name="email"
                    type="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.inputLabel}
                    disabled={codeSent}
                  />
                </div>
                <button 
                  type="button" 
                  className={styles.registerMiddleButton} 
                  onClick={sendCode}
                  disabled={codeSent}
                >
                  {codeSent ? '발송완료' : '인증코드 발송'}
                </button>
              </div>
              <div className={styles.warningMessage}>
                <div className={errors.email ? styles.warningMessageFont : styles.successMessageFont}>
                  {errors.email || successMessages.email}
                </div>
              </div>
            </div>
          </div>

          {/* 인증 코드 */}
          <div className={styles.registerFormRowOther}>
            <div className={styles.registerFormField}>인증코드</div>
            <div className={styles.registerRowInputContainerButtonon}>
              <div className={styles.inputButtoncontainer}>
                <div className={styles.inputFieldButtonon}>
                  <input
                    name="code"
                    type="text"
                    placeholder="인증코드"
                    value={formData.code}
                    onChange={handleChange}
                    className={styles.inputLabel}
                    disabled={!codeSent || emailVerified}
                  />
                </div>
                <button 
                  type="button" 
                  className={styles.registerMiddleButton} 
                  onClick={verifyCode}
                  disabled={!codeSent || emailVerified}
                >
                  {emailVerified ? '인증완료' : '인증'}
                </button>
              </div>
              <div className={styles.warningMessage}>
                <div className={errors.code ? styles.warningMessageFont : styles.successMessageFont}>
                  {errors.code || successMessages.code}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.registerBtn}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
