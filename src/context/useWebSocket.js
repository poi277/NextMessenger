'use client'

import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url, enabled = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const heartbeatInterval = useRef(null); // ✅ heartbeat 타이머
  const missedHeartbeats = useRef(0); // ✅ 응답 없는 횟수

  useEffect(() => {
    if (!enabled) {
      console.log('❌ WebSocket 비활성화 (로그인 필요)');
      cleanup();
      setIsConnected(false);
      return;
    }

    console.log('🔌 WebSocket 연결 시도:', url);
    connect();

    return () => {
      console.log('🧹 WebSocket 정리');
      cleanup();
    };
  }, [url, enabled]);

  const cleanup = () => {
    // WebSocket 정리
    if (ws.current) {
      ws.current.close(1000, '정상 종료');
      ws.current = null;
    }
    
    // 타이머들 정리
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    
    missedHeartbeats.current = 0;
  };

  const startHeartbeat = () => {
    // 기존 heartbeat 정리
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }

    missedHeartbeats.current = 0;

    // ✅ 30초마다 ping 전송
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        missedHeartbeats.current++;
        
        // ✅ 3번 연속 응답 없으면 재연결
        if (missedHeartbeats.current >= 3) {
          console.warn('⚠️ Heartbeat 응답 없음 (3회), 재연결 시도...');
          ws.current.close(1006, 'Heartbeat timeout');
          return;
        }

        console.log('💓 Ping 전송');
        ws.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30초
  };

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('✅ WebSocket 연결됨');
        setIsConnected(true);
        missedHeartbeats.current = 0;
        startHeartbeat(); // ✅ heartbeat 시작
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // ✅ pong 응답 처리
          if (data.type === 'pong') {
            console.log('💓 Pong 수신');
            missedHeartbeats.current = 0; // 응답 받음, 카운트 리셋
            return;
          }

          console.log('📨 메시지 수신:', data);
          setLastMessage(data);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket 오류:', error);
      };

      ws.current.onclose = (event) => {
        console.log('❌ WebSocket 연결 해제:', event.code, event.reason);
        setIsConnected(false);
        
        // heartbeat 정리
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }

        // enabled가 true이고 비정상 종료일 때만 재연결
        if (event.code !== 1000 && enabled) {
          reconnectTimeout.current = setTimeout(() => {
            console.log('🔄 재연결 시도...');
            connect();
          }, 3000);
        }
      };
    } catch (error) {
      console.error('WebSocket 연결 오류:', error);
    }
  };

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
      return true;
    } else {
      console.error('WebSocket 연결되지 않음');
      return false;
    }
  };

  const disconnect = () => {
    cleanup();
    setIsConnected(false);
  };

  return { 
    isConnected, 
    lastMessage, 
    sendMessage, 
    disconnect 
  };
}