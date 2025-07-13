import React, { useState } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5rem;
  margin: 2rem 0;
  background: rgba(34, 17, 17, 0.8);
  border-radius: 1rem;
  box-shadow: 0 2px 12px #ffd70022;
  padding: 1rem 0.5rem;
  @media (max-width: 600px) {
    overflow-x: auto;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.35rem;
    padding: 0.5rem 0.2rem;
  }
`;

const NumberCell = styled.button`
  background: ${({ selected }) => (selected ? 'var(--matka-gold, #ffd700)' : '#222')};
  color: ${({ selected }) => (selected ? 'var(--matka-red, #b71c1c)' : 'var(--matka-gold, #ffd700)')};
  border: 2px solid var(--matka-red, #b71c1c);
  border-radius: 0.5rem;
  font-size: 1.15rem;
  font-weight: bold;
  height: 3rem;
  width: 100%;
  cursor: pointer;
  box-shadow: ${({ selected }) => (selected ? '0 0 10px 2px #ffd70077' : 'none')};
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, transform 0.1s;
  outline: none;
  &:active {
    transform: scale(1.08);
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    height: 2.2rem;
    min-width: 2.2rem;
    padding: 0;
  }
`;

const GameHeader = styled.h2`
  text-align: center;
  background: var(--matka-gold-gradient, linear-gradient(90deg, #ffd700 0%, #fff7b2 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-top: 1.5rem;
  font-size: 2rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #b71c1c33;
  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-top: 0.7rem;
  }
`;

const AmountInput = styled.input`
  width: 80%;
  max-width: 200px;
  padding: 0.7rem;
  margin: 1rem auto;
  display: block;
  border-radius: 0.4rem;
  border: 2px solid var(--matka-red, #b71c1c);
  font-size: 1.1rem;
  background: #222;
  color: var(--matka-gold, #ffd700);
  box-shadow: 0 2px 8px #ffd70022;
  @media (max-width: 600px) {
    padding: 0.5rem;
    font-size: 1rem;
    width: 95%;
  }
`;

const PlaceBetBtn = styled.button`
  display: block;
  margin: 1.5rem auto 0 auto;
  background: var(--matka-gold-gradient, linear-gradient(90deg, #ffd700 0%, #fff7b2 100%));
  color: var(--matka-red, #b71c1c);
  border: none;
  border-radius: 0.5rem;
  padding: 1rem 2.5rem;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #ffd70044;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  outline: none;
  &:hover, &:active {
    background: var(--matka-gold, #ffd700);
    color: #222;
    transform: scale(1.06);
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 1rem;
    padding: 1rem 0;
  }
`;

const ErrorMsg = styled.div`
  color: #ff5252;
  text-align: center;
  margin-top: 0.5rem;
  font-size: 1.05rem;
`;

function Game({ gameName, setScreen, user }) {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleNumberClick = (num) => {
    setSelectedNumbers((prev) =>
      prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num]
    );
  };

  const handleBet = async () => {
    if (!user) {
      setError('Please login to place a bet.');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    const { supabase } = await import('../supabaseClient');
    const authUser = supabase.auth.getUser && (await supabase.auth.getUser()).data.user;
    if (!authUser) { setError('Please login to place a bet.'); return; }
    const { data: userProfile } = await supabase.from('users').select('wallet').eq('id', authUser.id).single();
    const walletBalance = userProfile?.wallet || 0;
    if (walletBalance === 0) {
      setError('Insufficient wallet balance. Please deposit funds.');
      return;
    }
    if (Number(amount) > walletBalance) {
      setError('Bet amount cannot exceed wallet balance.');
      return;
    }
    if (selectedNumbers.length === 0) {
      setError('Select at least one number');
      return;
    }
    // Deduct wallet in Supabase and insert bet
    const newWallet = walletBalance - Number(amount);
    await supabase.from('users').update({ wallet: newWallet }).eq('id', authUser.id);
    await supabase.from('bets').insert([
      {
        user_id: authUser.id,
        game_id: null, // TODO: link to actual game id if available
        amount: Number(amount),
        numbers: selectedNumbers.sort((a,b)=>a-b).join(','),
        status: 'Pending'
      }
    ]);
    setError('');
    setScreen('history');
  };



  return (
    <>
      <GameHeader>{gameName}</GameHeader>
      <Grid>
        {[...Array(100).keys()].map((n) => {
          const numStr = n.toString().padStart(2, '0');
          return (
            <NumberCell
              key={numStr}
              selected={selectedNumbers.includes(numStr)}
              onClick={() => handleNumberClick(numStr)}
            >
              {numStr}
            </NumberCell>
          );
        })}
      </Grid>
      <AmountInput
        type="number"
        min="1"
        placeholder="Enter Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {!user && <ErrorMsg style={{color:'#e6b800',fontWeight:'bold'}}>Please login to place a bet.</ErrorMsg>}
      <PlaceBetBtn onClick={handleBet} disabled={!user} style={!user ? {opacity:0.5,cursor:'not-allowed'} : {}}>
        Place Bet
      </PlaceBetBtn>
    </>
  );
}

export default Game;
