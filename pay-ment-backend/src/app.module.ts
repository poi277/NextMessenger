import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { ReceiptModule } from './receipt/receipt.module';

@Module({
  imports: [
    PrismaModule,
    PaymentModule,
    ProductModule,   
    ReceiptModule,
    CartModule     
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
