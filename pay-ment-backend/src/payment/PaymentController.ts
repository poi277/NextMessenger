// PaymentController.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { PaymentDto, PaymentIntegrityDto } from 'DTO/payment.dto';
import { AuthGuard } from '../../middleware/authMiddleware';
import { PaymentService } from './paymentService';
import { PaymentEventType } from 'kafka/payment-event.type';

//결제 api는 사업자등록떄문에 미구현 비즈니즈 로직만 추가
//https://github.com/tosspayments/tosspayments-sample/blob/main/express-react/server.js

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('pay')
  async handlePayment(@Body() body: PaymentDto, @Req() req) {
    const user = req.user;

    const amount = Number(body.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('결제 금액이 올바르지 않습니다.');
    }

    // 트랜잭션 처리
    const payment = await this.paymentService.processPayment({
      userObjectId: user.userObjectId,
      userName: user.name,
      orderId: body.orderId,
      amount,
      paymentKey: body.paymentKey,
    });

    // Kafka (트랜잭션 밖)
    await this.paymentService.publishPaymentCompleted({
      eventType: PaymentEventType.PAYMENT_COMPLETED,
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

  @UseGuards(AuthGuard)
  @Post('integrityCheck')
  async saveIntegrityCheck(
    @Body() body: PaymentIntegrityDto,
    @Req() req,
  ) {
    const userObjectId = req.user.userObjectId;

    if (!body.orderId || !body.amount?.value) {
      throw new BadRequestException('결제 정보가 올바르지 않습니다.');
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
}
