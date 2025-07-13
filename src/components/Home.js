import React from 'react';
import styled from 'styled-components';
import { FaDice } from 'react-icons/fa';

import { useEffect, useState } from 'react';
import { subscribeToTable } from '../supabaseRealtime';

// ...

const DEFAULT_GAMES = [
  { name: 'Kalyan', status: 'Active', timing: '11:00 AM - 12:00 PM' },
  { name: 'Rajdhani', status: 'Active', timing: '01:00 PM - 02:00 PM' },
  { name: 'Night', status: 'Inactive', timing: '09:00 PM - 10:00 PM' }
];

async function getGamesFromSupabase() {
  const { supabase } = await import('../supabaseClient');
  const { data, error } = await supabase.from('games').select('*').eq('status', 'Active').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

// Real-time fetch hook
function useRealtimeGames() {
  const [games, setGames] = useState([]);
  async function fetchGames() {
    setGames(await getGamesFromSupabase());
  }
  useEffect(() => {
    fetchGames();
    const unsubscribe = subscribeToTable('games', fetchGames);
    return unsubscribe;
  }, []);
  return games;
}

const BgPattern = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: repeating-linear-gradient(135deg, rgba(255,224,102,0.015) 0 2px, transparent 2px 40px);
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2.5rem;
  margin-bottom: 1.2rem;
  z-index: 1;
`;

const IconCircle = styled.div`
  background: var(--matka-gold, #ffe066);
  color: var(--matka-primary, #18181b);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  box-shadow: 0 2px 12px #ffe06633;
  margin-bottom: 0.6rem;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--matka-gold, #ffe066);
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 0.2rem 0 0.5rem 0;
  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const Tagline = styled.div`
  text-align: center;
  color: #fff8;
  font-size: 1.15rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  margin-top: 0.2rem;
  @media (max-width: 600px) {
    font-size: 0.97rem;
    margin-bottom: 0.3rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.2rem;
  margin: 2.5rem auto 2.5rem auto;
  max-width: 950px;
  z-index: 1;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin: 1.2rem 0.5rem 1.5rem 0.5rem;
  }
`;

const Card = styled.div`
  background: var(--matka-secondary, #23232a);
  border-radius: var(--matka-card-radius, 1rem);
  box-shadow: 0 2px 10px #0005, 0 0px 0px 1.5px var(--matka-border, #2d2d34);
  padding: 2.2rem 1.2rem 1.2rem 1.2rem;
  text-align: center;
  color: var(--matka-gold, #ffe066);
  font-size: 1.18rem;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: transform 0.17s, box-shadow 0.17s, border 0.17s;
  cursor: pointer;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--matka-gold, #ffe066), var(--matka-gold-soft, #fff7b2));
    border-radius: 1rem 1rem 0 0;
    opacity: 0.7;
  }
  &:hover, &:active {
    transform: scale(1.055) translateY(-2px);
    box-shadow: 0 8px 32px #0008, 0 0 0 2px var(--matka-gold, #ffe06633);
  }
  @media (max-width: 600px) {
    padding: 1.2rem 0.6rem;
    font-size: 1.05rem;
  }
`;

const PlayButton = styled.button`
  margin-top: 1.4rem;
  background: var(--matka-gold, #ffe066);
  color: var(--matka-primary, #18181b);
  border: none;
  border-radius: 0.5rem;
  padding: 0.9rem 1.7rem;
  font-size: 1.13rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px #ffe06633;
  display: inline-flex;
  align-items: center;
  gap: 0.7em;
  transition: background 0.18s, color 0.18s, transform 0.13s;
  outline: none;
  &:hover, &:active {
    background: var(--matka-gold-soft, #fff7b2);
    color: var(--matka-red, #e63946);
    transform: scale(1.08);
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 1.02rem;
    padding: 1rem 0;
  }
`;

const HeroBanner = styled.div`
  width: 100%;
  background: linear-gradient(90deg, #ffe066 0%, #fff7b2 100%);
  box-shadow: 0 2px 24px #ffe06622;
  padding: 2.2rem 1rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom-left-radius: 2.5rem;
  border-bottom-right-radius: 2.5rem;
  @media (max-width: 600px) {
    padding: 1.3rem 0.3rem 1rem 0.3rem;
    border-bottom-left-radius: 1.2rem;
    border-bottom-right-radius: 1.2rem;
  }
`;

const HeroTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 900;
  background: linear-gradient(90deg, #e63946 0%, #18181b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 1.5px;
  margin: 0 0 0.6rem 0;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }
`;

const HeroSubtitle = styled.div`
  color: #18181b;
  font-size: 1.23rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.2px;
  max-width: 540px;
  margin: 0 auto;
  @media (max-width: 600px) {
    font-size: 0.99rem;
  }
`;

import Auth from './Auth';

function Home({ setScreen, setSelectedGame, user }) {
  const games = useRealtimeGames();

  return (
    <div>
      <BgPattern />
      <HeroBanner>
        <HeroTitle>Welcome to Matka Play</HeroTitle>
        <HeroSubtitle>
          Experience the thrill of number prediction games with secure payments and instant results
        </HeroSubtitle>
      </HeroBanner>

      {games.length === 0 ? (
        <div style={{color:'#ffe066',textAlign:'center',marginTop:'2rem'}}>No games available.</div>
      ) : (
        <Grid>
          {games.map((game) => (
            <Card key={game.id || game.name}>
              <div><b>{game.name}</b></div>
              <div>Status: {game.status}</div>
              <div>Timing: {game.timing}</div>
              <PlayButton onClick={() => {
                if (user) {
                  setSelectedGame(game.name);
                  setScreen('game');
                }
              }}>
                <FaDice style={{marginRight: 3}} /> Play Now
              </PlayButton>
            </Card>
          ))}
          {/* Only show Leaderboard and How to Play as extra cards */}
          <Card onClick={() => setScreen('leaderboard')} style={{cursor: 'pointer'}}>
            🏆 Leaderboard
          </Card>
          <Card onClick={() => setScreen('tutorial')} style={{cursor: 'pointer'}}>
            📖 How to Play
          </Card>
        </Grid>
      )}
    </div>
  );
}

export default Home;
