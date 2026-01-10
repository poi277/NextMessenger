export declare class ReceiptProductDto {
    id: number;
    productName: string;
    image: string[];
}
export declare class OrderItemJoinDto {
    id: number;
    quantity: number;
    price: number;
    product: ReceiptProductDto;
}
export declare class ReceiptResponseDto {
    id: number;
    orderId: string;
    amount: number;
    createdAt: Date;
    items: OrderItemJoinDto[];
}
