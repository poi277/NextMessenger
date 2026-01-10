import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts() {
    try {
      return await this.prisma.product.findMany({
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        '상품 목록을 불러오는 중 오류가 발생했습니다.',
      );
    }
  }

  async getProductsPage(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit;
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'desc' },
      skip,
      take: limit + 1,
    });
    const hasNext = products.length > limit;
    const slicedProducts = hasNext
      ? products.slice(0, limit)
      : products;
    return {
      products: slicedProducts,
      page,
      limit,
      hasNext,
    };
  } catch (error) {
    throw new InternalServerErrorException(
      '상품 목록을 불러오는 중 오류가 발생했습니다.',
    );
  }
}
    
  /** 단일 상품 조회 */
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
    }
    return product;
  }


  /** 1️⃣ 상품 기본 정보 생성 (이미지 없음) */
  async createProduct(data: {
    productName: string;
    price: number;
    image: string[];
  }) {
    try {
      return await this.prisma.product.create({
        data: {
          productName: data.productName,
          price: Number(data.price), 
          image: data.image,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('상품 생성 실패');
    }
  }

  /** 2️⃣ 상품 이미지 업데이트 */
  async updateProductImages(productId: number, imageUrls: string[]) {
    try {
      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          image: imageUrls,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('상품 이미지 업데이트 실패');
    }
  }

  /** 상품 삭제 (S3 실패 시 롤백용) */
  async deleteProduct(productId: number) {
    try {
      await this.prisma.product.delete({
        where: { id: productId },
      });
    } catch (error) {
      // 롤백 중 에러는 로그만 남겨도 OK
      console.error('상품 삭제 실패:', error);
    }
  }
}
