'use client';

import { useState } from 'react';
import { sendPasswordReset, verifyPasswordReset, resetPassword } from '@/lib/mail';

export default function usePasswordReset() {
  const [Id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [errors, setErrors] = useState({
    id: '',
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 1단계: 인증 코드 전송
  const handleSendCode = async () => {
    setErrors(prev => ({ ...prev, id: '', email: '' }));
    setEmailSuccess('');
    if (!Id || !email) {
      if (!Id) setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요.' }));
      if (!email) setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
      return;
    }

    try {
      const res = await sendPasswordReset(Id, email); // apiFetch 사용 시 동일 구조
      if (res.success) {
        setEmailSuccess(res.message);
        setMessage('');
        setCodeSent(true);
      } else {
        setErrors(prev => ({ ...prev, email: res.message }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, email: err.message || "코드 전송 실패" }));
    }
  };

  // 1단계: 코드 검증
  const handleVerifyCode = async () => {
    setErrors(prev => ({ ...prev, code: '' }));
    setCodeSuccess('');
    if (!code) {
      setErrors(prev => ({ ...prev, code: '인증 코드를 입력해주세요.' }));
      return;
    }

    try {
      const res = await verifyPasswordReset(Id, email, code);
      if (res.success) {
        setCodeSuccess(res.message || "인증 성공! 비밀번호를 재설정하세요.");
        setMessage('');
        setStep(2);
      } else {
        setErrors(prev => ({ ...prev, code: res.message }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, code: err.message || "인증 코드가 일치하지 않습니다." }));
    }
  };

  // 2단계: 비밀번호 재설정
  const handleResetPassword = async () => {
    setErrors(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    if (!newPassword) {
      setErrors(prev => ({ ...prev, newPassword: '새 비밀번호를 입력해주세요.' }));
      return;
    }
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호 확인을 입력해주세요.' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      return;
    }

    try {
      const res = await resetPassword(Id, newPassword, confirmPassword);
      if (res.success) {
        alert(res.message || "비밀번호가 성공적으로 변경되었습니다.");
        window.close();
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: res.message }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, confirmPassword: err.message || "비밀번호 변경 실패" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 2) {
      handleResetPassword();
    }
  };

  return {
    handleSubmit,
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
    handleResetPassword
  };
}
