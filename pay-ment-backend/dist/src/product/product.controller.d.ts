import { ProductService } from './product.service';
import { S3Service } from '../s3/s3.service';
import { CreateProductDto } from 'DTO/product.dto';
export declare class ProductController {
    private readonly productService;
    private readonly s3Service;
    constructor(productService: ProductService, s3Service: S3Service);
    getProducts(): Promise<{
        success: boolean;
        data: {
            id: number;
            productName: string;
            price: number;
            image: string[];
        }[];
    }>;
    getProductsPage(page?: string, limit?: string): Promise<{
        success: boolean;
        data: {
            products: {
                id: number;
                productName: string;
                price: number;
                image: string[];
            }[];
            page: number;
            limit: number;
            hasNext: boolean;
        };
    }>;
    getProductById(productId: number): Promise<{
        success: boolean;
        data: {
            id: number;
            productName: string;
            price: number;
            image: string[];
        };
    }>;
    createProduct(dto: CreateProductDto, files?: Express.Multer.File[]): Promise<{
        success: boolean;
        data: {
            id: number;
            productName: string;
            price: number;
            image: string[];
        };
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
