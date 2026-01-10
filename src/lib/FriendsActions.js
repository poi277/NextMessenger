'use server'

import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

export async function getfriendListHandler() {
  return apiFetch(`${API_URL}/api/friends/list`, {
    auth: true,
  });
}

export async function sendFriendRequestHandler(recipientuuid) {
  return apiFetch(`${API_URL}/api/friends/request`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ recipientuuid }),
  });
}

export async function getReceivedRequestsHandler() {
  return apiFetch(`${API_URL}/api/friends/requests/received`, {
    auth: true,
  });
}

export async function getSentRequestsHandler() {
  return apiFetch(`${API_URL}/api/friends/requests/sent`, {
    auth: true,
  });
}

export async function acceptFriendRequestHandler(friendshipId) {
  return apiFetch(`${API_URL}/api/friends/accept/${friendshipId}`, {
    auth: true,
    method: 'PUT',
  });
}

// 요청 거절
export async function rejectFriendRequestHandler(friendshipId) {
  return apiFetch(`${API_URL}/api/friends/reject/${friendshipId}`, {
    auth: true,
    method: 'PUT',
  });
}

// 친구 삭제
export async function deleteFriendHandler(friendObjectId) {
  return apiFetch(`${API_URL}/api/friends/${friendObjectId}`, {
    auth: true,
    method: 'DELETE',
  });
}
