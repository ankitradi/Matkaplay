import React from "react";

const markets = [
  { name: "Main Mumbai", status: "Open", result: "-" },
  { name: "Kalyan", status: "Closed", result: "123-45" },
  { name: "Milan", status: "Open", result: "-" },
];

export default function MarketList() {
  return (
    <div className="market-list">
      <h2>Matka Markets</h2>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>Status</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr key={market.name}>
              <td>{market.name}</td>
              <td>{market.status}</td>
              <td>{market.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
