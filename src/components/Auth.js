import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  background: var(--matka-primary, #18181b);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Box = styled.div`
  background: var(--matka-secondary, #23232a);
  padding: 2.5rem 2rem;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #0006;
  min-width: 330px;
  max-width: 95vw;
`;
const Title = styled.h2`
  color: var(--matka-gold, #ffe066);
  margin-bottom: 1.2rem;
  text-align: center;
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
const Switch = styled.div`
  color: #fff8;
  text-align: center;
  margin-top: 1em;
  cursor: pointer;
  font-size: 0.97em;
`;
const ErrorMsg = styled.div`
  color: #e63946;
  margin-bottom: 0.7em;
  font-size: 0.97em;
`;

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login'); // or 'register'
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loginField, setLoginField] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to generate a dummy email from mobile
  function mobileToEmail(mobile) {
    return `${mobile}@matkaplay.com`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { supabase } = await import('../supabaseClient');
      if (mode === 'register') {
        if (!name.trim() || !/^\d{10}$/.test(mobile) || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
          setError('Enter name, valid email, valid 10-digit mobile, and password (min 6 chars)');
          setLoading(false);
          return;
        }
        // Use the provided email, but store mobile and name as metadata
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password }, { data: { name, mobile, email } });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        // Insert user profile in Supabase 'users' table
        if (data?.user) {
          await supabase.from('users').upsert([
            { id: data.user.id, name, email, mobile, wallet: 0, banned: false }
          ], { onConflict: ['id'] });
        }
        setMode('login');
        setError('Registered! Please check your email to confirm, then login.');
        setPassword('');
      } else {
        // Login: allow either email or 10-digit mobile
        let loginEmail = loginField;
        if (/^\d{10}$/.test(loginField)) {
          loginEmail = mobileToEmail(loginField);
        }
        if (!/^\S+@\S+\.\S+$/.test(loginEmail) || password.length < 6) {
          setError('Enter valid email/mobile and password (min 6 chars)');
          setLoading(false);
          return;
        }
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }
        setError('');
        // Fetch user profile from Supabase
        let userProfile = null;
        let userId = null;
        // Use Supabase Auth to get the logged-in user
        const { data: authUserData, error: userError } = await supabase.auth.getUser();
        if (userError) {
          setError(userError.message);
          setLoading(false);
          return;
        }
        userId = authUserData?.user?.id || data?.user?.id;
        if (userId) {
          // Only query your custom users table for profile data
          const { data: profileRows } = await supabase.from('users').select('*').eq('id', userId).single();
          userProfile = profileRows || null;
        }
        if (onLogin && userProfile) onLogin(userProfile);
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <Wrapper>
      <Box>
        <Title>{mode === 'login' ? 'Login' : 'Register'}</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
              <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
              <Input placeholder="Mobile Number" value={mobile} onChange={e => setMobile(e.target.value.replace(/[^\d]/g, ''))} maxLength={10} />
            </>
          )}
          {mode === 'login' && (
            <Input placeholder="Email or Mobile" value={loginField} onChange={e => setLoginField(e.target.value)} />
          )}
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}</Button>
        </form>
        <Switch onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setPassword(''); }}>
          {mode === 'login' ? 'New user? Register' : 'Already have an account? Login'}
        </Switch>
      </Box>
    </Wrapper>
  );
}

export default Auth;
