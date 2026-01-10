export declare class S3Service {
    private s3Client;
    private bucketName;
    private region;
    constructor();
    getPresignedUploadUrl(fileName: string, fileType: string, folder: string): Promise<{
        uploadUrl: string;
        fileUrl: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<void>;
    uploadFile(file: Express.Multer.File, folder: string): Promise<string>;
}
