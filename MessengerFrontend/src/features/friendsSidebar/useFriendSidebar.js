'use client';

import { useState, useEffect, useRef } from "react";
import { useAuth } from '@/context/AuthContext';
import {
  getfriendListHandler,
  sendFriendRequestHandler,
  getReceivedRequestsHandler,
  acceptFriendRequestHandler,
  rejectFriendRequestHandler,
  deleteFriendHandler
} from "@/../src/lib/FriendsActions";

export default function useFriendSidebar() {
  const [mode, setMode] = useState("friends");
  const [friends, setFriends] = useState([]);
  const [newFriendId, setNewFriendId] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]); // ✅ 온라인 유저 ID 목록

  const { user, ws, loading } = useAuth();
  const { isConnected, lastMessage, sendMessage } = ws;

  const addDropdownRef = useRef(null);
  const friendDropdownRefs = useRef({});

  /* =====================
     WebSocket 메시지 처리
     ===================== */
  useEffect(() => {
    if (!user) {
      // 로그아웃 시 모든 상태 초기화
      setFriends([]);
      setPendingRequests([]);
      setOnlineUserIds([]);
      setOpenDropdownId(null);
      setIsAddOpen(false);
      setNewFriendId("");
      setMode("friends");
    }
  }, [user]);

  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'online-users':
        // ✅ 온라인 유저 목록 업데이트
        console.log('📡 온라인 유저 목록:', lastMessage.users);
        setOnlineUserIds(lastMessage.users);
        break;

      case 'connected':
        // ✅ 연결 후 온라인 유저 목록 요청
        console.log('✅ WebSocket 연결 완료, 온라인 유저 요청');
        sendMessage({ type: 'get-online-users' });
        break;

      default:
        break;
    }
  }, [lastMessage, sendMessage]);

  /* =====================
     친구 목록에 온라인 상태 추가
     ===================== */
    const friendsWithOnlineStatus = friends.map(friend => ({
      ...friend,
      isOnline: onlineUserIds.includes(friend._id.toString())
    }));

  /* =====================
     친구 목록 불러오기
     ===================== */
  const loadFriendsList = async () => {
    try {
      const res = await getfriendListHandler();

      if (!res.success) {
        console.error(res.message);
        setFriends([]);
        return;
      }
      setFriends(Array.isArray(res.data.friends) ? res.data.friends : []);
    } catch (error) {
      console.error("친구 목록 불러오기 실패:", error);
    }
  };
  
  /* =====================
     친구 요청 목록
     ===================== */
  const loadPendingRequests = async () => {
    try {
      const res = await getReceivedRequestsHandler();
      if (!res.success) {
        console.error(res.message);
        setPendingRequests([]);
        return;
      }

      setPendingRequests(Array.isArray(res.data.requests) ? res.data.requests : []);
    } catch (error) {
      console.error("친구 대기 목록 불러오기 실패:", error);
    }
  };

  /* =====================
     친구 요청 보내기
     ===================== */
  const handleSendFriendRequest = async () => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    if (!newFriendId.trim()) {
      alert("친구 ID를 입력해주세요.");
      return;
    }

    try {
      const res = await sendFriendRequestHandler(newFriendId);
      if (!res.success) {
        alert(res.message);
        return;
      }

      alert("친구 요청을 보냈습니다.");
      setNewFriendId("");
      setIsAddOpen(false);
    } catch (error) {
      console.error("친구 요청 실패:", error);
      alert("친구 요청에 실패했습니다.");
    }
  };

  /* =====================
     친구 요청 수락
     ===================== */
  const handleAccept = async (friendshipId) => {
    try {
      const res = await acceptFriendRequestHandler(friendshipId);

      if (!res.success) {
        alert(res.message);
        return;
      }

      alert("친구 요청을 수락했습니다.");
      setPendingRequests(prev =>
        prev.filter(r => r._id !== friendshipId)
      );
      // ✅ 친구 목록 새로고침
      loadFriendsList();
    } catch (error) {
      console.error("수락 실패:", error);
      alert("친구 요청 수락에 실패했습니다.");
    }
  };

  /* =====================
     친구 요청 거절
     ===================== */
  const handleReject = async (friendshipId) => {
    try {
      const res = await rejectFriendRequestHandler(friendshipId);
      if (!res.success) {
        alert(res.message);
        return;
      }

      alert("친구 요청을 거절했습니다.");
      setPendingRequests(prev =>
        prev.filter(r => r._id !== friendshipId)
      );
    } catch (error) {
      console.error("거절 실패:", error);
      alert("친구 요청 거절에 실패했습니다.");
    }
  };

  /* =====================
     친구 삭제
     ===================== */
  const handleDeleteFriend = async (friendshipId) => {
    if (!window.confirm("정말 이 친구를 삭제하시겠습니까?")) return;

    try {
      const res = await deleteFriendHandler(friendshipId);

      if (!res.success) {
        alert(res.message);
        return;
      }

      alert("친구를 삭제했습니다.");
      setFriends(prev => prev.filter(f => f._id !== friendshipId));
      setOpenDropdownId(null);
    } catch (error) {
      console.error("친구 삭제 실패:", error);
      alert("친구 삭제에 실패했습니다.");
    }
  };

  /* =====================
     UI 핸들러
     ===================== */
  const toggleDropdown = (friendshipId) => {
    setOpenDropdownId(
      openDropdownId === friendshipId ? null : friendshipId
    );
  };

  const handleGoToFriendPage = (friendUuid) => {
    window.location.href = `/userhome/${friendUuid}`;
    setOpenDropdownId(null);
  };

  const handleChating = (friendUuid) => {
    window.open(
      `/chating/${user.uuid}/${friendUuid}`,
      '_blank',
      'width=600,height=600,top=100,left=100,resizable=yes,scrollbars=yes'
    );
    setOpenDropdownId(null);
  };

  /* =====================
     모드별 데이터 로드
     ===================== */
  useEffect(() => {
    if (!user || loading) return;

    if (mode === "friends") {
      loadFriendsList();
    }

    if (mode === "pending") {
      loadPendingRequests();
    }

    if (mode !== "friends" && mode !== "pending") {
      setFriends([]);
    }
  }, [mode, user, loading]);

  /* =====================
     바깥 클릭 닫기
     ===================== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target)) {
        setIsAddOpen(false);
      }

      if (openDropdownId !== null) {
        const currentRef = friendDropdownRefs.current[openDropdownId];
        if (currentRef && !currentRef.contains(e.target)) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  return {
    mode,
    setMode,
    friends: friendsWithOnlineStatus, // ✅ 온라인 상태가 포함된 친구 목록
    newFriendId,
    setNewFriendId,
    isAddOpen,
    setIsAddOpen,
    pendingRequests,
    openDropdownId,
    loading,
    addDropdownRef,
    friendDropdownRefs,
    handleSendFriendRequest,
    handleAccept,
    handleReject,
    handleDeleteFriend,
    toggleDropdown,
    handleGoToFriendPage,
    handleChating,
  };
}