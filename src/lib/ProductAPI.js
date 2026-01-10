'use server'
import { PAYAPI_URL } from '../util/URLconfig'
import { apiFetch } from '../util/apiClient';

export async function GetStoreItemApi() {
  return await apiFetch(`${PAYAPI_URL}/api/products/getProducts`);
}

export async function getProductsPage({ pageParam = 1 }) {
  return apiFetch(
    `${PAYAPI_URL}/api/products/productsPage?page=${pageParam}&limit=12`,
    { method: 'GET', auth: false }
  );
}


export async function GetStoreItemOneApi(productId) {
  return await apiFetch(`${PAYAPI_URL}/api/products/get/${productId}`);
}


export async function CreateProductAPI(formData) {
  return await apiFetch(`${PAYAPI_URL}/api/products/create`, {
    auth: true,
    method: 'POST',
    body: formData 
  });
}