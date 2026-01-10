import { ReceiptService } from './receipt.service';
export declare class ReceiptController {
    private receiptService;
    constructor(receiptService: ReceiptService);
    getUserReceipts(req: any): Promise<{
        orderItems: {
            id: number;
            paymentId: number;
            productId: number;
            productName: string;
            price: number;
            quantity: number;
        }[];
        id: number;
        userObjectId: string;
        userName: string;
        orderId: string;
        amount: number;
        createdAt: Date;
    }[]>;
    getUserReceiptOne(req: any, paymentId: string): Promise<{
        orderItems: {
            id: number;
            paymentId: number;
            productId: number;
            productName: string;
            price: number;
            quantity: number;
        }[];
        id: number;
        userObjectId: string;
        userName: string;
        orderId: string;
        amount: number;
        createdAt: Date;
    } | null>;
    getUserReceiptByOrderId(req: any, orderId: string): Promise<import("../../DTO/Receipt.dto").ReceiptResponseDto | null>;
}
