'use client';

import { useState, useEffect, useMemo } from 'react';
import { useActionState } from 'react';
import { useRequireAuth } from '@/context/RequireAuth';
import { updateMyInfomation } from '@/../src/lib/user'

export default function useMyInformation(userinfo) {
  const [photoURL, setPhotoURL] = useState(userinfo?.profileImage?.url || '/default-avatar.png');
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState(userinfo?.name || '');
  const [introduce, setIntroduce] = useState(userinfo?.introduce || '');
  const { user, loading } = useRequireAuth();
  const [isProfileDelete, setIsProfileDelete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  
  const [state, formAction, isPending] = useActionState(updateMyInfomation, {
    success: null,
    error: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsProfileDelete(false);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPhotoURL(previewURL);
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleRegisterPhoto = () => {
    document.getElementById('fileInput').click();
    setShowPopup(false);
  };

  const handleDeletePhoto = () => {
    if (window.confirm('프로필 사진을 삭제하시겠습니까?')) {
      setPhotoURL('/default-avatar.png');
      setSelectedFile(null);
      setIsProfileDelete(true);
      setShowPopup(false);
      
      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleCopyUUID = () => {
    navigator.clipboard.writeText(userinfo.uuid);
    alert('UUID가 복사되었습니다!');
  };

  const isChanged = useMemo(() => {
    if (!userinfo) return false;
    return (
      name !== userinfo.name ||
      introduce !== (userinfo.introduce || '') ||
      selectedFile !== null ||
      isProfileDelete
    );
  }, [name, introduce, selectedFile, isProfileDelete, userinfo]);
  
  useEffect(() => {
    return () => {
      if (selectedFile && photoURL !== '/default-avatar.png') {
        URL.revokeObjectURL(photoURL);
      }
    };
  }, [selectedFile, photoURL]);

    useEffect(() => {
    if (state?.success === false) {
      alert(state.message || '요청에 실패했습니다.');
    }
  }, [state]);


  return {
    photoURL,
    selectedFile,
    name,
    setName,
    introduce,
    setIntroduce,
    loading,
    isProfileDelete,
    showPopup,
    setShowPopup,
    state,
    formAction,
    isPending,
    handleFileChange,
    handleOpenPopup,
    handleRegisterPhoto,
    handleDeletePhoto,
    handleCopyUUID,
    isChanged,
  };
}