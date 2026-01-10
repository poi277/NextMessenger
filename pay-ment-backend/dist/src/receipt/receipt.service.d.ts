import { ReceiptResponseDto } from 'DTO/Receipt.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class ReceiptService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserReceipts(userObjectId: string): Promise<{
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
    getUserReceiptOne(userObjectId: string, paymentId: string): Promise<{
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
    getUserReceiptByOrderId(userObjectId: string, orderId: string): Promise<ReceiptResponseDto | null>;
}
