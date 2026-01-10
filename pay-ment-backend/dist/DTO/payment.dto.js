"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentIntegrityDto = exports.PaymentDto = exports.OrderItemDto = void 0;
class OrderItemDto {
    productId;
    productName;
    price;
    quantity;
}
exports.OrderItemDto = OrderItemDto;
class PaymentDto {
    orderId;
    amount;
    paymentKey;
}
exports.PaymentDto = PaymentDto;
class PaymentIntegrityDto {
    orderId;
    amount;
    email;
    selectedCartItemIds;
}
exports.PaymentIntegrityDto = PaymentIntegrityDto;
//# sourceMappingURL=payment.dto.js.map