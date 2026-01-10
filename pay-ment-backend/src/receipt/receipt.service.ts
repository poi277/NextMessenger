import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReceiptResponseDto } from 'DTO/Receipt.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReceiptService {
  constructor(private prisma: PrismaService) {}

    // 전체 영수증 조회
async getUserReceipts(userObjectId: string) {
  try {
    const receipts = await this.prisma.payment.findMany({
      where: { userObjectId },
      include: {
        orderItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return receipts.map(({ paymentKey, ...rest }) => rest);
  } catch (error) {
    console.error('영수증 조회 실패:', error);
    throw new InternalServerErrorException(
      '결제 내역을 불러오는 중 오류가 발생했습니다.',
    );
  }
}

  // 단일 영수증 조회
async getUserReceiptOne(userObjectId: string, paymentId: string) {
  const id = Number(paymentId);
  if (isNaN(id)) {
    throw new BadRequestException('결제 ID가 올바르지 않습니다.');
  }
  try {
    const receipt = await this.prisma.payment.findFirst({
      where: {
        id,
        userObjectId,
      },
      include: {
        orderItems: true,
      },
    });
    if (!receipt) return null;

    const { paymentKey, ...rest } = receipt;
    return rest;
  } catch (error) {
    throw new InternalServerErrorException(
      '결제 내역을 불러오는 중 오류가 발생했습니다.',
    );
  }
}

async getUserReceiptByOrderId(
  userObjectId: string,
  orderId: string,
): Promise<ReceiptResponseDto | null> {
  try {
    const receipt = await this.prisma.payment.findFirst({
      where: {
        orderId,
        userObjectId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!receipt) return null;
    return {
      id: receipt.id,
      orderId: receipt.orderId,
      amount: receipt.amount,
      createdAt: receipt.createdAt,
      items: receipt.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          productName: item.product.productName,
          image: Array.isArray(item.product.image)
            ? (item.product.image.filter(
                i => typeof i === 'string',
              ) as string[])
            : [],
        },
      })),
    };
  } catch (error) {
    throw new InternalServerErrorException(
      '영수증 정보를 불러오는 중 오류가 발생했습니다.',
    );
  }
}
}