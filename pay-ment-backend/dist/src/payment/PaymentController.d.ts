import { PaymentDto, PaymentIntegrityDto } from 'DTO/payment.dto';
import { PaymentService } from './paymentService';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    handlePayment(body: PaymentDto, req: any): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    saveIntegrityCheck(body: PaymentIntegrityDto, req: any): Promise<{
        success: boolean;
        data: {
            orderId: string;
            amount: number;
            amountCurrency: string;
            email: string;
            userId: string;
            selectedCartItemIds: number[];
            createdAt: Date;
        };
        message: string;
    }>;
}
