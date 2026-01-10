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
exports.ReceiptController = void 0;
const common_1 = require("@nestjs/common");
const receipt_service_1 = require("./receipt.service");
const authMiddleware_1 = require("../../middleware/authMiddleware");
let ReceiptController = class ReceiptController {
    receiptService;
    constructor(receiptService) {
        this.receiptService = receiptService;
    }
    async getUserReceipts(req) {
        const userObjectId = req.user.userObjectId;
        return this.receiptService.getUserReceipts(userObjectId);
    }
    async getUserReceiptOne(req, paymentId) {
        const userObjectId = req.user.userObjectId;
        return this.receiptService.getUserReceiptOne(userObjectId, paymentId);
    }
    async getUserReceiptByOrderId(req, orderId) {
        const userObjectId = req.user.userObjectId;
        return this.receiptService.getUserReceiptByOrderId(userObjectId, orderId);
    }
};
exports.ReceiptController = ReceiptController;
__decorate([
    (0, common_1.Get)('get'),
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getUserReceipts", null);
__decorate([
    (0, common_1.Get)('payment/:paymentId'),
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getUserReceiptOne", null);
__decorate([
    (0, common_1.Get)('order/:orderId'),
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReceiptController.prototype, "getUserReceiptByOrderId", null);
exports.ReceiptController = ReceiptController = __decorate([
    (0, common_1.Controller)('receipt'),
    __metadata("design:paramtypes", [receipt_service_1.ReceiptService])
], ReceiptController);
//# sourceMappingURL=receipt.controller.js.map