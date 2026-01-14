'use server';

import { cookies } from 'next/headers';

export async function getSessionCookie() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('connect.sid');

  const cookieHeader = sessionCookie ? `connect.sid=${sessionCookie.value}` : '';
  const cookieValue = sessionCookie?.value || null;

  return { cookieHeader, cookieValue };
}
