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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../s3/s3.service");
const product_dto_1 = require("../../DTO/product.dto");
let ProductController = class ProductController {
    productService;
    s3Service;
    constructor(productService, s3Service) {
        this.productService = productService;
        this.s3Service = s3Service;
    }
    async getProducts() {
        return {
            success: true,
            data: await this.productService.getProducts(),
        };
    }
    async getProductsPage(page = '1', limit = '12') {
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        return {
            success: true,
            data: await this.productService.getProductsPage(pageNumber, limitNumber),
        };
    }
    async getProductById(productId) {
        return {
            success: true,
            data: await this.productService.getProductById(productId),
        };
    }
    async createProduct(dto, files) {
        try {
            const product = await this.productService.createProduct({
                productName: dto.productName,
                price: dto.price,
                image: [],
            });
            if (!files || files.length === 0) {
                return {
                    success: true,
                    data: product,
                };
            }
            try {
                const imageUrls = await Promise.all(files.map(file => this.s3Service.uploadFile(file, `products/${product.id}`)));
                const updatedProduct = await this.productService.updateProductImages(product.id, imageUrls);
                return {
                    success: true,
                    data: updatedProduct,
                };
            }
            catch (uploadError) {
                await this.productService.deleteProduct(product.id);
                throw new common_1.InternalServerErrorException('이미지 업로드 실패');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            return {
                success: false,
                message: '상품 등록 중 오류가 발생했습니다.',
            };
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('getProducts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)('productsPage'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsPage", null);
__decorate([
    (0, common_1.Get)('get/:productId'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10)),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        s3_service_1.S3Service])
], ProductController);
//# sourceMappingURL=product.controller.js.map