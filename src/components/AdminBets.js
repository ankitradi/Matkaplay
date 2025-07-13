import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.2rem;
  background: var(--matka-primary, #18181b);
  border-radius: 0.7em;
  overflow: hidden;
`;
const Th = styled.th`
  background: var(--matka-secondary, #23232a);
  color: var(--matka-gold, #ffe066);
  font-weight: 700;
  padding: 0.8em 0.5em;
  border-bottom: 2px solid var(--matka-gold, #ffe066);
`;
const Td = styled.td`
  color: #fff;
  padding: 0.7em 0.5em;
  border-bottom: 1px solid #23232a;
  text-align: center;
`;

function AdminBets() {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    async function fetchBets() {
      const { supabase } = await import('../supabaseClient');
      const { data, error } = await supabase
        .from('bets')
        .select('*, user:users(name, mobile), game:games(name)')
        .order('created_at', { ascending: false });
      setBets(data || []);
    }
    fetchBets();
  }, []);

  return (
    <div>
      <h3 style={{color:'var(--matka-gold, #ffe066)'}}>Bets & History</h3>
      <Table>
        <thead>
          <tr>
            <Th>User Name</Th>
            <Th>Mobile Number</Th>
            <Th>Game Name</Th>
            <Th>Bet Number(s)</Th>
            <Th>Bet Price</Th>
            <Th>Date/Time</Th>
          </tr>
        </thead>
        <tbody>
          {bets.length === 0 ? (
            <tr><Td colSpan={5}>No bets placed yet.</Td></tr>
          ) : bets.map((bet, idx) => (
            <tr key={idx}>
              <Td>{bet.user ? bet.user.name : '-'}</Td>
              <Td>{bet.user ? bet.user.mobile : '-'}</Td>
              <Td>{bet.gameName || '-'}</Td>
              <Td>{bet.selectedNumbers && bet.selectedNumbers.join(', ')}</Td>
              <Td>{bet.amount}</Td>
              <Td>{new Date(bet.date).toLocaleString()}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminBets;
