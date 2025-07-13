import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaHome, FaHistory, FaUser } from 'react-icons/fa';
import HeaderProfileButton from './components/HeaderProfileButton';
import Home from './components/Home';
import Auth from './components/Auth';
import Game from './components/Game';
import UserHistory from './components/UserHistory';
import UserMenu from './components/UserMenu';
import Admin from './components/Admin';
import MarketList from './components/MarketList';
import BetPlacement from './components/BetPlacement';
import Wallet from './components/Wallet';
import Leaderboard from './components/Leaderboard';
import Tutorial from './components/Tutorial';

const GlobalStyle = createGlobalStyle`
  body {
    background: #111;
    color: #fff;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #222 100%);
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 2.2rem 1.1rem 2.2rem;
  background: var(--matka-primary, #18181b);
  color: var(--matka-gold, #ffe066);
  font-size: 2rem;
  font-weight: 900;
  border-bottom: 3px solid var(--matka-gold, #ffe066);
  box-shadow: 0 2px 12px #0003;
  z-index: 10;
  @media (max-width: 600px) {
    padding: 0.7rem 0.8rem 0.7rem 1.1rem;
    font-size: 1.3rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2.2rem;
  @media (max-width: 600px) {
    gap: 1.1rem;
  }
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: ${({ active }) => active ? 'var(--matka-gold, #ffe066)' : 'transparent'};
  color: ${({ active }) => active ? 'var(--matka-primary, #18181b)' : 'var(--matka-gold, #ffe066)'};
  border: none;
  border-radius: 2em;
  font-size: 1.08rem;
  font-weight: 700;
  padding: 0.5em 1.3em;
  cursor: pointer;
  transition: background 0.16s, color 0.16s, transform 0.13s;
  box-shadow: ${({ active }) => active ? '0 2px 8px #ffe06644' : 'none'};
  outline: none;
  &:hover, &:focus {
    background: var(--matka-gold-soft, #fff7b2);
    color: var(--matka-red, #e63946);
    transform: scale(1.07);
  }
  @media (max-width: 600px) {
    font-size: 0.97rem;
    padding: 0.45em 0.7em;
  }
`;

function App() {
  // Simple routing: if /admin, show admin panel
  if (window.location.pathname.endsWith('/admin')) {
    return <Admin />;
  }

  // User login state
  const [screen, setScreen] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // or 'register'



  function handleLogin(userProfile) {
    setUser(userProfile);
    setShowAuth(false);
  }
  function handleLogout() {
    setUser(null);
    setScreen('home');
  }

  try {
    console.log('App render', { user, screen, selectedGame });
    return (
      <AppContainer>
        <GlobalStyle />
        <Header style={{display:'flex',alignItems:'center'}}>
          {localStorage.getItem('matka_logo') ? (
            <img src={localStorage.getItem('matka_logo')} alt="Logo" style={{height:38,maxWidth:120,objectFit:'contain',verticalAlign:'middle',marginRight:28,cursor:'pointer'}} onClick={()=>setScreen('home')} />
          ) : (
            <span style={{fontWeight:900,fontSize:'2rem',marginRight:28,cursor:'pointer'}} onClick={()=>setScreen('home')}>MatkaPlay</span>
          )}
          <Nav style={{marginLeft:'auto'}}>
            <NavBtn active={screen === 'home'} onClick={() => setScreen('home')} aria-label="Home">
              <FaHome /> Home
            </NavBtn>
            {user ? (
              <>
                <NavBtn active={screen === 'history'} onClick={() => setScreen('history')} aria-label="Bet History">
                  <FaHistory /> History
                </NavBtn>
                <NavBtn active={screen === 'wallet'} onClick={() => setScreen('wallet')} aria-label="Wallet">
                  💰 Wallet
                </NavBtn>
                <NavBtn onClick={handleLogout} aria-label="Logout">
                  Logout
                </NavBtn>
              </>
            ) : (
              <>
                <NavBtn onClick={() => { setShowAuth(true); setAuthMode('login'); }} aria-label="Login">
                  Login
                </NavBtn>
                <NavBtn onClick={() => { setShowAuth(true); setAuthMode('register'); }} aria-label="Register">
                  Register
                </NavBtn>
              </>
            )}
          </Nav>
          {user && <HeaderProfileButton user={user} />}
        </Header>
        {screen === 'home' && <Home setScreen={setScreen} setSelectedGame={setSelectedGame} user={user} />}
        {screen === 'game' && selectedGame && <Game gameName={selectedGame} setScreen={setScreen} user={user} />}
        {screen === 'markets' && <MarketList />}
        {screen === 'bet' && <BetPlacement />}
        {screen === 'wallet' && <Wallet />}
        {screen === 'leaderboard' && <Leaderboard />}
        {screen === 'tutorial' && <Tutorial />}
        {screen === 'history' && user && <UserHistory setScreen={setScreen} user={user} />}
        {showAuth && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000, background: 'rgba(0,0,0,0.7)' }}>
            <div style={{ position: 'absolute', top: 10, right: 20, zIndex: 10001 }}>
              <button style={{ fontSize: '1.5rem', padding: '0.3em 1em', borderRadius: '0.5em', border: 'none', background: '#ffe066', color: '#18181b', fontWeight: 700, cursor: 'pointer' }} onClick={() => setShowAuth(false)}>X</button>
            </div>
            <Auth onLogin={(u) => {
              handleLogin(u);
              setShowAuth(false);
            }} mode={authMode} />
          </div>
        )}
        {/* Debug logs */}
        {console.log('showAuth:', showAuth, 'authMode:', authMode, 'user:', user)}
        <Footer>
          &copy; {new Date().getFullYear()} MatkaPlay. All rights reserved.
          <span style={{marginLeft:12, fontSize:'0.95em'}}>
            | <a href="#" style={{color:'#ffe066',textDecoration:'underline'}} onClick={e => { e.preventDefault(); setScreen('home'); }}>Home</a>
            {/* Add more footer links or info here if needed */}
          </span>
        </Footer>
      </AppContainer>
    );
  } catch (err) {
    console.error('App render error', err);
    return <div style={{ color: 'red', padding: '2rem' }}>An error occurred: {err.message}</div>;
  }
}

const Footer = styled.footer`
  width: 100%;
  background: #18181b;
  color: #ffe066;
  text-align: center;
  font-size: 1.05rem;
  padding: 1.2em 0 1.1em 0;
  border-top: 2px solid #ffe066;
  margin-top: 2.5em;
`;

export default App;
