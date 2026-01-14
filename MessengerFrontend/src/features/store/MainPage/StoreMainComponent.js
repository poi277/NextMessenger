// 'use client'
// import styles from '@/../css/Store.module.css';
// import { useAuth } from '@/context/AuthContext';
// import Link from 'next/link';

// export default function StoreMainComponent({ items }) {

//     const { user, loading } = useAuth();
//     if (loading) return <div style={{ padding: '50px' }}>로딩중...</div>;

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <h1 className={styles.title}>STORE</h1>
//       </div>

//       <main className={styles.main}>
//         <div className={styles.grid}>
//           {items.map((product) => (
//             <Link 
//               key={product.id} 
//               href={`/store/product/${product.id}`} 
//               className={styles.cardLink}
//             >
//               <div className={styles.card}>

//                 <div className={styles.imageWrapper}>
//                   <img 
//                     src={product.image} 
//                     alt={product.productName}
//                     className={styles.image}
//                   />
//                 </div>

//                 <div className={styles.infoRow}>
//                   <span className={styles.name}>{product.productName}</span>
//                   <span className={styles.price}>
//                     ₩{product.price.toLocaleString()}
//                   </span>
//                 </div>

//               </div>
//             </Link>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import styles from '@/../css/Store.module.css';
import Link from 'next/link';
import { getProductsPage } from '@/lib/ProductAPI';
import { useAuth } from '@/context/AuthContext';

export default function StoreMainComponent({ initialItems }) {
  const bottomRef = useRef(null);
  const { user, loading } = useAuth();

  // ✅ Hook을 먼저 모두 선언
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam }) => getProductsPage({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage?.success) return undefined;
      return lastPage.data.hasNext ? pages.length + 1 : undefined;
    },
    initialData: {
      pages: [
        {
          success: true,
          data: {
            products: initialItems,
            hasNext: true,
          },
        },
      ],
      pageParams: [1],
    },
  });

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ✅ Hook 선언 후에 조건부 return
  if (loading) {
    return <div style={{ padding: '50px' }}>로딩중...</div>;
  }

  const products = data?.pages.flatMap(page => page.data.products) ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>STORE</h1>
      </div>

      <main className={styles.main}>
        <div className={styles.grid}>
          {products.map(product => (
            <Link
              key={product.id}
              href={`/store/product/${product.id}`}
              className={styles.cardLink}
            >
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img 
                    src={product.image} 
                    alt={product.productName} 
                    className={styles.image}
                  />
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.name}>{product.productName}</span>
                  <span className={styles.price}>
                    ₩{product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div ref={bottomRef} style={{ height: 1 }} />
      </main>
    </div>
  );
}