export declare enum PaymentEventType {
    PAYMENT_COMPLETED = "PAYMENT_COMPLETED"
}
export interface PaymentCompletedEvent {
    eventType: PaymentEventType.PAYMENT_COMPLETED;
    paymentId: number;
    orderId: string;
    userId: string;
    amount: number;
    createdAt: string;
}
export type PaymentEvent = PaymentCompletedEvent;
