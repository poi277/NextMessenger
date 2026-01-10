// frontend/src/hooks/useRequireAuth.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ✅ loading이 끝나고 user가 없을 때만 리다이렉트
    if (!loading && !user) {
      console.log('로그인 필요 - 리다이렉트');
      alert('로그인이 필요합니다');
      router.push('/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}