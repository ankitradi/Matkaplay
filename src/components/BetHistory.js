import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const BackBtn = styled.button`
  background: var(--matka-gold, #ffd700);
  color: var(--matka-red, #b71c1c);
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.3rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.3rem;
  box-shadow: 0 2px 8px #ffd70044;
  transition: background 0.2s, color 0.2s, transform 0.15s;
  outline: none;
  &:hover, &:active {
    background: var(--matka-gold-soft, #fff7b2);
    color: #222;
    transform: scale(1.04);
  }
`;


const Wrapper = styled.div`
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
  padding: 2rem 1rem;
  background: var(--matka-secondary, #23232a);
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px #0006;
`;

const HistoryContainer = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  background: var(--matka-card-bg, #181313);
  border-radius: 1rem;
  padding: 2rem 1rem;
  color: #ffd700;
  box-shadow: 0 4px 16px #0008, var(--matka-glow);
  overflow-x: auto;
  @media (max-width: 600px) {
    padding: 1rem 0.2rem;
    margin: 1rem 0.2rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  background: var(--matka-gold-gradient, linear-gradient(90deg, #ffd700 0%, #fff7b2 100%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  margin-bottom: 2rem;
  font-size: 1.7rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #b71c1c33;
  @media (max-width: 600px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  background: transparent;
  @media (max-width: 600px) {
    font-size: 0.92rem;
    min-width: 400px;
  }
`;

const Th = styled.th`
  background: var(--matka-red, #b71c1c);
  color: var(--matka-gold, #ffd700);
  padding: 0.7rem;
  border-radius: 0.3rem 0.3rem 0 0;
  border: none;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 0.7rem;
  border-bottom: 1px solid #333;
  text-align: center;
  color: var(--matka-gold, #ffd700);
  background: transparent;
`;

function BetHistory({ setScreen }) {
  const [bets, setBets] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('matka_current_user') || 'null'));
    } catch {
      setUser(null);
    }
    const b = JSON.parse(localStorage.getItem('matka_bets') || '[]');
    setBets(b);
  }, []);

  if (!user) {
    return (
      <Wrapper>
        <BackBtn onClick={() => setScreen('home')}>← Back</BackBtn>
        <div style={{ color: '#ffe066', marginTop: 30 }}>
          Please login to view your bet history.
        </div>
      </Wrapper>
    );
  }

  const userBets = bets.filter(bet => bet.user && bet.user.mobile === user.mobile);

  return (
    <Wrapper>
      <BackBtn onClick={() => setScreen('home')}>← Back</BackBtn>
      <Table>
        <thead>
          <tr>
            <Th>Game Name</Th>
            <Th>Numbers</Th>
            <Th>Bet Amount</Th>
            <Th>Date/Time</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {userBets.length === 0 ? (
            <tr>
              <Td colSpan={5}>No bets placed yet.</Td>
            </tr>
          ) : (
            userBets.map((bet, idx) => (
              <tr key={idx}>
                <Td>{bet.gameName}</Td>
                <Td>{bet.selectedNumbers.join(', ')}</Td>
                <Td>{bet.amount}</Td>
                <Td>{new Date(bet.date).toLocaleString()}</Td>
                <Td>{bet.status ? bet.status : (bet.result ? bet.result : '—')}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Wrapper>
  );
}

export default BetHistory;
