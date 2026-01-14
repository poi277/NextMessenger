// frontend/src/context/AuthContext.js
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { loginHandler, logoutHandler, checkSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useWebSocket } from './useWebSocket';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const WS_URL = 'ws://localhost:5000/ws';
  
  // ✅ WebSocket을 Context에서 관리
  const { isConnected, lastMessage, sendMessage, disconnect } = useWebSocket(WS_URL, !!user);

  useEffect(() => { 
    loadUser();
  }, [pathname]);

  const loadUser = async () => {
    try {
      const data = await checkSession();
      if (data.isLoggedIn) {
        setUser(data.user);
        console.log('✅ 세션 확인 완료:', data.user);
      } else {
        console.log('❌ 세션 없음');
        setUser(null);
      }
    } catch (error) {
      console.error('세션 확인 실패:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (id, password, captchaToken = null) => {
    try {
      const data = await loginHandler(id, password, captchaToken);
      
      if (data.isAuthSuccess) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error('로그인 에러:', error);
      return { 
        isAuthSuccess: false,
        message: error.message || "500에러",
        requireCaptcha: false
      };
    }
  };

  const logout = async () => {
    try {
      await logoutHandler();
      setUser(null);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      // ✅ WebSocket 관련 기능들도 제공
      ws: {
        isConnected,
        lastMessage,
        sendMessage,
        disconnect
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다');
  }
  return context;
}