import StoreMainComponent from '@/features/store/MainPage/StoreMainComponent';
import { getProductsPage, GetStoreItemApi } from '../../../lib/ProductAPI';

export const revalidate = 300;

export default async function StoreMainPage() {
  const ProductRes = await getProductsPage({ pageParam: 1 });

    // 데이터 검증
    if (!ProductRes.success) {
      throw new Error( ProductRes.message ||"상품 데이터를 가져오지 못했습니다.");
    }
    return <StoreMainComponent initialItems={ProductRes.data.products} />;
}
