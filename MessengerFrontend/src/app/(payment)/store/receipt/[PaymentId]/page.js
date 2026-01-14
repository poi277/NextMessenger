'use server'

import ReceiptDetailComponent from '@/features/store/Receipt/Detail/ReceiptDetailComponent';
import { UserReceiptGetOneAPI } from '@/lib/receiptAPI'

export default async function ReceiptOnePage({ params })
{
   const resolvedParams = await params;
   const PaymentId=resolvedParams.PaymentId;
   const receiptRes = await UserReceiptGetOneAPI(PaymentId);
    if (!receiptRes.success) 
    {
        throw new Error("해당 영수증을 찾을 수 없습니다.");
    }
    return <ReceiptDetailComponent receipt={receiptRes.data} />;
}