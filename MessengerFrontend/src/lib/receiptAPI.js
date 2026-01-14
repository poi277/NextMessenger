'use server'
import { PAYAPI_URL } from '../util/URLconfig'; // 필요하다면 사용
import { apiFetch } from '../util/apiClient';


export async function UserReceiptGetAllAPI() {
    const response = await apiFetch(`${PAYAPI_URL}/api/receipt/get`,
        {auth:true}
    )
    return response
}

export async function UserReceiptGetOneAPI(PaymentId) {
    const response = await apiFetch(`${PAYAPI_URL}/api/receipt/payment/${PaymentId}`,
        {auth:true}
    )
    return response
}

export async function getUserReceiptByOrderIdAPI(orderId) {
    const response = await apiFetch(`${PAYAPI_URL}/api/receipt/order/${orderId}`,
        {auth:true}
    )
    return response
}