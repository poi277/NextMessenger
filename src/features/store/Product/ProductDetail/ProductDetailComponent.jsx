// components/ProductDetailComponent.jsx
'use client';

import Image from "next/image";
import styles from '@/../css/ProductDetail.module.css';
import useProductDetail from './useProductDetail'

export default function ProductDetailComponent({ Product }) {
    const {
        amount,
        ACTION_CART,
        ACTION_BUY,
        increase,
        decrease,
        changeAmount,
        cartInputHandler,
    } = useProductDetail(Product);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                
                {/* 왼쪽 - 상품 이미지 */}
                <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                        <Image
                            src={Product.image[0] || "/placeholder-product.png"}
                            alt={Product.productName}
                            fill
                            className={styles.image}
                        />
                    </div>
                </div>

                {/* 오른쪽 - 상품 정보 */}
                <div className={styles.infoSection}>
                    
                    {/* 상품명 */}
                    <h1 className={styles.productName}>
                        {Product.productName}
                    </h1>

                    {/* 가격 */}
                    <div className={styles.priceSection}>
                        <div className={styles.priceWrapper}>
                            <span className={styles.price}>
                                {(Product.price * amount).toLocaleString()}원
                            </span>
                            {amount > 1 && (
                                <span className={styles.unitPrice}>
                                    (개당 {Product.price.toLocaleString()}원)
                                </span>
                            )}
                        </div>
                        <p className={styles.shipping}>무료배송</p>
                    </div>

                    {/* 수량 조절 */}
                    <div className={styles.quantitySection}>
                        <p className={styles.quantityLabel}>수량</p>
                        <div className={styles.quantityControls}>
                            <button 
                                onClick={decrease}
                                className={styles.quantityBtn}
                            >
                                -
                            </button>

                            <input
                                type="number"
                                value={amount}
                                onChange={changeAmount}
                                className={styles.quantityInput}
                            />

                            <button 
                                onClick={increase}
                                className={styles.quantityBtn}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* 총 상품 금액 */}
                    <div className={styles.totalSection}>
                        <div className={styles.totalWrapper}>
                            <span className={styles.totalLabel}>총 상품 금액</span>
                            <div className={styles.totalRight}>
                                <p className={styles.totalCount}>총 수량 {amount}개</p>
                                <p className={styles.totalPrice}>
                                    {(Product.price * amount).toLocaleString()}원
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className={styles.buttonGroup}>
                        <button
                            onClick={() => cartInputHandler(ACTION_CART)}
                            className={styles.cartBtn}
                        >
                            장바구니
                        </button>
                        <button
                            onClick={() => cartInputHandler(ACTION_BUY)}
                            className={styles.buyBtn}
                        >
                            구매하기
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}