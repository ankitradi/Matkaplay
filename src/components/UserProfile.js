import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.55);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #23232a;
  color: #ffe066;
  border-radius: 1.2rem;
  padding: 2.2rem 2.5rem 2rem 2.5rem;
  min-width: 320px;
  box-shadow: 0 6px 32px #000a;
  position: relative;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 16px;
  background: none;
  border: none;
  color: #ffe066;
  font-size: 1.5em;
  cursor: pointer;
`;

export default function UserProfile({ user, onClose }) {
  if (!user) return null;
  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} title="Close">×</CloseBtn>
        <h2 style={{marginTop:0,marginBottom:18}}>Profile</h2>
        <div style={{marginBottom:12}}><b>Name:</b> {user.name}</div>
        <div style={{marginBottom:12}}><b>Mobile:</b> {user.mobile}</div>
        <div style={{marginBottom:12}}><b>Wallet Balance:</b> ₹{user.wallet}</div>
        {/* Add more profile fields here if needed */}
      </Modal>
    </Overlay>
  );
}
