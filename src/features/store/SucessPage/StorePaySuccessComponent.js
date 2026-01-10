'use client'

import { useState } from 'react';
import styles from '@/../css/PaySuccess.module.css';
import Link from 'next/link';

export default function StorePaySuccessComponent({ receipt }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return(
        <div className={styles.container}>
            <div className={styles.successCard}>
                {/* 성공 아이콘 */}
                <div className={styles.iconWrapper}>
                    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
                        <path d="M8 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>

                {/* 메시지 */}
                <h1 className={styles.title}>결제가 완료되었습니다</h1>
                <p className={styles.subtitle}>주문해 주셔서 감사합니다!</p>

                {/* 주문 정보 */}
                <div className={styles.infoSection}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>주문번호</span>
                        <span className={styles.value}>{receipt.orderId}</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.label}>결제금액</span>
                        <span className={styles.price}>{receipt.amount.toLocaleString()}원</span>
                    </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className={styles.productSection}>
                    <button 
                        className={styles.productHeader}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <div className={styles.headerLeft}>
                            <h2 className={styles.sectionTitle}>주문 상품</h2>
                            <span className={styles.itemCount}>
                                {receipt.items.length}개
                            </span>
                        </div>
                        <svg 
                            className={`${styles.arrow} ${isExpanded ? styles.arrowUp : ''}`}
                            viewBox="0 0 24 24" 
                            fill="none"
                        >
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>

                    {/* 상품 목록 래퍼 */}
                    <div className={`${styles.productListWrapper} ${isExpanded ? styles.expanded : ''}`}>
                        {receipt.items.map((item) => (
                            <div key={item.id} className={styles.productItem}>
                                <div className={styles.productInfo}>
                                    <p className={styles.productName}>
                                        {item.product.productName}
                                    </p>
                                    <p className={styles.quantity}>
                                        수량: {item.quantity}개
                                    </p>
                                </div>
                                <p className={styles.productPrice}>
                                    {item.price.toLocaleString()}원
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 버튼 */}
                <div className={styles.buttonGroup}>
                    <Link href="/store/receipt" className={styles.receiptBtn}>
                        영수증 보기
                    </Link>
                    <Link href="/store" className={styles.homeBtn}>
                        쇼핑 계속하기
                    </Link>
                </div>
            </div>
        </div>
    )
}