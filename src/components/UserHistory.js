import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
  padding: 2rem 1rem;
  background: var(--matka-secondary, #23232a);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #0006;
`;
const Tabs = styled.div`
  display: flex;
  gap: 1.5em;
  margin-bottom: 1.5em;
`;
const TabBtn = styled.button`
  background: ${({ active }) => active ? 'var(--matka-gold, #ffe066)' : 'var(--matka-secondary, #23232a)'};
  color: ${({ active }) => active ? '#18181b' : 'var(--matka-gold, #ffe066)'};
  border: none;
  border-radius: 0.5em;
  padding: 0.6em 1.4em;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  background: transparent;
`;
const Th = styled.th`
  background: var(--matka-red, #b71c1c);
  color: var(--matka-gold, #ffd700);
  padding: 0.7rem;
`;
const Td = styled.td`
  padding: 0.7rem;
  border-bottom: 1px solid #333;
  text-align: center;
  color: var(--matka-gold, #ffd700);
  background: transparent;
`;

export default function UserHistory() {
  const [tab, setTab] = useState('bets');
  const [user, setUser] = useState(null);
  const [bets, setBets] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const { supabase } = await import('../supabaseClient');
      const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
      if (!authUser) { setUser(null); return; }
      setUser(authUser);
      // Bets
      const { data: betsData } = await supabase.from('bets').select('*').eq('user_id', authUser.id).order('created_at', { ascending: false });
      setBets(betsData || []);
      // Payments
      const { data: paymentsData } = await supabase.from('wallet_transactions').select('*').eq('user_id', authUser.id).order('timestamp', { ascending: false });
      setPayments(paymentsData || []);
    }
    fetchUserData();
    // Real-time subscriptions
    const { subscribeToTable } = require('../supabaseRealtime');
    const unsubBets = subscribeToTable('bets', fetchUserData);
    const unsubPayments = subscribeToTable('wallet_transactions', fetchUserData);
    return () => {
      unsubBets();
      unsubPayments();
    };
  }, []);

  if (!user) {
    return <Wrapper><div style={{ color: '#ffe066', marginTop: 30 }}>Please login to view your history.</div></Wrapper>;
  }

  const userBets = bets;
  const userPayments = payments;

  return (
    <Wrapper>
      <Tabs>
        <TabBtn active={tab==='bets'} onClick={()=>setTab('bets')}>Bet History</TabBtn>
        <TabBtn active={tab==='payments'} onClick={()=>setTab('payments')}>Deposit & Withdrawal</TabBtn>
      </Tabs>
      {tab === 'bets' && (
        <Table>
          <thead>
            <tr>
              <Th>Game</Th>
              <Th>Numbers</Th>
              <Th>Amount</Th>
              <Th>Date/Time</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {userBets.length === 0 ? (
              <tr><Td colSpan={5}>No bets placed yet.</Td></tr>
            ) : userBets.map((bet, idx) => (
              <tr key={idx}>
                <Td>{bet.gameName}</Td>
                <Td>{bet.selectedNumbers.join(', ')}</Td>
                <Td>{bet.amount}</Td>
                <Td>{new Date(bet.date).toLocaleString()}</Td>
                <Td>{bet.status ? bet.status : (bet.result ? bet.result : '—')}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {tab === 'payments' && (
        <Table>
          <thead>
            <tr>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date/Time</Th>
            </tr>
          </thead>
          <tbody>
            {userPayments.length === 0 ? (
              <tr><Td colSpan={4}>No deposit or withdrawal history.</Td></tr>
            ) : userPayments.map((p, idx) => (
              <tr key={idx}>
                <Td>{p.type === 'withdraw' ? 'Withdrawal' : 'Deposit'}</Td>
                <Td>{p.amount}</Td>
                <Td>{p.status}</Td>
                <Td>{p.timestamp ? new Date(p.timestamp).toLocaleString() : '-'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Wrapper>
  );
}
