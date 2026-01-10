export class OrderItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export class PaymentDto {
  orderId: string;
  amount: number | string;
  paymentKey: string;
}

export class PaymentIntegrityDto {
  orderId: string;
  amount: { value: number; currency: string };
  email: string;
  selectedCartItemIds: number[];
}
