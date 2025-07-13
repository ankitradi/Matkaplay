import React, { useState } from 'react';
import styled from 'styled-components';

const UserContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  background: #222;
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  color: #ffd700;
  box-shadow: 0 4px 16px #0008;
  text-align: center;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  background: linear-gradient(135deg, #b71c1c 60%, #ffd700 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
`;

const Name = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
`;

const Wallet = styled.div`
  font-size: 1.1rem;
  background: #111;
  border-radius: 0.5rem;
  padding: 0.6rem 0;
  margin: 1rem 0 2rem 0;
  color: #ffd700;
`;

const LogoutBtn = styled.button`
  background: #b71c1c;
  color: #ffd700;
  border: none;
  border-radius: 0.5rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #d32f2f;
  }
`;

function UserMenu({ setScreen }) {
  // Simulate user
  const [wallet, setWallet] = useState(1000);
  const user = {
    name: 'Demo User',
    avatar: '👤'
  };

  const handleLogout = () => {
    // For prototype, just go to home
    setScreen('home');
  };

  return (
    <UserContainer>
      <Avatar>{user.avatar}</Avatar>
      <Name>{user.name}</Name>
      <Wallet>Wallet Balance: <b>₹{wallet}</b></Wallet>
      <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
    </UserContainer>
  );
}

export default UserMenu;
