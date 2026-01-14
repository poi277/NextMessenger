// 'use client';

// import { useEffect, useState } from 'react';
// import { getAllPosts } from '@/lib/Posts';
// import { useAuth } from '@/context/AuthContext';

// export default function useHomePosts() {
//   const [posts, setPosts] = useState([]);
//   const { user, loading } = useAuth();

//   useEffect(() => {
//     if (loading) return;

//     const fetchPosts = async () => {
//       const res = await getAllPosts();

//       if (!res.success) {
//         setPosts([]);
//         return;
//       }
//       // ⭐ 절대 안전하게
//       setPosts(Array.isArray(res.data) ? res.data : []);
//     };

//     fetchPosts();
//   }, [user, loading]);

//   return {
//     posts,
//     loading,
//   };
// }
