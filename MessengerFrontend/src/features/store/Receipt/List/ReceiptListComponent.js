'use client'

import styles from '@/../css/ReceiptList.module.css'
import Link from 'next/link'

export default function ReceiptListComponent({ receipts }) {
  
  if (!receipts || receipts.length === 0) {
    return <p className={styles.empty}>영수증이 없습니다.</p>;
  }

   return (
    <div className={styles.wrapper}>
      <div className={styles.receiptListPage}>
        <h1 className={styles.title}>영수증 목록</h1>

        <div className={styles.list}>
          {receipts.map((receipt) => (
            <Link
              key={receipt.id}
              href={`/store/receipt/${receipt.id}`}
              className={styles.card}
            >
              <div className={styles.header}>
                <p className={styles.orderId}>{receipt.orderId}</p>
                <p className={styles.date}>
                  {new Date(receipt.createdAt).toLocaleString()}
                </p>
              </div>

              <div className={styles.body}>
                <p className={styles.totalPrice}>
                  총 금액: <b>{receipt.amount.toLocaleString()}원</b>
                </p>
                <p className={styles.items}>
                  상품 수: {receipt.orderItems.length}개
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
