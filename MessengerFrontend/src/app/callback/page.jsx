'use client'

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      alert('Google 로그인 성공!');
      router.push('/');
    } else if (error) {
      alert(`Google 로그인 실패: ${error}`);
      router.push('/login');
    }
  }, [searchParams, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}