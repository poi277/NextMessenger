import { PaymentEvent, PaymentEventType } from "kafka/payment-event.type";

export async function handlePaymentEvent(payload: PaymentEvent) {
  switch (payload.eventType) {
    case PaymentEventType.PAYMENT_COMPLETED:
      await handlePaymentCompleted(payload);
      break;

    default:
      // 여기 오면 컴파일 타임에서 경고 뜸
      console.warn('Unknown payment event', payload);
  }
}
async function handlePaymentCompleted(payload: any) {
  // 1. Redis 멱등성은 이미 consumer에서 처리됨

  // 2. 주문 상태 변경
  // await prisma.order.update(...)

  // 3. 포인트 적립
  // await prisma.point.create(...)

  console.log(' PAYMENT_COMPLETED 처리 완료', payload.orderId);
}
