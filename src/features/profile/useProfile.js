'use client';

import { useEffect, useState } from "react";
import { UserprofilHandler } from "../../lib/Profile";

export default function useProfile(uuid) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid) return;

    async function loadProfile() {
      try {
        const res = await UserprofilHandler(uuid);
        setUser(res.data);
      } catch (err) {
        console.error('프로필 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [uuid]);

  return {
    user,
    loading,
  };
}
