'use server'

import CartProductListComponent from "@/features/store/Cart/CartProductListComponent";
import { GetMyCartAPI } from "../../../../lib/ShoppingCartApi";

export default async function MyCart() {
    const cartProductRes = await GetMyCartAPI();
    if (!cartProductRes.success) {
      throw new Error("해당 상품을 찾을 수 없습니다.");
    }
    return <CartProductListComponent cartProduct={cartProductRes.data}/>;
} 

