'use client';

import { useState, useEffect } from "react";
import { DeleteMyCartAPI, UpdateMyCartAmountAPI } from "../../../lib/ShoppingCartApi";
import { useAuth } from "../../../context/AuthContext";

export default function useCartProductList(cartProduct) {
  const [cartItems, setCartItems] = useState([]);
  const { user, loading } = useAuth();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (!cartProduct?.items) return;
    const converted = cartProduct.items.map((items) => ({
      id: items.id,
      productId: items.product.id,
      name: items.product.productName,
      price: items.product.price,
      quantity: items.quantity,
      prevQuantity: items.quantity,
      image: items.product.image,
      checked: true 
    }));

    setCartItems(converted);
  }, [cartProduct]);

// 체크된 아이템들만 먼저 필터링
  const checkedItems = cartItems.filter(item => item.checked);

  // 체크된 아이템들의 총합 계산
  const totalPrice = checkedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    setIsPaymentOpen(true);
  };

  // 체크박스 토글
  const toggleItemCheck = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // 전체 선택/해제
  const toggleAllCheck = () => {
    const allChecked = cartItems.every(item => item.checked);
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, checked: !allChecked }))
    );
  };

  //수량 +- 
  const updateQuantity = async (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newAmount = Math.max(1, item.quantity + delta);

        return {
          ...item,
          quantity: newAmount,
        };
      })
    );

    const target = cartItems.find((i) => i.id === id);
    if (!target) return;

    const newAmount = Math.max(1, target.quantity + delta);

    try {
      await UpdateMyCartAmountAPI(id, newAmount);
    } catch (err) {
      console.error("수량 업데이트 실패:", err);

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: target.quantity } : item
        )
      );
    }
  };
  //수량 직접 입력
  const handleInputChange = (id, value) => {
    const numeric = value.replace(/[^0-9]/g, "");

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: numeric === "" ? "" : parseInt(numeric),
            }
          : item
      )
    );
  };
  //수량 업데이트
  const handleInputBlur = async (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const finalQuantity = Math.max(1, parseInt(item.quantity) || 1);

    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: finalQuantity } : it
      )
    );
    if (item.prevQuantity === finalQuantity) return;
    try {
      await UpdateMyCartAmountAPI(id, finalQuantity);

      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, prevQuantity: finalQuantity } : it
        )
      );
    } catch (err) {
      console.error("수량 업데이트 실패:", err);
      setCartItems((prev) =>
        prev.map((it) =>
          it.id === id ? { ...it, quantity: item.prevQuantity } : it
        )
      );
    }
  };

  const removeItem = async (id) => {
    try {
      const result = await DeleteMyCartAPI(id);
      if (!result?.error) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("DeleteMyCartAPI 오류:", err);
    }
  };

  return {
    cartItems,
    user,
    loading,
    isPaymentOpen,
    setIsPaymentOpen,
    totalPrice,
    checkedItems,
    handleCheckout,
    updateQuantity,
    handleInputChange,
    handleInputBlur,
    removeItem,
    toggleItemCheck,
    toggleAllCheck,
  };
}