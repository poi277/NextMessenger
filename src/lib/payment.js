'use server'

import { apiFetch } from "../util/apiClient";
import { PAYAPI_URL } from "../util/URLconfig";

export async function paymentCheckAPI(requestData) {
  return apiFetch(`${PAYAPI_URL}/api/payment/pay`, {
    method: 'POST',
    body: JSON.stringify(requestData),
    auth: true,
  });
}
export async function savePaymentIntegrityCheckAPI(paymentData) {
  return await apiFetch(`${PAYAPI_URL}/api/payment/integrityCheck`, {
    method: 'POST',
    body: JSON.stringify(paymentData),
    auth: true,
  });
}
