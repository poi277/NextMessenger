'use server'

import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

// 1:1 채팅 조회
export async function GetOnetoOneChatHandler(frienduuid) {
  return apiFetch(
    `${API_URL}/api/chat/one-to-one?receiveruuid=${frienduuid}`,
    { auth: true }
  );
}

// 1:1 채팅 전송 (현재 websocket을 사용, 사용 안 해도 구조 유지)
export async function PostOnetoOneChatHandler(frienduuid, content) {
  return apiFetch(`${API_URL}/api/chat/one-to-one`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({
      receiveruuid: frienduuid,
      content,
    }),
  });
}

// 채팅 상대 정보 조회
export async function GetReceiverHandler(receiveruuid) {
  return apiFetch(`${API_URL}/api/chat/${receiveruuid}`, {
    auth: true,
  });
}
