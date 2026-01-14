'use server'

import { API_URL } from '../util/URLconfig';
import { apiFetch } from '../util/apiClient';

// ✅ 사용자 정보 조회
export async function getUserInfo() {
  return await apiFetch(`${API_URL}/api/userinfo/`, {
    auth: true,
  });
}

// ✅ 사용자 정보 업데이트
export async function updateUserProfile(userData) {
  return await apiFetch(`${API_URL}/api/userinfo/`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// ✅ S3 이미지 삭제
export async function deleteImageFromS3(imageKey) {
  return await apiFetch(`${API_URL}/api/userinfo/`, {
    auth: true,
    method: 'DELETE',
    body: JSON.stringify({ key: imageKey }),
  });
}
