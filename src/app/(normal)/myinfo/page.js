import MyInformationForm from '@/features/MyInformation/MyInformationForm';
import { getUserInfo } from '@/lib/useractions';
export default async function MyPage() {
  const res = await getUserInfo();
  if (!res.success) {
    throw new Error(res.message);
  }
  return (
    <div>
      <MyInformationForm userinfo={res.data} />
    </div>
  );
}
