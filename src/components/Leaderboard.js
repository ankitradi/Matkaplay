import React from "react";

const leaders = [
  { name: "Amit", winnings: 12000 },
  { name: "Priya", winnings: 9500 },
  { name: "Rahul", winnings: 8000 },
];

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ol>
        {leaders.map(l => (
          <li key={l.name}>
            {l.name}: ₹{l.winnings}
          </li>
        ))}
      </ol>
    </div>
  );
}
