import ProductDetailComponent from "@/features/store/Product/ProductDetail/ProductDetailComponent";
import { GetStoreItemOneApi } from "@/lib/ProductAPI";

export const dynamic = 'error';  // 가능성기준 이 아닌 내가 판단으로 정함 이걸로 정적
export const revalidate = 60;

export default async function StoreItem({ params }) {
 const resolvedParams = await params;
 const productId=resolvedParams.productId;

    const productRes = await GetStoreItemOneApi(productId);

    if (!productRes.success) {
      throw new Error(productRes.message || "해당 상품을 찾을 수 없습니다.");
    }

    return <ProductDetailComponent Product={productRes.data} />;

}
