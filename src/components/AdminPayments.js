import React, { useState, useEffect } from 'react';
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

export default function AdminPayments() {
  const [tab, setTab] = useState('deposit');
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      const { supabase } = await import('../supabaseClient');
      const { data, error } = await supabase.from('wallet_transactions').select('*').order('timestamp', { ascending: false });
      setRequests(data || []);
    }
    fetchRequests();
  }, []);

  async function approveRequest(id, type) {
    const { supabase } = await import('../supabaseClient');
    // Update transaction status
    await supabase.from('wallet_transactions').update({ status: 'approved' }).eq('id', id);
    // Find the transaction
    const { data: tx } = await supabase.from('wallet_transactions').select('*').eq('id', id).single();
    if (tx && tx.user_id) {
      // Fetch user wallet
      const { data: user } = await supabase.from('users').select('wallet').eq('id', tx.user_id).single();
      let newWallet = user?.wallet || 0;
      if (type === 'deposit') {
        newWallet += parseInt(tx.amount, 10) || 0;
      } else if (type === 'withdraw') {
        newWallet = Math.max(0, newWallet - (parseInt(tx.amount, 10) || 0));
      }
      await supabase.from('users').update({ wallet: newWallet }).eq('id', tx.user_id);
    }
    // Refresh requests
    const { data } = await supabase.from('wallet_transactions').select('*').order('timestamp', { ascending: false });
    setRequests(data || []);
  }

  // Helper to get user details by mobile
  function getUserDetails(mobile) {
    const users = JSON.parse(localStorage.getItem('matka_users')||'[]');
    const user = users.find(u => u.mobile === mobile);
    return user || {};
  }

  const depositReqs = requests.filter(r => r.type !== 'withdraw').map(r => {
    const user = getUserDetails(r.mobile);
    return { ...r, name: r.name || user.name || '-', mobile: r.mobile || user.mobile || '-' };
  });
  const withdrawReqs = requests.filter(r => r.type === 'withdraw').map(r => {
    const user = getUserDetails(r.mobile);
    return { ...r, name: r.name || r.user || user.name || '-', mobile: r.mobile || user.mobile || '-' };
  });

  return (
    <div>
      <h3 style={{color:'var(--matka-gold, #ffe066)'}}>Pending Payment Requests</h3>
      <Tabs>
        <TabBtn active={tab==='deposit'} onClick={()=>setTab('deposit')}>Deposit Requests</TabBtn>
        <TabBtn active={tab==='withdraw'} onClick={()=>setTab('withdraw')}>Withdrawal Requests</TabBtn>
      </Tabs>
      {tab === 'deposit' && (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Mobile</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date/Time</Th>
            </tr>
          </thead>
          <tbody>
            {depositReqs.length === 0 ? (
              <tr><Td colSpan={5}>No deposit requests.</Td></tr>
            ) : depositReqs.map((r, idx) => (
              <tr key={idx}>
                <Td>{r.name || '-'}</Td>
                <Td>{r.mobile || '-'}</Td>
                <Td>{r.amount}</Td>
                <Td>{r.status}
                  {r.status === 'pending' && (
                    <button style={{marginLeft:8,padding:'0.3em 0.8em',borderRadius:6,border:'none',background:'#4caf50',color:'#fff',cursor:'pointer'}} onClick={() => approveRequest(r.id, 'deposit')}>Approve</button>
                  )}
                </Td>
                <Td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '-'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {tab === 'withdraw' && (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Mobile</Th>
              <Th>UPI ID</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date/Time</Th>
            </tr>
          </thead>
          <tbody>
            {withdrawReqs.length === 0 ? (
              <tr><Td colSpan={6}>No withdrawal requests.</Td></tr>
            ) : withdrawReqs.map((r, idx) => (
              <tr key={idx}>
                <Td>{r.name || r.user || '-'}</Td>
                <Td>{r.mobile || '-'}</Td>
                <Td>{r.upiId || '-'}</Td>
                <Td>{r.amount}</Td>
                <Td>{r.status}
                  {r.status === 'pending' && (
                    <button style={{marginLeft:8,padding:'0.3em 0.8em',borderRadius:6,border:'none',background:'#4caf50',color:'#fff',cursor:'pointer'}} onClick={() => approveRequest(r.id, 'withdraw')}>Approve</button>
                  )}
                </Td>
                <Td>{r.timestamp ? new Date(r.timestamp).toLocaleString() : '-'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
