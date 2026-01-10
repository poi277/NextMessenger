"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const producer_1 = require("../../kafka/producer");
let PaymentService = class PaymentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async publishPaymentCompleted(event) {
        try {
            const producer = await (0, producer_1.getProducer)();
            await producer.send({
                topic: 'payment-topic',
                messages: [
                    {
                        key: event.orderId,
                        value: JSON.stringify(event),
                    },
                ],
            });
        }
        catch (e) {
            console.error('Kafka 발행 실패', e);
        }
    }
    async processPayment(data) {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const integrity = await tx.paymentIntegrityCheck.findUnique({
                    where: { orderId: data.orderId },
                });
                if (!integrity ||
                    integrity.amount !== data.amount ||
                    integrity.userId !== data.userObjectId) {
                    throw new common_1.BadRequestException('결제 정보가 일치하지 않습니다.');
                }
                const cartItems = await tx.cartItem.findMany({
                    where: {
                        id: { in: integrity.selectedCartItemIds },
                        cart: {
                            userId: data.userObjectId,
                        },
                    },
                    include: { product: true },
                });
                if (cartItems.length === 0) {
                    throw new common_1.BadRequestException('선택한 장바구니 상품을 찾을 수 없습니다.');
                }
                const orderItems = cartItems.map((item) => ({
                    productId: item.productId,
                    productName: item.product.productName,
                    price: item.product.price,
                    quantity: item.quantity,
                }));
                const payment = await tx.payment.create({
                    data: {
                        userObjectId: data.userObjectId,
                        userName: data.userName,
                        orderId: data.orderId,
                        amount: data.amount,
                        paymentKey: data.paymentKey,
                        orderItems: {
                            create: orderItems,
                        },
                    },
                    include: { orderItems: true },
                });
                await tx.cartItem.deleteMany({
                    where: {
                        id: { in: integrity.selectedCartItemIds },
                        cart: {
                            userId: data.userObjectId,
                        },
                    },
                });
                await tx.paymentIntegrityCheck.delete({
                    where: { orderId: data.orderId },
                });
                return payment;
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('결제 처리 중 오류가 발생했습니다.');
        }
    }
    async saveIntegrityCheck(data) {
        const { orderId, ...integrityData } = data;
        try {
            return await this.prisma.paymentIntegrityCheck.upsert({
                where: { orderId },
                update: integrityData,
                create: {
                    orderId,
                    ...integrityData,
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('결제 무결성 정보를 저장하는 중 오류가 발생했습니다.');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=paymentService.js.map