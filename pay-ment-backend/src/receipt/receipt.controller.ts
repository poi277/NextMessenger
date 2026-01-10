import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { AuthGuard } from '../../middleware/authMiddleware';

@Controller('receipt')
export class ReceiptController {
  constructor(private receiptService: ReceiptService) {}

  // 전체 영수증 리스트
  @Get('get')
  @UseGuards(AuthGuard)
  async getUserReceipts(@Req() req) {
    const userObjectId = req.user.userObjectId;
    return this.receiptService.getUserReceipts(userObjectId);
  }

  // 단일 영수증 조회
  @Get('payment/:paymentId')
  @UseGuards(AuthGuard)
  async getUserReceiptOne(@Req() req, @Param('paymentId') paymentId: string) {
    const userObjectId = req.user.userObjectId;
    return this.receiptService.getUserReceiptOne(userObjectId, paymentId);
  }
  
  @Get('order/:orderId')
  @UseGuards(AuthGuard)
  async getUserReceiptByOrderId(@Req() req, @Param('orderId') orderId: string) {
    const userObjectId = req.user.userObjectId;
    return this.receiptService.getUserReceiptByOrderId(userObjectId, orderId);
  }
}
