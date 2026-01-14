import StorePaySuccessComponent from "../../features/store/SucessPage/StorePaySuccessComponent";
import { getUserReceiptByOrderIdAPI } from "../../lib/receiptAPI";

export default async function StorePaySuccess({ searchParams }) {
    const params = await searchParams;
    const orderId = params.orderId;
    const receiptRes = await getUserReceiptByOrderIdAPI(orderId);
    if (!receiptRes.success) 
    {
      throw new Error("해당 영수증을 찾을 수 없습니다.");
    }
      return <StorePaySuccessComponent receipt={receiptRes.data} />;
}
