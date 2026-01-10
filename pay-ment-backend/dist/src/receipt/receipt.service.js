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
exports.ReceiptService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ReceiptService = class ReceiptService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserReceipts(userObjectId) {
        try {
            const receipts = await this.prisma.payment.findMany({
                where: { userObjectId },
                include: {
                    orderItems: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return receipts.map(({ paymentKey, ...rest }) => rest);
        }
        catch (error) {
            console.error('영수증 조회 실패:', error);
            throw new common_1.InternalServerErrorException('결제 내역을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getUserReceiptOne(userObjectId, paymentId) {
        const id = Number(paymentId);
        if (isNaN(id)) {
            throw new common_1.BadRequestException('결제 ID가 올바르지 않습니다.');
        }
        try {
            const receipt = await this.prisma.payment.findFirst({
                where: {
                    id,
                    userObjectId,
                },
                include: {
                    orderItems: true,
                },
            });
            if (!receipt)
                return null;
            const { paymentKey, ...rest } = receipt;
            return rest;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('결제 내역을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getUserReceiptByOrderId(userObjectId, orderId) {
        try {
            const receipt = await this.prisma.payment.findFirst({
                where: {
                    orderId,
                    userObjectId,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            if (!receipt)
                return null;
            return {
                id: receipt.id,
                orderId: receipt.orderId,
                amount: receipt.amount,
                createdAt: receipt.createdAt,
                items: receipt.orderItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    product: {
                        id: item.product.id,
                        productName: item.product.productName,
                        image: Array.isArray(item.product.image)
                            ? item.product.image.filter(i => typeof i === 'string')
                            : [],
                    },
                })),
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('영수증 정보를 불러오는 중 오류가 발생했습니다.');
        }
    }
};
exports.ReceiptService = ReceiptService;
exports.ReceiptService = ReceiptService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReceiptService);
//# sourceMappingURL=receipt.service.js.map