'use server'

import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

export async function searchUsers(searchTerm) {
  return apiFetch(`${API_URL}/api/header/search`, {
    method: 'POST',
    body: JSON.stringify({ searchTerm }),
  });
}
