'use client'

import { useRouter } from 'next/navigation';
import styles from '@/../css/ShoppingCartIcon.module.css';

export default function ShoppingCartIcon() {
  const router = useRouter();

  const handleMenuItemClick = (path) => {
    // 체크박스 해제하여 메뉴 닫기
    const checkbox = document.getElementById('menu-open');
    if (checkbox) {
      checkbox.checked = false;
    }
    
    // 페이지 이동
    if (path) {
      router.push(path);
    }
  };

  return (
    <nav className={styles.menu}>
      <input
        id="menu-open"
        name="menu-open"
        className={styles.menuOpen}
        type="checkbox"
      />
      <label htmlFor="menu-open" className={styles.menuOpenButton}>
        <span className={`${styles.lines} ${styles.line1}`}></span>
        <span className={`${styles.lines} ${styles.line2}`}></span>
        <span className={`${styles.lines} ${styles.line3}`}></span>
      </label>
      
      <a 
        className={`${styles.menuItem} ${styles.purple}`} 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleMenuItemClick('/store/mycart');
        }}
      >
        🛒
      </a>
      <a 
        className={`${styles.menuItem} ${styles.lightblue}`} 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleMenuItemClick('/store/receipt'); // 영수증 페이지 경로
        }}
      >
        🧾
      </a>
    </nav>
  );
}