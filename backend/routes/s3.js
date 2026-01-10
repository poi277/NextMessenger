const express = require('express');
const { S3Client, PutObjectCommand,DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { authMiddleware } = require('../middleware/auth');


const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// ✅ Presigned URL 생성 API
router.post('/upload-url', authMiddleware, async (req, res) => {
   console.log('📥 Presigned URL 요청 받음:', req.body);
  try {
    const { fileName, fileType,s3Url } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ message: '파일 이름과 타입이 필요합니다.' });
    }

    // 고유한 파일명 생성
    const key = `uploads/${s3Url}/${Date.now()}_${fileName}`;

    // S3 업로드 명령 생성
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
     // ACL: 'public-read', // 공개 읽기 (선택사항)
    });

    // Presigned URL 생성 (5분 유효)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // 최종 파일 URL
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({
      uploadUrl,  // 클라이언트가 업로드할 URL
      fileUrl,    // 업로드 완료 후 접근할 URL
      key,        // S3 키
    });
  } catch (error) {
    res.status(500).json({ message: 'Presigned URL 생성 실패' });
  }
});

async function deleteFile(key) {
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    }));
    console.log(`파일 삭제 성공: ${key}`);
  } catch (err) {
    console.error(`파일 삭제 실패: ${key}`, err);
    throw err;
  }
}





module.exports = router;
module.exports.deleteFile = deleteFile;
