"use client";

import { Trash2 } from "lucide-react";
import styles from "@/../css/cartProductList.module.css";
import PaymentModal from '@/features/toss/PaymentModal';
import useCartProductList from "./useCartProductList";

export default function CartProductListComponent({ cartProduct }) {
  const {
    cartItems,
    user,
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
  } = useCartProductList(cartProduct);

  const allChecked = cartItems.length > 0 && cartItems.every(item => item.checked);

  return (
    <>
      <div className={styles.cartPage}>
        <div className={styles.cartContainer}>
          <h1 className={styles.cartTitle}>장바구니</h1>
          {cartItems.length === 0 && (
            <p className={styles.emptyCart}>장바구니가 비어 있습니다.</p>
          )}

          {cartItems.length > 0 && (
            <div className={styles.selectAllWrapper}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAllCheck}
                  className={styles.checkbox}
                />
                <span>전체선택 ({cartItems.filter(item => item.checked).length}/{cartItems.length})</span>
              </label>
            </div>
          )}

          <div className={styles.cartList}>
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`${styles.cartItem} ${
                  index === 0 ? styles.firstItemBorder : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItemCheck(item.id)}
                  className={styles.itemCheckbox}
                />

                <div className={styles.productImageWrapper}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.productImage}
                    />
                  ) : (
                    <span className={styles.noImageText}>NO IMAGE</span>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{item.name}</h3>
                  <p className={styles.productPrice}>
                    {item.price.toLocaleString()}원
                  </p>
                </div>

                <div className={styles.quantityBox}>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className={styles.quantityBtn}
                  >
                    +
                  </button>

                  <input
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    onBlur={() => handleInputBlur(item.id)}
                    className={styles.quantityInput}
                  />
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className={styles.quantityBtn}
                  >
                    −
                  </button>
                </div>
                <div className={styles.subtotal}>
                  {(item.price * (item.quantity || 1)).toLocaleString()}원
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className={styles.deleteBtn}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {cartItems.length > 0 && (
            <div className={styles.paymentBar}>
              <div className={styles.paymentContent}>
                <span className={styles.totalPriceText}>
                  총 결제금액:{" "}
                  <span className={styles.totalPriceNumber}>
                    {totalPrice.toLocaleString()}원
                  </span>
                  <span className={styles.selectedCount}>
                    ({checkedItems.length}개 상품)
                  </span>
                </span>

                <button 
                  className={styles.payButton}
                  onClick={handleCheckout}
                >
                  결제하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isPaymentOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setIsPaymentOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '90%', 
              maxWidth: '672px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPaymentOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#9ca3af',
                fontSize: '32px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                backgroundColor: 'white',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'}
              onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              ×
            </button>

            <div style={{ padding: '24px' }}>
              <PaymentModal 
                totalPrice={totalPrice} 
                user={user} 
                cartItems={checkedItems}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}