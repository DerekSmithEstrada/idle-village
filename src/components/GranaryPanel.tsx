import React from 'react';
import { useGame } from '../store/gameStore';
import { BUILDINGS } from '../data/buildings';
import { ITEMS } from '../data/items';

export default function GranaryPanel() {
  const canAfford = useGame(s=>s.canAfford);
  const build = useGame(s=>s.build);
  const maxByItem = useGame(s=>s.maxByItem);
  const buildings = useGame(s=>s.buildings);
  const id = 'granary' as const;
  const def = BUILDINGS[id];
  const count = buildings[id]?.count || 0;
  const berriesCap = maxByItem['berries'] || 0;
  const breadCap = maxByItem['bread'] || 0;
  const costStr = Object.entries(def.cost).map(([i,q])=> `${q} ${i}`).join(', ');

  return (
    <div className="card">
      <h3>Granaries</h3>
      <div className="stat">
        <span>Built: <strong>{count}</strong></span>
        <span>Berries cap: <strong>{berriesCap}</strong></span>
        <span>Bread cap: <strong>{breadCap}</strong></span>
      </div>
      <div className="kv small">
        <span>+50 a todos los ítems de comida por granary</span>
      </div>
      <div className="kv">
        <button className="btn" disabled={!canAfford(id)} onClick={()=>build(id)}>Build Granary ({costStr})</button>
      </div>
    </div>
  );
}
