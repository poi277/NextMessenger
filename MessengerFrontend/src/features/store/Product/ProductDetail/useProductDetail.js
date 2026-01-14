// hooks/useProductDetail.js
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cartInputAPI } from "@/lib/ShoppingCartApi";

export default function useProductDetail(Product) {
    const router = useRouter();
    const [amount, setAmount] = useState(1);

    // 행동 상수
    const ACTION_CART = "cart";
    const ACTION_BUY = "buy";

    const increase = () => setAmount(prev => prev + 1);
    
    const decrease = () => setAmount(prev => prev > 1 ? prev - 1 : 1);

    const changeAmount = (e) => {
        const value = Number(e.target.value);
        if (value < 1 || isNaN(value)) return;
        setAmount(value);
    };

    const cartInputHandler = async (action) => {
        try {
            await cartInputAPI({
                productId: Product.id,
                quantity: amount,
            });
            if (action === ACTION_CART) {
                alert(`상품이 담겼습니다.`)
            }
            if (action === ACTION_BUY) {
                router.push("/store/mycart");
            }
        } catch (error) {
            console.error("장바구니/구매 처리 실패", error);
        }
    };


    return {
        amount,
        ACTION_CART,
        ACTION_BUY,
        increase,
        decrease,
        changeAmount,
        cartInputHandler,
    };
}