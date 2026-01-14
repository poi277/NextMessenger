"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { paymentCheckAPI } from "../../lib/payment";

export default function WidgetSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState(null);

// 클라이언트 사용
useEffect(() => {
  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: searchParams.get("amount"),
    paymentKey: searchParams.get("paymentKey"),
  };
  async function confirm() {
    const res = await paymentCheckAPI(requestData);
    if (!res.success) {
      router.push(
        `/toss/fail?code=${res.status}&message=${res.message ?? '결제 실패'}`
      );
      return;
    }
    setResponseData(res.data);
    router.push(`/storePaySuccess?orderId=${requestData.orderId}`);
  }
  confirm();
}, [searchParams, router]);

  return (
    <>
      {/* 위쪽 박스 */}
      <div className="box_section" style={{ width: "600px" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="success-img"
        />
        <h2>결제를 완료했어요 잠시만 기다려주세요</h2>

        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div
            className="p-grid-col text--right"
            id="paymentKey"
            style={{ whiteSpace: "initial", width: "250px" }}
          >
            {searchParams.get("paymentKey")}
          </div>
        </div>

        <div className="p-grid-col" style={{ marginTop: "20px" }}>
          <Link href="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link href="https://discord.gg/A4fRFXQhRu">
            <button
              className="button p-grid-col5"
              style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
            >
              실시간 문의
            </button>
          </Link>
        </div>
      </div>

      {/* Response Data */}
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
