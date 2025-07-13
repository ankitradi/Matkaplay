import React, { useState, useEffect } from "react";

const STORAGE_KEY = "matka_admin_payment";

function getInitialPayment() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.upiId) return data;
  } catch {}
  return { upiId: "", qr: "" };
}

export default function AdminPaymentSettings() {
  const [upiId, setUpiId] = useState("");
  const [qr, setQr] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = getInitialPayment();
    setUpiId(data.upiId);
    setQr(data.qr);
  }, []);

  function handleSave(e) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ upiId, qr }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }


  function handleQrChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setQr(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{background:'#222',padding:24,borderRadius:12,maxWidth:400,margin:'2rem auto',color:'#fff'}}>
      <h2>Payment Method Settings</h2>
      <form onSubmit={handleSave}>
        <label>UPI ID:<br/>
          <input value={upiId} onChange={e=>setUpiId(e.target.value)} required style={{width:'100%',marginBottom:12}} />
        </label><br/>
        <label>QR Code Image:<br/>
          <input type="file" accept="image/*" onChange={handleQrChange} style={{marginBottom:12}} />
        </label><br/>
        {qr && <img src={qr} alt="QR Code" style={{width:120,marginBottom:12}} />}

        <button type="submit">Save</button>
        {saved && <span style={{color:'#4caf50',marginLeft:12}}>Saved!</span>}
      </form>
    </div>
  );
}
