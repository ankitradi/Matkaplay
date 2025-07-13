import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const GamesTable = styled.table`
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
const ActionBtn = styled.button`
  background: ${({ color }) => color || 'var(--matka-gold, #ffe066)'};
  color: ${({ color }) => color ? '#fff' : 'var(--matka-primary, #18181b)'};
  border: none;
  border-radius: 0.4em;
  padding: 0.45em 0.7em;
  font-size: 1em;
  margin: 0 0.12em;
  cursor: pointer;
  transition: background 0.16s, color 0.16s;
  &:hover {
    background: var(--matka-gold-soft, #fff7b2);
    color: var(--matka-red, #e63946);
  }
`;
const AddForm = styled.form`
  display: flex;
  gap: 1em;
  margin-top: 1.5em;
  flex-wrap: wrap;
`;
const Input = styled.input`
  padding: 0.6em 1em;
  border-radius: 0.4em;
  border: 1.5px solid var(--matka-border, #2d2d34);
  background: #23232a;
  color: #fff;
  font-size: 1em;
  outline: none;
`;

const DEFAULT_GAMES = [
  { name: 'Kalyan', status: 'Active', timing: '11:00 AM - 12:00 PM' },
  { name: 'Rajdhani', status: 'Active', timing: '01:00 PM - 02:00 PM' },
  { name: 'Night', status: 'Inactive', timing: '09:00 PM - 10:00 PM' }
];

function AdminGames() {
  const [games, setGames] = useState([]);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [editGame, setEditGame] = useState({});
  const [newGame, setNewGame] = useState({ name: '', status: 'Active', timing: '' });

  // Load games from Supabase
  useEffect(() => {
    async function fetchGames() {
      const { supabase } = await import('../supabaseClient');
      const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
      if (!error) setGames(data || []);
      else setGames([]);
    }
    fetchGames();
  }, []);

  const handleEdit = idx => {
    setEditingIdx(idx);
    setEditGame(games[idx]);
  };
  const handleSave = async idx => {
    const { supabase } = await import('../supabaseClient');
    const game = games[idx];
    await supabase.from('games').update({
      name: editGame.name,
      status: editGame.status,
      timing: editGame.timing
    }).eq('id', game.id);
    // Refresh games from Supabase
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    setGames(data || []);
    setEditingIdx(-1);
  };
  const handleDelete = async idx => {
    if (window.confirm('Delete this game?')) {
      const { supabase } = await import('../supabaseClient');
      const game = games[idx];
      await supabase.from('games').delete().eq('id', game.id);
      // Refresh games from Supabase
      const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
      setGames(data || []);
    }
  };
  const handleAdd = async e => {
    e.preventDefault();
    if (!newGame.name.trim() || !newGame.timing.trim()) return;
    const { supabase } = await import('../supabaseClient');
    await supabase.from('games').insert([
      {
        name: newGame.name,
        status: newGame.status,
        timing: newGame.timing
      }
    ]);
    // Refresh games from Supabase
    const { data } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    setGames(data || []);
    setNewGame({ name: '', status: 'Active', timing: '' });
  };


  return (
    <div>
      <h3 style={{color:'var(--matka-gold, #ffe066)'}}>Games Management</h3>
      <GamesTable>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Timing</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {games.map((g, idx) => editingIdx === idx ? (
            <tr key={idx}>
              <Td><Input value={editGame.name} onChange={e=>setEditGame({...editGame, name:e.target.value})} /></Td>
              <Td>
                <select value={editGame.status} onChange={e=>setEditGame({...editGame, status:e.target.value})} style={{padding:'0.3em 0.7em',borderRadius:'0.4em'}}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Td>
              <Td><Input value={editGame.timing} onChange={e=>setEditGame({...editGame, timing:e.target.value})} /></Td>
              <Td>
                <ActionBtn onClick={()=>handleSave(idx)} title="Save"><FaSave /></ActionBtn>
                <ActionBtn color="#e63946" onClick={()=>setEditingIdx(-1)} title="Cancel"><FaTimes /></ActionBtn>
              </Td>
            </tr>
          ) : (
            <tr key={idx}>
              <Td>{g.name}</Td>
              <Td>{g.status}</Td>
              <Td>{g.timing}</Td>
              <Td>
                <ActionBtn onClick={()=>handleEdit(idx)} title="Edit"><FaEdit /></ActionBtn>
                <ActionBtn color="#e63946" onClick={()=>handleDelete(idx)} title="Delete"><FaTrash /></ActionBtn>
              </Td>
            </tr>
          ))}
        </tbody>
      </GamesTable>
      <AddForm onSubmit={handleAdd}>
        <Input placeholder="Game Name" value={newGame.name} onChange={e=>setNewGame({...newGame, name:e.target.value})} />
        <Input placeholder="Timing" value={newGame.timing} onChange={e=>setNewGame({...newGame, timing:e.target.value})} />
        <select value={newGame.status} onChange={e=>setNewGame({...newGame, status:e.target.value})} style={{padding:'0.6em 1em',borderRadius:'0.4em'}}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <ActionBtn type="submit" title="Add"><FaPlus /> Add</ActionBtn>
      </AddForm>
    </div>
  );
}

export default AdminGames;
