'use server'

import ReceiptListComponent from "@/features/store/Receipt/List/ReceiptListComponent";
import { UserReceiptGetAllAPI } from "../../../../lib/receiptAPI";

export default async function ReceiptPage()
{
  const receiptsRes = await UserReceiptGetAllAPI();
  if (!receiptsRes.success) 
  {
      throw new Error("영수증을 찾을 수 없습니다.");
  }
   return <ReceiptListComponent receipts={receiptsRes.data} />;
       
}