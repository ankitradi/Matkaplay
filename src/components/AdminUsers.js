import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';

const Table = styled.table`
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
  background: #e63946;
  color: #fff;
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

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editIdx, setEditIdx] = useState(-1);
  const [editUser, setEditUser] = useState({});

  useEffect(() => {
    async function fetchUsers() {
      const { supabase } = await import('../supabaseClient');
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (!error) setUsers(data || []);
    }
    fetchUsers();
  }, []);

  const handleDelete = async idx => {
    if (window.confirm('Delete this user?')) {
      const { supabase } = await import('../supabaseClient');
      const userToDelete = users[idx];
      if (!userToDelete?.id) return;
      await supabase.from('users').delete().eq('id', userToDelete.id);
      // Refresh users
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
    }
  };

  const startEdit = idx => {
    setEditIdx(idx);
    setEditUser({...users[idx]});
  };

  const cancelEdit = () => {
    setEditIdx(-1);
    setEditUser({});
  };
  const saveEdit = async idx => {
    const { supabase } = await import('../supabaseClient');
    const edited = { ...editUser, wallet: parseInt(editUser.wallet, 10) || 0 };
    await supabase.from('users').update(edited).eq('id', edited.id);
    // Refresh users
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setEditIdx(-1);
    setEditUser({});
  };
  const toggleBan = async idx => {
    const { supabase } = await import('../supabaseClient');
    const userToBan = users[idx];
    if (!userToBan?.id) return;
    await supabase.from('users').update({ banned: !userToBan.banned }).eq('id', userToBan.id);
    // Refresh users
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
  };

  return (
    <div>
      <h3 style={{color:'var(--matka-gold, #ffe066)'}}>Users Management</h3>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Mobile</Th>
            <Th>Wallet</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><Td colSpan={3}>No users registered yet.</Td></tr>
          ) : users.map((u, idx) => (
            <tr key={idx}>
              <Td>{editIdx === idx ? <input value={editUser.name} onChange={e=>setEditUser({...editUser, name:e.target.value})} /> : u.name}</Td>
              <Td>{editIdx === idx ? <input value={editUser.mobile} onChange={e=>setEditUser({...editUser, mobile:e.target.value})} /> : u.mobile}</Td>
              <Td>{editIdx === idx ? <input type="number" value={editUser.wallet} onChange={e=>setEditUser({...editUser, wallet:e.target.value})} /> : (u.wallet || 0)}</Td>
              <Td style={{color:u.banned?'#e63946':'#4caf50',fontWeight:700}}>{u.banned ? 'Banned' : 'Active'}</Td>
              <Td>
                {editIdx === idx ? (
                  <>
                    <button onClick={()=>saveEdit(idx)} style={{marginRight:6}}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=>startEdit(idx)} style={{marginRight:6}}>Edit</button>
                    <button onClick={()=>toggleBan(idx)} style={{marginRight:6}}>{u.banned?'Unban':'Ban'}</button>
                    <ActionBtn onClick={()=>handleDelete(idx)} title="Delete"><FaTrash /></ActionBtn>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminUsers;
