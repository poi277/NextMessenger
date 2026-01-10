'use client';

import useProfile from './useProfile';
import ProfileView from './ProfileView';

export default function Profile({ uuid }) {
  const { user, loading } = useProfile(uuid);

  if (!uuid || loading) {
    return <div>Loading...</div>;
  }

  return <ProfileView user={user} />;
}
