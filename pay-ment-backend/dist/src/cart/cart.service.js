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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addToCart(userId, product) {
        const { productId, quantity } = product;
        if (!productId || quantity <= 0) {
            throw new common_1.BadRequestException('상품 ID와 수량이 올바르지 않습니다.');
        }
        try {
            const existsProduct = await this.prisma.product.findUnique({
                where: { id: productId },
            });
            if (!existsProduct) {
                throw new common_1.NotFoundException('존재하지 않는 상품입니다.');
            }
            return await this.prisma.$transaction(async (tx) => {
                let cart = await tx.cart.findFirst({
                    where: { userId },
                });
                if (!cart) {
                    cart = await tx.cart.create({
                        data: { userId },
                    });
                }
                const existingItem = await tx.cartItem.findFirst({
                    where: {
                        cartId: cart.id,
                        productId,
                    },
                });
                if (existingItem) {
                    await tx.cartItem.update({
                        where: { id: existingItem.id },
                        data: {
                            quantity: existingItem.quantity + quantity,
                        },
                    });
                }
                else {
                    await tx.cartItem.create({
                        data: {
                            cartId: cart.id,
                            productId,
                            quantity,
                        },
                    });
                }
                return await tx.cart.findFirst({
                    where: { userId },
                    include: {
                        items: {
                            include: { product: true },
                        },
                    },
                });
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('장바구니에 상품을 추가하는 중 오류가 발생했습니다.');
        }
    }
    async getCart(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('사용자 정보가 올바르지 않습니다.');
        }
        try {
            const cart = await this.prisma.cart.findFirst({
                where: { userId },
                include: {
                    items: {
                        include: { product: true },
                    },
                },
            });
            return cart ?? { items: [] };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('장바구니를 불러오는 중 오류가 발생했습니다.');
        }
    }
    async deleteItem(userId, productId) {
        let result;
        try {
            result = await this.prisma.$transaction(async (tx) => {
                const cart = await tx.cart.findFirst({
                    where: { userId },
                    include: { items: true },
                });
                if (!cart) {
                    throw new common_1.NotFoundException('장바구니 없음');
                }
                const target = cart.items.find((item) => item.productId === productId);
                if (!target) {
                    throw new common_1.NotFoundException('상품이 장바구니에 없음');
                }
                await tx.cartItem.delete({
                    where: { id: target.id },
                });
                return { message: '상품 삭제 완료' };
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('장바구니 상품 삭제 중 오류가 발생했습니다.');
        }
        return result;
    }
    async updateAmount(userId, productId, quantity) {
        if (quantity < 1) {
            throw new common_1.BadRequestException('수량은 1 이상이어야 합니다.');
        }
        let result;
        try {
            result = await this.prisma.$transaction(async (tx) => {
                const cart = await tx.cart.findFirst({
                    where: { userId },
                    include: { items: true },
                });
                if (!cart) {
                    throw new common_1.NotFoundException('장바구니 없음');
                }
                const target = cart.items.find((item) => item.productId === productId);
                if (!target) {
                    throw new common_1.NotFoundException('상품이 장바구니에 없음');
                }
                await tx.cartItem.update({
                    where: { id: target.id },
                    data: { quantity },
                });
                return { message: '수량 변경 완료' };
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('수량 변경 중 오류가 발생했습니다.');
        }
        return result;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map