import React, { useState, useEffect } from "react";

export default function AdminSiteSettings() {
  const [logo, setLogo] = useState(localStorage.getItem('matka_logo') || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLogo(localStorage.getItem('matka_logo') || '');
  }, []);

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSave(e) {
    e.preventDefault();
    if (logo) localStorage.setItem('matka_logo', logo);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  return (
    <div style={{background:'#222',padding:24,borderRadius:12,maxWidth:400,margin:'2rem auto',color:'#fff'}}>
      <h2>Site Settings</h2>
      <form onSubmit={handleSave}>
        <label>Site Logo:<br/>
          <input type="file" accept="image/*" onChange={handleLogoChange} style={{marginBottom:12}} />
        </label><br/>
        {logo && <img src={logo} alt="Logo Preview" style={{width:120,maxHeight:60,objectFit:'contain',marginBottom:12,background:'#fff',borderRadius:8}} />}
        <button type="submit">Save</button>
        {saved && <span style={{color:'#4caf50',marginLeft:12}}>Saved!</span>}
      </form>
    </div>
  );
}
