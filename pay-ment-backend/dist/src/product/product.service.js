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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts() {
        try {
            return await this.prisma.product.findMany({
                orderBy: { id: 'desc' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('상품 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getProductsPage(page, limit) {
        try {
            const skip = (page - 1) * limit;
            const products = await this.prisma.product.findMany({
                orderBy: { id: 'desc' },
                skip,
                take: limit + 1,
            });
            const hasNext = products.length > limit;
            const slicedProducts = hasNext
                ? products.slice(0, limit)
                : products;
            return {
                products: slicedProducts,
                page,
                limit,
                hasNext,
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('상품 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('해당 상품을 찾을 수 없습니다.');
        }
        return product;
    }
    async createProduct(data) {
        try {
            return await this.prisma.product.create({
                data: {
                    productName: data.productName,
                    price: Number(data.price),
                    image: data.image,
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('상품 생성 실패');
        }
    }
    async updateProductImages(productId, imageUrls) {
        try {
            return await this.prisma.product.update({
                where: { id: productId },
                data: {
                    image: imageUrls,
                },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('상품 이미지 업데이트 실패');
        }
    }
    async deleteProduct(productId) {
        try {
            await this.prisma.product.delete({
                where: { id: productId },
            });
        }
        catch (error) {
            console.error('상품 삭제 실패:', error);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map