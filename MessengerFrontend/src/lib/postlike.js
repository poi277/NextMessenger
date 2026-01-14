'use server'

import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

export async function toggleLikeHandler(postId) {
  return apiFetch(`${API_URL}/api/postlike/${postId}`, {
    auth: true,
    method: 'POST',
  });
}
