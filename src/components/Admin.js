import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaUserShield, FaGamepad, FaUsers, FaHistory, FaCogs } from 'react-icons/fa';
import AdminGames from './AdminGames';
import AdminUsers from './AdminUsers';
import AdminBets from './AdminBets';
import AdminPaymentSettings from './AdminPaymentSettings';
import AdminPayments from './AdminPayments';
import AdminSiteSettings from './AdminSiteSettings';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'matkaplay123'; // Change this as needed

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--matka-primary, #18181b);
  color: #fff;
`;

const LoginBox = styled.div`
  background: var(--matka-secondary, #23232a);
  max-width: 350px;
  margin: 6rem auto 0 auto;
  padding: 2.5rem 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #0006;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginTitle = styled.h2`
  color: var(--matka-gold, #ffe066);
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7em;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7em 1em;
  margin-bottom: 1.1em;
  border-radius: 0.5em;
  border: 1.5px solid var(--matka-border, #2d2d34);
  background: #18181b;
  color: #fff;
  font-size: 1.05em;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.85em 0;
  background: var(--matka-gold, #ffe066);
  color: var(--matka-primary, #18181b);
  font-weight: 700;
  border: none;
  border-radius: 0.5em;
  font-size: 1.1em;
  cursor: pointer;
  margin-top: 0.5em;
  transition: background 0.16s, color 0.16s;
  &:hover {
    background: var(--matka-gold-soft, #fff7b2);
    color: var(--matka-red, #e63946);
  }
`;

const ErrorMsg = styled.div`
  color: #e63946;
  margin-bottom: 0.7em;
  font-size: 0.97em;
`;

const AdminPanel = styled.div`
  max-width: 1100px;
  margin: 2.8rem auto 0 auto;
  background: var(--matka-secondary, #23232a);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #0006;
  padding: 2.5rem 2rem 2rem 2rem;
  min-height: 500px;
  display: flex;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2.2rem;
`;

const TabBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: ${({ active }) => active ? 'var(--matka-gold, #ffe066)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--matka-primary, #18181b)' : 'var(--matka-gold, #ffe066)'};
  border: none;
  border-radius: 2em;
  font-size: 1.07rem;
  font-weight: 700;
  padding: 0.45em 1.2em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  box-shadow: ${({ active }) => active ? '0 2px 8px #ffe06644' : 'none'};
  outline: none;
  &:hover, &:focus {
    background: var(--matka-gold-soft, #fff7b2);
    color: var(--matka-red, #e63946);
  }
`;

const Section = styled.div`
  margin-top: 1.2rem;
`;

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('games');

  // Demo: LocalStorage or mock data could be used here

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (!loggedIn) {
    return (
      <Wrapper>
        <LoginBox>
          <LoginTitle><FaUserShield /> Admin Login</LoginTitle>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <form onSubmit={handleLogin} style={{width:'100%'}}>
            <Input type="text" placeholder="Username" value={user} onChange={e => setUser(e.target.value)} autoFocus />
            <Input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
            <Button type="submit"><FaLock /> Login</Button>
          </form>
        </LoginBox>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <AdminPanel>
        <Tabs>
          <TabBtn active={tab==='games'} onClick={()=>setTab('games')}><FaGamepad /> Games</TabBtn>
          <TabBtn active={tab==='users'} onClick={()=>setTab('users')}><FaUsers /> Users</TabBtn>
          <TabBtn active={tab==='bets'} onClick={()=>setTab('bets')}><FaHistory /> Bets</TabBtn>
          <TabBtn active={tab==='payment'} onClick={()=>setTab('payment')}><span role="img" aria-label="Payment">💳</span> Payment</TabBtn>
          <TabBtn active={tab==='pending'} onClick={()=>setTab('pending')}><span role="img" aria-label="Pending">⏳</span> Pending Payments</TabBtn>
          <TabBtn active={tab==='settings'} onClick={()=>setTab('settings')}><FaCogs /> Settings</TabBtn>
        </Tabs>
        <Section>
          {tab === 'games' && <AdminGames />}
          {tab === 'users' && <AdminUsers />}
          {tab === 'bets' && <AdminBets />}
          {tab === 'payment' && <AdminPaymentSettings />}
          {tab === 'pending' && <AdminPayments />}
          {tab === 'settings' && <AdminSiteSettings />}
        </Section>
      </AdminPanel>
    </Wrapper>
  );
}

export default Admin;
