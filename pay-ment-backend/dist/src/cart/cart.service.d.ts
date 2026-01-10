import { PrismaService } from 'prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    addToCart(userId: string, product: {
        productId: number;
        quantity: number;
    }): Promise<({
        items: ({
            product: {
                id: number;
                productName: string;
                price: number;
                image: string[];
            };
        } & {
            id: number;
            quantity: number;
            cartId: number;
            productId: number;
        })[];
    } & {
        id: number;
        userId: string;
    }) | null>;
    getCart(userId: string): Promise<({
        items: ({
            product: {
                id: number;
                productName: string;
                price: number;
                image: string[];
            };
        } & {
            id: number;
            quantity: number;
            cartId: number;
            productId: number;
        })[];
    } & {
        id: number;
        userId: string;
    }) | {
        items: never[];
    }>;
    deleteItem(userId: string, productId: number): Promise<{
        message: string;
    }>;
    updateAmount(userId: string, productId: number, quantity: number): Promise<any>;
}
