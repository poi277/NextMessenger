'use server';

import { API_URL } from '../util/URLconfig'
import { apiFetch } from '../util/apiClient';

export async function UserPostList(uuid) {
  const response = await apiFetch(`${API_URL}/api/posts/userpostlist/${uuid}`,{auth:true})
  return response;
}

export async function MyphotoList(uuid) {
 const response = await apiFetch(`${API_URL}/api/posts/userphotolist/${uuid}`,{auth:true})
  return response;
}

export async function MylikepostList(uuid) {
  const response = await apiFetch(`${API_URL}/api/posts/userlikepost/${uuid}`,{auth:true})
  return response;
}
