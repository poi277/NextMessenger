// paymentService.ts
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrderItemDto } from '../../DTO/payment.dto';
import { getProducer } from 'kafka/producer';
import { PaymentCompletedEvent } from 'kafka/payment-event.type';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async publishPaymentCompleted(event: PaymentCompletedEvent) {
    try {
      const producer = await getProducer();

      await producer.send({
        topic: 'payment-topic',
        messages: [
          {
            key: event.orderId,
            value: JSON.stringify(event),
          },
        ],
      });
    } catch (e) {
      // Kafka 실패 ≠ 결제 실패
      console.error('Kafka 발행 실패', e);
    }
  }

  async processPayment(data: {
    userObjectId: string;
    userName: string;
    orderId: string;
    amount: number;
    paymentKey: string;
  }) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // 1 무결성 검증
        const integrity = await tx.paymentIntegrityCheck.findUnique({
          where: { orderId: data.orderId },
        });

        if (
          !integrity ||
          integrity.amount !== data.amount ||
          integrity.userId !== data.userObjectId
        ) {
          throw new BadRequestException('결제 정보가 일치하지 않습니다.');
        }

        // 2 장바구니 상품 조회
        const cartItems = await tx.cartItem.findMany({
          where: {
            id: { in: integrity.selectedCartItemIds },
            cart: {
              userId: data.userObjectId,
            },
          },
          include: { product: true },
        });

        if (cartItems.length === 0) {
          throw new BadRequestException(
            '선택한 장바구니 상품을 찾을 수 없습니다.',
          );
        }

        const orderItems: OrderItemDto[] = cartItems.map((item) => ({
          productId: item.productId,
          productName: item.product.productName,
          price: item.product.price,
          quantity: item.quantity,
        }));

        // 3 결제 저장
        const payment = await tx.payment.create({
          data: {
            userObjectId: data.userObjectId,
            userName: data.userName,
            orderId: data.orderId,
            amount: data.amount,
            paymentKey: data.paymentKey,
            orderItems: {
              create: orderItems,
            },
          },
          include: { orderItems: true },
        });

        // 4 장바구니 삭제
        await tx.cartItem.deleteMany({
          where: {
            id: { in: integrity.selectedCartItemIds },
            cart: {
              userId: data.userObjectId,
            },
          },
        });

        // 무결성 체크 삭제
        await tx.paymentIntegrityCheck.delete({
          where: { orderId: data.orderId },
        });

        return payment;
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '결제 처리 중 오류가 발생했습니다.',
      );
    }
  }

  async saveIntegrityCheck(data: {
    orderId: string;
    amount: number;
    amountCurrency: string;
    userId: string;
    email: string;
    selectedCartItemIds: number[];
  }) {
    const { orderId, ...integrityData } = data;

    try {
      return await this.prisma.paymentIntegrityCheck.upsert({
        where: { orderId },
        update: integrityData,
        create: {
          orderId,
          ...integrityData,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        '결제 무결성 정보를 저장하는 중 오류가 발생했습니다.',
      );
    }
  }
}
