import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: any, body: any): Promise<{
        success: boolean;
        message: string;
        cart: ({
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
        }) | null;
    }>;
    getCart(req: any): Promise<({
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
    deleteItem(req: any, productId: string): Promise<{
        message: string;
    }>;
    updateAmount(req: any, productId: string, body: any): Promise<any>;
}
