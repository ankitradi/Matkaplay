import React, { useState, useEffect } from "react";



export default function Wallet() {
  const [balance, setBalance] = useState(0);

  // Always fetch latest balance from localStorage on every render
  async function fetchBalance() {
    const { supabase } = await import('../supabaseClient');
    const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
    if (!authUser) return setBalance(0);
    const { data: userProfile } = await supabase.from('users').select('wallet').eq('id', authUser.id).single();
    setBalance(userProfile?.wallet || 0);
  }
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState("deposit");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBalance();
    fetchHistory();
    // Real-time subscriptions
    const { subscribeToTable } = require('../supabaseRealtime');
    const unsubUsers = subscribeToTable('users', fetchBalance);
    const unsubTx = subscribeToTable('wallet_transactions', fetchHistory);
    return () => {
      unsubUsers();
      unsubTx();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    const { supabase } = await import('../supabaseClient');
    const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
    if (!authUser) { setError('Not logged in'); return; }
    if (action === "withdraw" && amt > balance) {
      setError("Insufficient balance");
      return;
    }
    await supabase.from('wallet_transactions').insert([
      {
        user_id: authUser.id,
        type: action,
        amount: amt,
        status: 'pending',
        upi_id: '',
      }
    ]);
    setAmount("");
    setError("");
    fetchHistory();
  }

  const [showUpi, setShowUpi] = useState(false);
  const [upiData, setUpiData] = useState({ upiId: '', qr: '' });
  const [upiFund, setUpiFund] = useState('');
  const [upiMsg, setUpiMsg] = useState('');
  // Withdraw modal state
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdraw, setWithdraw] = useState({ upiId: '', name: '', mobile: '', amount: '' });
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [history, setHistory] = useState([]);

  async function fetchHistory() {
    const { supabase } = await import('../supabaseClient');
    const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
    if (!authUser) return setHistory([]);
    const { data } = await supabase.from('wallet_transactions').select('*').eq('user_id', authUser.id).order('timestamp', { ascending: false });
    setHistory(data || []);
  }

  useEffect(() => {
    if (showUpi) {
      try {
        const d = JSON.parse(localStorage.getItem('matka_admin_payment'));
        if (d && d.upiId) setUpiData(d);
        else setUpiData({ upiId: '', qr: '' });
      } catch { setUpiData({ upiId: '', qr: '' }); }
    }
  }, [showUpi]);

  async function handleUpiFund() {
    const amt = parseInt(upiFund, 10);
    if (isNaN(amt) || amt <= 0) { setUpiMsg('Enter valid amount'); return; }
    const { supabase } = await import('../supabaseClient');
    const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
    if (!authUser) { setUpiMsg('Not logged in'); return; }
    // Check for existing pending
    const { data: pendings } = await supabase.from('wallet_transactions').select('*').eq('user_id', authUser.id).eq('type', 'deposit').eq('status', 'pending');
    if (pendings && pendings.length > 0) {
      setUpiMsg('You already have a pending request. Wait for admin approval.');
      return;
    }
    await supabase.from('wallet_transactions').insert([
      {
        user_id: authUser.id,
        type: 'deposit',
        amount: amt,
        status: 'pending',
        upi_id: upiData.upiId || '',
      }
    ]);
    setUpiMsg('Request sent! Wait for admin approval.');
    setUpiFund('');
    setTimeout(() => { setShowUpi(false); setUpiMsg(''); fetchHistory(); }, 1600);
  }

  return (
    <div className="wallet" style={{maxWidth: 400, margin: "2rem auto", background: "#23232a", padding: 24, borderRadius: 12}}>
      <h2>Wallet</h2>
      <p style={{fontSize: 22, fontWeight: 700, color: "#ffe066"}}>Balance: ₹{balance}</p>
      <button onClick={() => setShowUpi(true)} style={{marginBottom: 12, background:'#ffe066',color:'#18181b',padding:'0.6em 1.3em',borderRadius:8,border:'none',fontWeight:700,cursor:'pointer'}}>Deposit via UPI</button>
      <button onClick={() => setShowWithdraw(true)} style={{marginBottom: 18, background:'#e63946',color:'#fff',padding:'0.6em 1.3em',borderRadius:8,border:'none',fontWeight:700,cursor:'pointer',marginLeft:10}}>Withdraw</button>
      {showUpi && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:10001,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',color:'#18181b',padding:28,borderRadius:14,minWidth:320,position:'relative'}}>
            <button style={{position:'absolute',top:8,right:12,fontSize:22,border:'none',background:'none',cursor:'pointer'}} onClick={()=>setShowUpi(false)}>×</button>
            <h3>Add Funds via UPI</h3>
            {upiData.upiId ? (
              <>
                <div style={{marginBottom:10}}><b>UPI ID:</b> <span style={{fontFamily:'monospace'}}>{upiData.upiId}</span> <button onClick={()=>navigator.clipboard.writeText(upiData.upiId)} style={{fontSize:12,marginLeft:8}}>Copy</button></div>
                {upiData.qr && <img src={upiData.qr} alt="QR Code" style={{width:150,marginBottom:10}} />}
                <div style={{fontSize:13,marginBottom:12}}>Scan QR or send to UPI ID, then enter amount below:</div>
                <input type="number" placeholder="Amount" value={upiFund} onChange={e=>setUpiFund(e.target.value)} style={{marginRight:8,width:90}} min={1} disabled={JSON.parse(localStorage.getItem('matka_pending_payments')||'[]').some(p=>p.status==='pending')} />
                <button onClick={handleUpiFund} disabled={JSON.parse(localStorage.getItem('matka_pending_payments')||'[]').some(p=>p.status==='pending')}>Payment Done</button>
                {upiMsg && <div style={{color:'#4caf50',marginTop:8}}>{upiMsg}</div>}
              </>
            ) : <div style={{color:'#e63946'}}>Payment method not set by admin.</div>}
          </div>
        </div>
      )}
      {/* Show pending message if any */}
      {JSON.parse(localStorage.getItem('matka_pending_payments')||'[]').some(p=>p.status==='pending') && (
        <div style={{background:'#fff3cd',color:'#856404',padding:'0.7em 1em',borderRadius:8,marginBottom:12}}>
          Payment request pending. Please wait for admin verification.
        </div>
      )}
      {showWithdraw && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:10001,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',color:'#18181b',padding:28,borderRadius:14,minWidth:320,position:'relative'}}>
            <button style={{position:'absolute',top:8,right:12,fontSize:22,border:'none',background:'none',cursor:'pointer'}} onClick={()=>setShowWithdraw(false)}>×</button>
            <h3>Withdraw Funds</h3>
            <form onSubmit={async e => {
              e.preventDefault();
              const amt = parseInt(withdraw.amount, 10);
              if (!withdraw.upiId || !withdraw.name || !withdraw.mobile || isNaN(amt) || amt <= 0) {
                setWithdrawMsg('Fill all fields with valid values'); return;
              }
              if (amt > balance) {
                setWithdrawMsg('Withdrawal amount cannot exceed wallet balance.'); return;
              }
              const { supabase } = await import('../supabaseClient');
              const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
              if (!authUser) { setWithdrawMsg('Not logged in'); return; }
              await supabase.from('wallet_transactions').insert([
                {
                  user_id: authUser.id,
                  type: 'withdraw',
                  amount: amt,
                  status: 'pending',
                  upi_id: withdraw.upiId,
                }
              ]);
              setWithdrawMsg('Withdraw request sent! Wait for admin approval.');
              setTimeout(()=>{ setShowWithdraw(false); setWithdrawMsg(''); setWithdraw({ upiId:'', name:'', mobile:'', amount:'' }); fetchHistory(); }, 1700);
            }}>
              <input placeholder="UPI ID" value={withdraw.upiId} onChange={e=>setWithdraw(w=>({...w,upiId:e.target.value}))} style={{width:'100%',marginBottom:10}} />
              <input placeholder="Name" value={withdraw.name} onChange={e=>setWithdraw(w=>({...w,name:e.target.value}))} style={{width:'100%',marginBottom:10}} />
              <input placeholder="Mobile Number" value={withdraw.mobile} onChange={e=>setWithdraw(w=>({...w,mobile:e.target.value}))} style={{width:'100%',marginBottom:10}} />
              <input type="number" placeholder="Amount" value={withdraw.amount} onChange={e=>setWithdraw(w=>({...w,amount:e.target.value}))} style={{width:'100%',marginBottom:10}} min={1} />
              <button type="submit" style={{background:'#e63946',color:'#fff',padding:'0.6em 1.3em',borderRadius:8,border:'none',fontWeight:700,cursor:'pointer'}}>Request Withdraw</button>
              {withdrawMsg && <div style={{color:'#4caf50',marginTop:8}}>{withdrawMsg}</div>}
            </form>
          </div>
        </div>
      )}

      {error && <div style={{color: "#e63946", marginBottom: 10}}>{error}</div>}
      <h3>Deposit Requests</h3>
      <ul style={{maxHeight: 120, overflowY: "auto", padding: 0, listStyle: "none"}}>
        {history.filter(req => req.type === 'deposit').length === 0 && <li>No deposit requests.</li>}
        {history.filter(req => req.type === 'deposit').map(req => (
          <li key={req.id} style={{marginBottom: 6, color: '#4caf50'}}>
            Amount: ₹{req.amount} | Status: {req.status} | {req.timestamp ? new Date(req.timestamp).toLocaleString() : ''}
          </li>
        ))}
      </ul>
      <h3>Withdrawal Requests</h3>
      <ul style={{maxHeight: 120, overflowY: "auto", padding: 0, listStyle: "none"}}>
        {history.filter(req => req.type === 'withdraw').length === 0 && <li>No withdrawal requests.</li>}
        {history.filter(req => req.type === 'withdraw').map(req => (
          <li key={req.id} style={{marginBottom: 6, color: '#e63946'}}>
            Amount: ₹{req.amount} | Status: {req.status} | {req.timestamp ? new Date(req.timestamp).toLocaleString() : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
