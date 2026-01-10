import { PaymentEvent } from "kafka/payment-event.type";
export declare function handlePaymentEvent(payload: PaymentEvent): Promise<void>;
