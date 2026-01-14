'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { handleSSOLogin } from "@/lib/auth";

export default function useLogin() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(id, password, captchaToken);
      if (res.isAuthSuccess) {
        router.push("/");
      } else {
        setCaptchaToken(null);
        setErrorMessage(res.message);

        if (res.requireCaptcha) {
          setRequireCaptcha(true);
          setShowCaptcha(true);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCaptchaSuccess = (verifiedToken) => {
    setCaptchaToken(verifiedToken);
    setShowCaptcha(false);
    setErrorMessage("캡차 인증이 완료되었습니다. 다시 로그인해주세요.");
  };

  const handleCaptchaClose = () => {
    setShowCaptcha(false);
  };

  const handleFindId = () => {
    window.open("/find/id", "_blank", "width=600,height=600");
  };

  const handleFindPassword = () => {
    window.open("/find/password", "_blank", "width=600,height=600");
  };

  const buttonSSOLogin = async (platform) => {
    const url = await handleSSOLogin(platform);
    window.location.href = url;
  };

  return {
    // state
    id,
    password,
    errorMessage,
    requireCaptcha,
    showCaptcha,
    captchaToken,

    // setters
    setId,
    setPassword,

    // handlers
    handleSubmit,
    handleCaptchaSuccess,
    handleCaptchaClose,
    handleFindId,
    handleFindPassword,
    buttonSSOLogin,
  };
}
