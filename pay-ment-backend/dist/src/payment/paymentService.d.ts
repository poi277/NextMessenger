import { PrismaService } from 'prisma/prisma.service';
import { PaymentCompletedEvent } from 'kafka/payment-event.type';
export declare class PaymentService {
    private prisma;
    constructor(prisma: PrismaService);
    publishPaymentCompleted(event: PaymentCompletedEvent): Promise<void>;
    processPayment(data: {
        userObjectId: string;
        userName: string;
        orderId: string;
        amount: number;
        paymentKey: string;
    }): Promise<{
        orderItems: {
            id: number;
            paymentId: number;
            productId: number;
            productName: string;
            price: number;
            quantity: number;
        }[];
    } & {
        id: number;
        userObjectId: string;
        userName: string;
        orderId: string;
        amount: number;
        paymentKey: string;
        createdAt: Date;
    }>;
    saveIntegrityCheck(data: {
        orderId: string;
        amount: number;
        amountCurrency: string;
        userId: string;
        email: string;
        selectedCartItemIds: number[];
    }): Promise<{
        orderId: string;
        amount: number;
        amountCurrency: string;
        email: string;
        userId: string;
        selectedCartItemIds: number[];
        createdAt: Date;
    }>;
}
