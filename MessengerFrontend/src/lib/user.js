'use server';
import { uploadImagesToS3 } from './imagesave';
import { deleteImageFromS3, getUserInfo, updateUserProfile } from './useractions';
import { redirect } from 'next/navigation';

export async function updateMyInfomation(prevState, formData) {

  const userinfo = {
    uuid: formData.get('uuid'),
    name: formData.get('name'),
    introduce: formData.get('introduce'),
    newProfileImage: formData.get('newProfileImage'),
  };
  const isProfileDelete = formData.get('isProfileDelete') === 'true';

  const result = await saveUserInfo(userinfo, isProfileDelete);

  if (!result.success) {
    return result; 
  }
  redirect(`/`);
}

export async function saveUserInfo(userinfo, isProfileDelete = false) {
  try {
    // ✅ 기존 사용자 정보 조회
    const profileUserInfoResult = await getUserInfo();
    if (profileUserInfoResult.error) {
      return { error: profileUserInfoResult.error };
    }

    let uploadedProfileImageRes = profileUserInfoResult.data.profileImage;

    const hasNewImage = userinfo.newProfileImage && userinfo.newProfileImage.size > 0;

    // ✅ 기존 이미지 삭제 (새 이미지 업로드 또는 삭제 요청 시)
    if ((hasNewImage || isProfileDelete) && uploadedProfileImageRes?.key) {
      const res = await deleteImageFromS3(uploadedProfileImageRes.key);
      if(!res.success)
      {
        return res;
      }
      uploadedProfileImageRes = "";
    }

    // ✅ 새 이미지 업로드 (삭제가 아닐 때만)
    if (hasNewImage && !isProfileDelete) {
      const uploadImageRes = await uploadImagesToS3(userinfo.newProfileImage,"profile");
      if(!uploadImageRes.success)
      {
        return res;
      }
      uploadedProfileImageRes=uploadImageRes.data
    }

   // ✅ 사용자 정보 저장
    const data = await updateUserProfile(
      {
        name: userinfo.name,
        introduce: userinfo.introduce,
        profileImage: uploadedProfileImageRes || ""
      }
    );
    return data;
  } catch (error) {
    console.error('❌ saveUserInfo Error:', error);
    return { error: error.message || '서버와 통신 중 오류가 발생했습니다.' };
  }
}