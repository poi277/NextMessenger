import { PrismaService } from '../../prisma/prisma.service';
export declare class ProductService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProducts(): Promise<{
        id: number;
        productName: string;
        price: number;
        image: string[];
    }[]>;
    getProductsPage(page: number, limit: number): Promise<{
        products: {
            id: number;
            productName: string;
            price: number;
            image: string[];
        }[];
        page: number;
        limit: number;
        hasNext: boolean;
    }>;
    getProductById(id: number): Promise<{
        id: number;
        productName: string;
        price: number;
        image: string[];
    }>;
    createProduct(data: {
        productName: string;
        price: number;
        image: string[];
    }): Promise<{
        id: number;
        productName: string;
        price: number;
        image: string[];
    }>;
    updateProductImages(productId: number, imageUrls: string[]): Promise<{
        id: number;
        productName: string;
        price: number;
        image: string[];
    }>;
    deleteProduct(productId: number): Promise<void>;
}
