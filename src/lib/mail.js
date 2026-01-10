'use server';

import { apiFetch } from '../util/apiClient';
import { API_URL } from '../util/URLconfig';

export async function sendFindIdCodehandler(email) {
  return apiFetch(`${API_URL}/api/mail/sendcode/findid`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyFindIdCodeHandler(email, code) {
  return apiFetch(`${API_URL}/api/mail/verifycode/findid`, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function sendCodehandler(email) {
  return apiFetch(`${API_URL}/api/mail/sendcode`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyCodeHandler(email, code) {
  return apiFetch(`${API_URL}/api/mail/verifycode`, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function sendPasswordReset(id, email) {
  return apiFetch(`${API_URL}/api/mail/sendcode/password`, {
    method: 'POST',
    body: JSON.stringify({ id, email }),
  });
}

export async function verifyPasswordReset(id, email, code) {
  return apiFetch(`${API_URL}/api/mail/verifycode/password`, {
    method: 'POST',
    body: JSON.stringify({ id, email, code }),
  });
}

export async function resetPassword(id, newPassword, confirmPassword) {
  return apiFetch(`${API_URL}/api/mail/reset/password`, {
    method: 'POST',
    body: JSON.stringify({ id, newPassword, confirmPassword }),
  });
}
