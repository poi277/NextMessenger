import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

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

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  /** Presigned URL 생성 (프론트가 직접 업로드할 때) */
  async getPresignedUploadUrl(
    fileName: string,
    fileType: string,
    folder: string,
  ) {
    try {
      const key = `uploads/${folder}/${Date.now()}_${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: fileType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 300,
      });

      return {
        uploadUrl,
        fileUrl: `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`,
        key,
      };
    } catch (error) {
      console.error('Presigned URL 생성 실패:', error);
      throw new InternalServerErrorException(
        '파일 업로드 URL 생성 중 오류가 발생했습니다.',
      );
    }
  }

  /** 파일 삭제 */
  async deleteFile(key: string) {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (e) {
      throw new InternalServerErrorException('S3 파일 삭제 실패');
    }
  }

/** 파일 직접 업로드 (백엔드가 업로드) */
async uploadFile(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  const key = `uploads/${folder}/${Date.now()}_${file.originalname}`;
  try {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  } catch (error) {
    throw new InternalServerErrorException(
      '이미지 업로드 중 오류가 발생했습니다.',
    );
  }
}

}
