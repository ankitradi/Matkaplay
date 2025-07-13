import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import UserProfile from './UserProfile';

export default function HeaderProfileButton({ user }) {
  const [showProfile, setShowProfile] = useState(false);
  const [profileUser, setProfileUser] = useState(user);
  if (!user) return null;
  function openProfile() {
    // Always fetch latest user from localStorage
    try {
      const u = JSON.parse(localStorage.getItem('matka_current_user'));
      setProfileUser(u || user);
    } catch { setProfileUser(user); }
    setShowProfile(true);
  }
  return (
    <>
      <button
        onClick={openProfile}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffe066',
          fontSize: '2em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
        title="View Profile"
      >
        <FaUserCircle style={{marginRight: 4}} />
        <span style={{fontSize:'1.1rem',fontWeight:700}}>{user.name}</span>
      </button>
      {showProfile && <UserProfile user={profileUser} onClose={() => setShowProfile(false)} />}
    </>
  );
}
