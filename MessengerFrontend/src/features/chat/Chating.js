'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from 'next/navigation';
import { GetOnetoOneChatHandler, GetReceiverHandler } from "@/lib/chatingActions";
import { useAuth } from '@/context/AuthContext';

export default function useChating() {
  const { frienduuid } = useParams();
  const { user, ws } = useAuth();
  const { isConnected, lastMessage, sendMessage } = ws;

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverOnline, setReceiverOnline] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const hasJoinedRoom = useRef(false);
  const currentRoomId = useRef(null); // ✅ ref로 roomId 추적

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 초기화 - frienduuid만 의존성으로
  useEffect(() => {
    if (!frienduuid) return;
    
    hasJoinedRoom.current = false;
    setMessages([]);
    setRoomId(null);
    currentRoomId.current = null;
    
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const receiverRes = await GetReceiverHandler(frienduuid);
        if (!receiverRes.success) {
          setError(receiverRes.message);
          setLoading(false);
          return;
        }
        setReceiverName(receiverRes.data.receiverName);
        setReceiverOnline(receiverRes.data.receiverOnline);
        
        const chatRes = await GetOnetoOneChatHandler(frienduuid);
        if (!chatRes.success) {
          setError(chatRes.message);
          setLoading(false);
          return;
        }
        
        const chatMessages = Array.isArray(chatRes.data.chatMessages)
          ? chatRes.data.chatMessages
          : [];

        setMessages(chatMessages);  
        setRoomId(chatRes.data.roomId);
        currentRoomId.current = chatRes.data.roomId; // ✅ ref 업데이트
        
        console.log('✅ 채팅 초기화 완료:', {
          roomId: chatRes.data.roomId,
          messageCount: chatMessages.length
        });
      } catch (err) {
        console.error('초기화 오류:', err);
        setError('채팅을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    init();
    
    // ✅ cleanup - ref 사용으로 의존성 제거
    return () => {
      const roomToLeave = currentRoomId.current;
      if (roomToLeave && hasJoinedRoom.current) {
        console.log(`🚪 방 떠남: ${roomToLeave}`);
        sendMessage({
          type: 'leave-room',
          roomId: roomToLeave,
        });
        hasJoinedRoom.current = false;
        currentRoomId.current = null;
      }
    };
  }, [frienduuid]); // ✅ frienduuid만!

  // ✅ 방 참여
  useEffect(() => {
    if (!roomId || !isConnected || hasJoinedRoom.current) {
      return;
    }

    console.log(`✅ 방 참여 시도: ${roomId}`);
    sendMessage({
      type: 'join-room',
      roomId,
    });
    hasJoinedRoom.current = true;
  }, [isConnected, roomId]); // ✅ sendMessage 제거
  
  // ✅ 메시지 수신
  useEffect(() => {
    if (!lastMessage || !roomId) return;

    switch (lastMessage.type) {
      case 'new-message':
        if (lastMessage.roomId === roomId) {
          setMessages(prev => [...prev, lastMessage.message]);
        }
        break;

      case 'joined-room':
        console.log('✅ 방 참여 확인:', lastMessage.roomId);
        break;
        
      case 'sent':
        console.log('✅ 메시지 전송 완료');
        break;

      case 'left-room':
        console.log('🚪 방 떠남 확인:', lastMessage.roomId);
        break;

      case 'error':
        console.error('❌ WebSocket 에러:', lastMessage.message);
        setError(lastMessage.message);
        break;

      default:
        console.log('📨 알 수 없는 메시지:', lastMessage.type);
        break;
    }
  }, [lastMessage, roomId]);

  const postMessage = useCallback(() => {
    if (!content.trim() || !isConnected || !roomId) {
      return;
    }

    const success = sendMessage({
      type: 'send-message',
      roomId,
      content,
      receiveruuid: frienduuid,
    });

    if (success) {
      setContent("");
    }
  }, [content, isConnected, roomId, frienduuid, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postMessage();
    }
  }, [postMessage]);

  return {
    messages,
    content,
    setContent,
    user,
    receiverName,
    receiverOnline,
    loading,
    error,
    isConnected,
    messagesEndRef,
    postMessage,
    handleKeyPress,
  };
}