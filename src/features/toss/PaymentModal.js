import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import styles from '@/../css/Toss.module.css'
import { savePaymentIntegrityCheckAPI } from "../../lib/payment";

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
export default function CheckoutPage({totalPrice,user=null,cartItems}) {
  const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
  const customerKey = user.userObjectId.toString()
  const orderId = generateRandomString();
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: totalPrice
  });
const [ready, setReady] = useState(false);
const [widgets, setWidgets] = useState(null);
useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey); 

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
}, [clientKey, customerKey]);


useEffect(() => {
  async function renderPaymentWidgets() {
    if (widgets == null) {
      return;
    }
    // ------ 주문의 결제 금액 설정 ------
    await widgets.setAmount(amount);

    await Promise.all([
      // ------  결제 UI 렌더링 ------
      widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      }),
      // ------  이용약관 UI 렌더링 ------
      widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      }),
    ]);

    setReady(true);
  }

  renderPaymentWidgets();
}, [widgets]);

return (
  <div className={styles.wrapper}>
    <div className={styles.maxW540 + " " + styles.w100}>
      {/* 결제 UI */}
      <div id="payment-method" className={styles.w100} />
      {/* 이용약관 UI */}
      <div id="agreement" className={styles.w100} />
      {/* 쿠폰 체크박스 */}
      <div>
        <div>
          <label htmlFor="coupon-box">
            <input
              id="coupon-box"
              type="checkbox"
              aria-checked="true"
              disabled={!ready}
              onChange={(event) => {
                // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                setAmount(event.target.checked ? amount - 5_000 : amount + 5_000);
              }}
            />
            <span>5,000원 쿠폰 적용</span>
          </label>
        </div>
      </div>

      {/* 결제하기 버튼 */}
      <div className={styles.btnWrapper + " " + styles.w100}>
        <button
          className={`${styles.btn} ${styles.btnPrimary} ${styles.w100}`}
          disabled={!ready}
          onClick={async () => {
              try {
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
                const res =await savePaymentIntegrityCheckAPI({
                    orderId,
                    amount,
                    userObjectId: user?.userObjectId,
                    email: user?.email,
                    selectedCartItemIds: cartItems.map(item => item.id), 
                  });
                if(!res.success)
                {
                  throw new Error('결제 무결성 저장 실패');
                }
                await widgets.requestPayment({
                    orderId: orderId,
                    orderName: cartItems.length === 1 
                    ? cartItems[0].name 
                    : `${cartItems[0].name} 외 ${cartItems.length - 1}건`,
                    successUrl: window.location.origin + "/toss/success",
                    failUrl: window.location.origin + "/toss/fail",
                    customerEmail: user?.email || "",
                    customerName: user?.name || "",
                });
              } catch (error) {
                let message = "결제가 취소되었거나 오류가 발생했습니다.";
                if (error?.message) {
                  message = error.message;
                } else if (error?.code) {
                  message = `[${error.code}] 결제 오류가 발생했습니다.`;
                }
                alert(message);
              }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  </div>
);
}

// function generateRandomString() {
//   return window.btoa(Math.random().toString()).slice(0, 20);
// }
function generateRandomString() {
  return Buffer
    .from(Math.random().toString())
    .toString("base64")
    .slice(0, 20);
}