'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DuplicateCheckHandler,
  registerHandler,
} from '@/lib/Register';
import {
  sendCodehandler,
  verifyCodeHandler,
} from '@/lib/mail';

export default function useRegister() {
  const router = useRouter();

  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    code: '',
  });

  const [errors, setErrors] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    code: '',
  });

  const [successMessages, setSuccessMessages] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    code: '',
  });

  /** 입력 변경 */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'id') {
      setIsIdChecked(false);
      setSuccessMessages(prev => ({ ...prev, id: '' }));
    }

    if (name === 'password' || name === 'confirmPassword') {
      setIsPasswordChecked(false);
      setSuccessMessages(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  /** 아이디 중복 확인 */
  const handleDuplicateCheckId = async () => {
    if (!formData.id.trim()) {
      setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요.' }));
      return;
    }

    const res = await DuplicateCheckHandler(formData.id);

    if (!res.success) {
      setErrors(prev => ({ ...prev, id: res.message }));
      setIsIdChecked(false);
      return;
    }

    // ✅ 백엔드: { isDuplicate: boolean }
    if (res.data.isDuplicate) {
      setErrors(prev => ({ ...prev, id: res.message }));
      setSuccessMessages(prev => ({ ...prev, id: '' }));
      setIsIdChecked(false);
    } else {
      setSuccessMessages(prev => ({ ...prev, id: res.message }));
      setErrors(prev => ({ ...prev, id: '' }));
      setIsIdChecked(true);
    }
  };

  /** 비밀번호 일치 확인 */
  const checkPairPassword = () => {
    if (!formData.password) {
      setErrors(prev => ({ ...prev, password: '비밀번호를 입력해주세요.' }));
      return;
    }

    if (!formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호 확인을 입력해주세요.' }));
      return;
    }

    if (formData.password === formData.confirmPassword) {
      setSuccessMessages(prev => ({
        ...prev,
        confirmPassword: '비밀번호가 일치합니다.',
      }));
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      setIsPasswordChecked(true);
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호가 서로 다릅니다.' }));
      setSuccessMessages(prev => ({ ...prev, confirmPassword: '' }));
      setIsPasswordChecked(false);
    }
  };

  /** 이메일 인증 코드 발송 */
  const sendCode = async () => {
    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력하세요.' }));
      return;
    }

    const res = await sendCodehandler(formData.email);

    if (res.success) {
      setSuccessMessages(prev => ({ ...prev, email: res.message }));
      setErrors(prev => ({ ...prev, email: '' }));
      setCodeSent(true);
    } else {
      setErrors(prev => ({ ...prev, email: res.message }));
      setSuccessMessages(prev => ({ ...prev, email: '' }));
    }
  };

  /** 이메일 인증 코드 확인 */
  const verifyCode = async () => {
    if (!formData.code.trim()) {
      setErrors(prev => ({ ...prev, code: '인증코드를 입력하세요.' }));
      return;
    }

    if (!codeSent) {
      setErrors(prev => ({ ...prev, code: '먼저 인증코드를 발송해주세요.' }));
      return;
    }

    const res = await verifyCodeHandler(formData.email, formData.code);

    if (res.success) {
      setSuccessMessages(prev => ({ ...prev, code: res.message }));
      setErrors(prev => ({ ...prev, code: '' }));
      setEmailVerified(true);
    } else {
      setErrors(prev => ({ ...prev, code: res.message }));
      setSuccessMessages(prev => ({ ...prev, code: '' }));
      setEmailVerified(false);
    }
  };

  /** 회원가입 제출 */
  const submitHandler = async (e) => {
    e.preventDefault();

    setErrors({
      id: '',
      password: '',
      confirmPassword: '',
      name: '',
      email: '',
      code: '',
    });

    let hasError = false;

    if (!formData.id.trim()) {
      setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요.' }));
      hasError = true;
    }

    if (!formData.password.trim()) {
      setErrors(prev => ({ ...prev, password: '비밀번호를 입력해주세요.' }));
      hasError = true;
    }

    if (!formData.confirmPassword.trim()) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호 확인을 입력해주세요.' }));
      hasError = true;
    }

    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: '닉네임을 입력해주세요.' }));
      hasError = true;
    }

    if (!formData.email.trim()) {
      setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
      hasError = true;
    }

    if (!isIdChecked) {
      setErrors(prev => ({ ...prev, id: '아이디 중복 확인을 해주세요.' }));
      hasError = true;
    }

    if (!isPasswordChecked) {
      setErrors(prev => ({ ...prev, confirmPassword: '비밀번호 확인을 해주세요.' }));
      hasError = true;
    }

    if (!emailVerified) {
      setErrors(prev => ({ ...prev, code: '이메일 인증을 완료해주세요.' }));
      hasError = true;
    }

    if (hasError) return;

    const res = await registerHandler(formData);

    if (!res.success) {
      alert(res.message);
      return;
    }

    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    router.push('/login');
  };

  return {
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
  };
}
