'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { searchUsers } from '@/lib/header';

export function useHeaderLogic() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // 메뉴 외부 클릭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 검색 debounce
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await searchUsers(searchTerm);
        setSearchResults(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleLoginClick = () => router.push('/login');
  const handleStoreClick = () => router.push('/store');
  const handleWriteClick = () => user && router.push('/createPost');

  const handleMyPage = () => {
    router.push(`/userhome/${user.uuid}`);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleSelectUser = (uuid) => {
    router.push(`/userhome/${uuid}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  return {
    user,
    loading,
    searchTerm,
    setSearchTerm,
    searchResults,
    isMenuOpen,
    setIsMenuOpen,
    menuRef,
    handleLoginClick,
    handleStoreClick,
    handleWriteClick,
    handleMyPage,
    handleLogout,
    handleSelectUser,
    router,
  };
}
