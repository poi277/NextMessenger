// create-product.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: '상품명은 필수입니다.' })
  productName: string;

  @Type(() => Number)
  @IsNumber({}, { message: '가격은 숫자여야 합니다.' })
  @Min(0, { message: '가격은 0 이상이어야 합니다.' })
  price: number;
}