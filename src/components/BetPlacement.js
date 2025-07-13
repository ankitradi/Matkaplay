import React, { useState } from "react";

export default function BetPlacement() {
  const [betType, setBetType] = useState("Single");
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Bet Placed! Type: ${betType}, Number: ${number}, Amount: ₹${amount}`);
  }

  return (
    <div className="bet-placement">
      <h2>Place a Bet</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Bet Type:
          <select value={betType} onChange={e => setBetType(e.target.value)}>
            <option value="Single">Single</option>
            <option value="Jodi">Jodi</option>
            <option value="Patti">Patti</option>
          </select>
        </label>
        <label>
          Number:
          <input type="text" value={number} onChange={e => setNumber(e.target.value)} required />
        </label>
        <label>
          Amount (₹):
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        </label>
        <button type="submit">Place Bet</button>
      </form>
    </div>
  );
}
