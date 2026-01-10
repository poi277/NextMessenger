'use server'

import { API_URL } from '../util/URLconfig';
import { apiFetch } from '../util/apiClient';

export async function uploadImagesToS3(file, uploadURL) {

  const presignResult = await apiFetch(`${API_URL}/api/s3/upload-url`, {
    auth: true,
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      s3Url: uploadURL,
    }),
  });

  if (!presignResult.success) {
    return presignResult;
  }

  const { uploadUrl, fileUrl, key } = presignResult.data;

  // 2. S3에 직접 업로드
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    console.error('❌ S3 업로드 실패:', uploadResponse.status);
    return {
      success: false,
      status: uploadResponse.status,
      message: 'S3 업로드 실패',
    };
  }

  console.log('✅ 파일 업로드 성공:', fileUrl);

  // 3. 성공 반환
  return {
    success: true,
    status: 200,
    data: {
      url: fileUrl,
      key,
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
    },
  };
}
