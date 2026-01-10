import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  ValidationPipe,
  Query,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { AuthGuard } from 'middleware/authMiddleware';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../s3/s3.service';
import { CreateProductDto } from 'DTO/product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly s3Service: S3Service
  ) {}


  @Get('getProducts')
  async getProducts() {
    return {
      success: true,
      data: await this.productService.getProducts(),
    };
  }

  @Get('productsPage')
  async getProductsPage(
    @Query('page') page = '1',
    @Query('limit') limit = '12',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return {
      success: true,
      data: await this.productService.getProductsPage(
        pageNumber,
        limitNumber,
      ),
    };
  }

  @Get('get/:productId')
  async getProductById(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return {
      success: true,
      data: await this.productService.getProductById(productId),
    };
  }

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images', 10))
  async createProduct(
    @Body(ValidationPipe) dto: CreateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    try {
      const product = await this.productService.createProduct({
        productName: dto.productName,
        price: dto.price, 
        image: [],
      });
      if (!files || files.length === 0) {
        return {
          success: true,
          data: product,
        };
      }
      try {
        const imageUrls = await Promise.all(
          files.map(file =>
            this.s3Service.uploadFile(file, `products/${product.id}`),
          ),
        );

        const updatedProduct = await this.productService.updateProductImages(
          product.id,
          imageUrls,
        );

        return {
          success: true,
          data: updatedProduct,
        };
      } catch (uploadError) {
        await this.productService.deleteProduct(product.id);
        throw new InternalServerErrorException('이미지 업로드 실패');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      return {
        success: false,
        message: '상품 등록 중 오류가 발생했습니다.',
      };
    }
  }
}
