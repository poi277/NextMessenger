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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_dto_1 = require("../../DTO/payment.dto");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const paymentService_1 = require("./paymentService");
const payment_event_type_1 = require("../../kafka/payment-event.type");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async handlePayment(body, req) {
        const user = req.user;
        const amount = Number(body.amount);
        if (isNaN(amount) || amount <= 0) {
            throw new common_1.BadRequestException('결제 금액이 올바르지 않습니다.');
        }
        const payment = await this.paymentService.processPayment({
            userObjectId: user.userObjectId,
            userName: user.name,
            orderId: body.orderId,
            amount,
            paymentKey: body.paymentKey,
        });
        await this.paymentService.publishPaymentCompleted({
            eventType: payment_event_type_1.PaymentEventType.PAYMENT_COMPLETED,
            paymentId: payment.id,
            orderId: payment.orderId,
            userId: payment.userObjectId,
            amount: payment.amount,
            createdAt: new Date().toISOString(),
        });
        return {
            success: true,
            data: payment,
            message: 'Payment saved',
        };
    }
    async saveIntegrityCheck(body, req) {
        const userObjectId = req.user.userObjectId;
        if (!body.orderId || !body.amount?.value) {
            throw new common_1.BadRequestException('결제 정보가 올바르지 않습니다.');
        }
        const saved = await this.paymentService.saveIntegrityCheck({
            orderId: body.orderId,
            amount: Number(body.amount.value),
            amountCurrency: body.amount.currency,
            userId: userObjectId,
            email: body.email,
            selectedCartItemIds: body.selectedCartItemIds,
        });
        return {
            success: true,
            data: saved,
            message: 'Integrity Check Saved',
        };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    (0, common_1.Post)('pay'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.PaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handlePayment", null);
__decorate([
    (0, common_1.UseGuards)(authMiddleware_1.AuthGuard),
    (0, common_1.Post)('integrityCheck'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.PaymentIntegrityDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "saveIntegrityCheck", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [paymentService_1.PaymentService])
], PaymentController);
//# sourceMappingURL=PaymentController.js.map