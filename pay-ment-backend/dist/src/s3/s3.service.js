"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    s3Client;
    bucketName;
    region;
    constructor() {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY;
        const secretAccessKey = process.env.AWS_SECRET_KEY;
        const bucketName = process.env.S3_BUCKET_NAME;
        if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
            throw new Error('AWS 환경변수가 설정되지 않았습니다.');
        }
        this.region = region;
        this.bucketName = bucketName;
        this.s3Client = new client_s3_1.S3Client({
            region: this.region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });
    }
    async getPresignedUploadUrl(fileName, fileType, folder) {
        try {
            const key = `uploads/${folder}/${Date.now()}_${fileName}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                ContentType: fileType,
            });
            const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, {
                expiresIn: 300,
            });
            return {
                uploadUrl,
                fileUrl: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
                key,
            };
        }
        catch (error) {
            console.error('Presigned URL 생성 실패:', error);
            throw new common_1.InternalServerErrorException('파일 업로드 URL 생성 중 오류가 발생했습니다.');
        }
    }
    async deleteFile(key) {
        try {
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }));
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('S3 파일 삭제 실패');
        }
    }
    async uploadFile(file, folder) {
        const key = `uploads/${folder}/${Date.now()}_${file.originalname}`;
        try {
            await this.s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }));
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('이미지 업로드 중 오류가 발생했습니다.');
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=s3.service.js.map