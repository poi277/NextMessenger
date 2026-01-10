export declare class OrderItemDto {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}
export declare class PaymentDto {
    orderId: string;
    amount: number | string;
    paymentKey: string;
}
export declare class PaymentIntegrityDto {
    orderId: string;
    amount: {
        value: number;
        currency: string;
    };
    email: string;
    selectedCartItemIds: number[];
}
