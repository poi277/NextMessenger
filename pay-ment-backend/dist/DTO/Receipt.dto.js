"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptResponseDto = exports.OrderItemJoinDto = exports.ReceiptProductDto = void 0;
class ReceiptProductDto {
    id;
    productName;
    image;
}
exports.ReceiptProductDto = ReceiptProductDto;
class OrderItemJoinDto {
    id;
    quantity;
    price;
    product;
}
exports.OrderItemJoinDto = OrderItemJoinDto;
class ReceiptResponseDto {
    id;
    orderId;
    amount;
    createdAt;
    items;
}
exports.ReceiptResponseDto = ReceiptResponseDto;
//# sourceMappingURL=Receipt.dto.js.map