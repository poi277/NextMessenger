import { apiFetch } from '../util/apiClient';
import { PAYAPI_URL } from '../util/URLconfig';

export async function cartInputAPI(product) {
  return await apiFetch(`${PAYAPI_URL}/api/cart/input`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({ product }),
  });
}

export async function GetMyCartAPI() {
  return await apiFetch(`${PAYAPI_URL}/api/cart/get`, {
    auth: true,
  });
}

export async function DeleteMyCartAPI(productId) {
  return await apiFetch(`${PAYAPI_URL}/api/cart/${productId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function UpdateMyCartAmountAPI(productId, amount) {
  return await apiFetch(`${PAYAPI_URL}/api/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ amount }),
    auth: true,
  });
}
