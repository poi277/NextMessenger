import { Module } from '@nestjs/common';
import { PaymentService } from './paymentService';
import { PrismaModule } from 'prisma/prisma.module';
import { PaymentController } from './PaymentController';

@Module({
  imports: [PrismaModule],      // PrismaService 사용 가능
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
