import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

 async addToCart(
  userId: string,
  product: { productId: number; quantity: number },
) {
  const { productId, quantity } = product;
  
  if (!productId || quantity <= 0) {
    throw new BadRequestException('상품 ID와 수량이 올바르지 않습니다.');
  }
  try {
    const existsProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existsProduct) {
      throw new NotFoundException('존재하지 않는 상품입니다.');
    }
    return await this.prisma.$transaction(async (tx) => {
      // 장바구니 조회 or 생성
      let cart = await tx.cart.findFirst({
        where: { userId },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId },
        });
      }

      // 기존 아이템 조회
      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });
      // 수량 업데이트 or 새로 추가
      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }
      // 최신 장바구니 조회
      return await tx.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    });
    
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(
      '장바구니에 상품을 추가하는 중 오류가 발생했습니다.',
    );
  }
}

async getCart(userId: string) {
  if (!userId) {
    throw new BadRequestException('사용자 정보가 올바르지 않습니다.');
  }
  try {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return cart ?? { items: [] };
  } catch (error) {
    throw new InternalServerErrorException(
      '장바구니를 불러오는 중 오류가 발생했습니다.',
    );
  }
}

  // 장바구니에서 상품 삭제
async deleteItem(userId: string, productId: number) {
  let result: { message: string };
  try {
    result = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: { userId },
        include: { items: true },
      });
      if (!cart) {
        throw new NotFoundException('장바구니 없음');
      }
      const target = cart.items.find(
        (item) => item.productId === productId,
      );
      if (!target) {
        throw new NotFoundException('상품이 장바구니에 없음');
      }
      await tx.cartItem.delete({
        where: { id: target.id },
      });
      return { message: '상품 삭제 완료' };
    });
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw error;
    }
    throw new InternalServerErrorException(
      '장바구니 상품 삭제 중 오류가 발생했습니다.',
    );
  }
  return result;
}


  async updateAmount(userId: string,productId: number,quantity: number,) {
  if (quantity < 1) {
    throw new BadRequestException('수량은 1 이상이어야 합니다.');
  }
  let result;
  try {
    result = await this.prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: { userId },
        include: { items: true },
      });
      if (!cart) {
        throw new NotFoundException('장바구니 없음');
      }
      const target = cart.items.find(
        (item) => item.productId === productId,
      );
      if (!target) {
        throw new NotFoundException('상품이 장바구니에 없음');
      }
      await tx.cartItem.update({
        where: { id: target.id },
        data: { quantity },
      });
      return { message: '수량 변경 완료' };
    });
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(
      '수량 변경 중 오류가 발생했습니다.',
    );
  }

  return result;
}
}
