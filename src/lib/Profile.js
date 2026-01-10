'use server'

import { API_URL } from '../util/URLconfig'; // 필요하다면 사용
import { apiFetch } from '../util/apiClient';


export async function UserprofilHandler(uuid) {
    const response = await apiFetch(`${API_URL}/api/profile/${uuid}`)
    return response
}
