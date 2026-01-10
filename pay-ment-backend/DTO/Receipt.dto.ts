export class ReceiptProductDto {
  id: number;
  productName: string;
  image: string[];
}

export class OrderItemJoinDto {
  id: number;
  quantity: number;
  price: number;
  product: ReceiptProductDto;
}

export class ReceiptResponseDto {
  id: number;
  orderId: string;
  amount: number;
  createdAt: Date;
  items: OrderItemJoinDto[];
}
