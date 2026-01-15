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
  const [receiverObjectId, setReceiverObjectId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receiverOnline, setReceiverOnline] = useState(false);
  const [error, setError] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]); // ✅ 직접 관리
  const messagesEndRef = useRef(null);
  const hasJoinedRoom = useRef(false);
  const currentRoomId = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 초기화
  useEffect(() => {
    if (!frienduuid) return;
    
    hasJoinedRoom.current = false;
    setMessages([]);
    setRoomId(null);
    setReceiverOnline(false);
    currentRoomId.current = null;
    
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const receiverRes = await GetReceiverHandler(frienduuid);
        console.log(receiverRes);
        
        if (!receiverRes.success) {
          setError(receiverRes.message);
          setLoading(false);
          return;
        }
        
        setReceiverName(receiverRes.data.receiverName);
        setReceiverObjectId(receiverRes.data.receiverObjectId);
        
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
        currentRoomId.current = chatRes.data.roomId;
        
        console.log('✅ 채팅 초기화 완료:', {
          roomId: chatRes.data.roomId,
          messageCount: chatMessages.length,
          receiverObjectId: receiverRes.data.receiverObjectId
        });
      } catch (err) {
        console.error('초기화 오류:', err);
        setError('채팅을 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    init();
    
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
  }, [frienduuid]);

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
  }, [isConnected, roomId]);
  
  // ✅ WebSocket 메시지 수신
  useEffect(() => {
    if (!lastMessage) return;

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
        
      // ✅ 온라인 유저 목록 업데이트
      case 'online-users':
        console.log('📡 온라인 유저 목록:', lastMessage.users);
        setOnlineUserIds(Array.isArray(lastMessage.users) ? lastMessage.users : []);
        break;
        
      // ✅ 유저 접속
      case 'user-connected':
        console.log('👤 유저 접속:', lastMessage.userId);
        setOnlineUserIds(prev => {
          if (!prev.includes(lastMessage.userId)) {
            return [...prev, lastMessage.userId];
          }
          return prev;
        });
        break;
        
      // ✅ 유저 퇴장
      case 'user-disconnected':
        console.log('👤 유저 퇴장:', lastMessage.userId);
        setOnlineUserIds(prev => 
          prev.filter(id => id !== lastMessage.userId)
        );
        break;

      case 'connected':
        console.log('✅ WebSocket 연결 완료');
        sendMessage({ type: 'get-online-users' });
        break;

      case 'error':
        console.error('❌ WebSocket 에러:', lastMessage.message);
        setError(lastMessage.message);
        break;

      default:
        console.log('📨 알 수 없는 메시지:', lastMessage.type);
        break;
    }
  }, [lastMessage, roomId, sendMessage]);

  // ✅ 수신자 온라인 상태 업데이트
  useEffect(() => {
    if (!receiverObjectId || !Array.isArray(onlineUserIds)) {
      setReceiverOnline(false);
      return;
    }

    const isOnline = onlineUserIds.includes(receiverObjectId);
    setReceiverOnline(isOnline);
    
    console.log('👤 수신자 온라인 상태:', {
      receiverObjectId,
      isOnline,
      onlineUserIds
    });
  }, [onlineUserIds, receiverObjectId]);

  // ✅ 웹소켓 연결 끊김 시 오프라인 처리
  useEffect(() => {
    if (!isConnected) {
      setOnlineUserIds([]);
      setReceiverOnline(false);
      console.log('🔌 웹소켓 연결 끊김 - 모든 유저 오프라인 처리');
    } else {
      // 재연결 시 온라인 유저 목록 요청
      console.log('🔄 웹소켓 재연결 - 온라인 유저 요청');
      sendMessage({ type: 'get-online-users' });
    }
  }, [isConnected, sendMessage]);

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
    loading,
    error,
    isConnected,
    messagesEndRef,
    postMessage,
    handleKeyPress,
    receiverOnline,
  };
}