'use server'
import { API_URL } from '../util/URLconfig'
import { apiFetch } from '../util/apiClient';

export async function registerHandler(formData) {
  const response = await apiFetch(`${API_URL}/api/register/registerSubmit`, {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return response;
}

export async function DuplicateCheckHandler(id) {
  const response = await apiFetch(`${API_URL}/api/register/idcheck`, {
    method: 'POST',
    body: JSON.stringify({ id }), // ✅ 객체로 감싸기
 });
  return response; // ✅ { isDuplicate: true/false, message: '...' }
}

// 기존 DuplicateCheckHandler 함수 아래에 추가
