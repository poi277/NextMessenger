"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaymentEvent = handlePaymentEvent;
const payment_event_type_1 = require("../../kafka/payment-event.type");
async function handlePaymentEvent(payload) {
    switch (payload.eventType) {
        case payment_event_type_1.PaymentEventType.PAYMENT_COMPLETED:
            await handlePaymentCompleted(payload);
            break;
        default:
            console.warn('Unknown payment event', payload);
    }
}
async function handlePaymentCompleted(payload) {
    console.log(' PAYMENT_COMPLETED 처리 완료', payload.orderId);
}
//# sourceMappingURL=payment-kafak.js.map