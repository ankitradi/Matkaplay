import React, { useState, useEffect } from "react";

const STORAGE_KEY = "matka_pending_payments";
const WALLET_KEY = "matka_wallet";

function getPending() {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function getWallet() {
  try {
    const w = JSON.parse(localStorage.getItem(WALLET_KEY));
    return w && typeof w.balance === 'number' ? w : { balance: 0, transactions: [] };
  } catch { return { balance: 0, transactions: [] }; }
}

export default function PendingPayments() {
  const [pending, setPending] = useState(getPending());

  useEffect(() => {
    const interval = setInterval(() => setPending(getPending()), 1500);
    return () => clearInterval(interval);
  }, []);

  function approvePayment(idx) {
    const req = pending[idx];
    // Add to wallet
    const wallet = getWallet();
    wallet.balance += req.amount;
    wallet.transactions.unshift({
      id: wallet.transactions.length + 1,
      type: 'UPI Add',
      amount: req.amount,
      date: new Date().toISOString().slice(0, 10),
      approvedBy: 'admin',
    });
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
    // Remove from pending
    const updated = [...pending];
    updated.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPending(updated);
  }

  if (!pending.length) return <div style={{color:'#aaa'}}>No pending payments.</div>;
  return (
    <div>
      <h3>Pending Payments</h3>
      <ul style={{padding:0,listStyle:'none'}}>
        {pending.map((p, i) => (
          <li key={p.id} style={{marginBottom:12,background:'#23232a',padding:12,borderRadius:8}}>
            <b>User:</b> {p.user || 'N/A'}<br/>
            <b>Amount:</b> ₹{p.amount}<br/>
            <b>Time:</b> {new Date(p.timestamp).toLocaleString()}<br/>
            <button onClick={()=>approvePayment(i)} style={{marginTop:6,background:'#4caf50',color:'#fff',border:'none',padding:'0.5em 1em',borderRadius:6,cursor:'pointer'}}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
