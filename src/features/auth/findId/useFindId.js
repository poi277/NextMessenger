'use client';

import { useState } from 'react';
import {
  sendFindIdCodehandler,
  verifyFindIdCodeHandler
} from '@/lib/mail';

export default function useFindId() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [foundId, setFoundId] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    code: '',
  });


  const requestVerificationCode = async () => {
    setErrors(prev => ({ ...prev, email: '' }));
    setEmailSuccess('');

    const res = await sendFindIdCodehandler(email);

    if (!res.success) {
      setErrors(prev => ({ ...prev, email: res.message }));
      return;
    }

    setEmailSuccess(res.data.message);
    setCodeSent(true);
  };

  const verifyCode = async () => {
    const res = await verifyFindIdCodeHandler(email, code);

    if (!res.success) {
      setErrors(prev => ({ ...prev, code: res.message }));
      return;
    }

    setFoundId(res.data.userId);
    setErrors({ email: '', code: '' });
  };

  const handleSendCode = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors(prev => ({ ...prev, email: emailError }));
      return;
    }
    await requestVerificationCode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const codeError = validateCode(code);

    if (emailError || codeError) {
      setErrors({ email: emailError, code: codeError });
      return;
    }

    if (!codeSent) {
      setErrors(prev => ({
        ...prev,
        email: '인증 코드를 먼저 발송해주세요.',
      }));
      return;
    }

    await verifyCode();
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
    if (emailSuccess) setEmailSuccess('');
    if (codeSent) setCodeSent(false);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (errors.code) setErrors(prev => ({ ...prev, code: '' }));
  };

  const validateCode = (code) => {
    if (!code.trim()) return '인증 코드를 입력해주세요.';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return '이메일을 입력해주세요.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '올바른 이메일 형식을 입력해주세요.';
    }
    return '';
  };

  return {
    email,
    code,
    codeSent,
    foundId,
    emailSuccess,
    errors,
    handleSendCode,
    handleSubmit,
    handleEmailChange,
    handleCodeChange,
  };
}
