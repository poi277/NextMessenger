// components/ReceiptComponent.jsx
'use client';

import styles from '@/../css/Receipt.module.css'
import useReceiptDetail from './useReceiptDetail';

export default function ReceiptDetailComponent({ receipt }) {
  const { formatDate, formatPrice } = useReceiptDetail(receipt);

  if (!receipt) {
    return (
      <div className={styles.receiptPage}>
        <div className={styles.receiptContainer}>
          <div className={styles.emptyReceipt}>
            영수증 정보가 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.receiptPage}>
      <div className={styles.receiptContainer}>
        <div className={styles.receiptHeader}>
          <h1 className={styles.receiptTitle}>주문 영수증</h1>
          <p className={styles.orderDate}>{formatDate(receipt.createdAt)}</p>
        </div>

        <div className={styles.receiptCard}>
          {/* 주문 정보 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>주문 정보</h2>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>주문번호</span>
              <span className={styles.infoValue}>{receipt.orderId}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>주문자</span>
              <span className={styles.infoValue}>{receipt.userName}</span>
            </div>
          </div>

          {/* 주문 상품 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>주문 상품</h2>
            <div className={styles.orderItemsList}>
              {receipt?.orderItems?.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.productName}</p>
                    <p className={styles.itemQuantity}>수량: {item.quantity}개</p>
                  </div>
                  <div className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 결제 금액 */}
          <div className={styles.section}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>총 결제금액</span>
              <span className={styles.totalAmount}>{formatPrice(receipt.amount)}원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}