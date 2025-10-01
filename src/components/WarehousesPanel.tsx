import React from 'react';
import { useGame } from '../store/gameStore';
import { BUILDINGS } from '../data/buildings';

export default function WarehousesPanel() {
  const canAfford = useGame(s=>s.canAfford);
  const build = useGame(s=>s.build);
  const goldMax = useGame(s=>s.goldMax);
  const maxByItem = useGame(s=>s.maxByItem);
  const buildings = useGame(s=>s.buildings);
  const id = 'warehouse' as const;
  const def = BUILDINGS[id];
  const count = buildings[id]?.count || 0;
  const planksCap = maxByItem['planks'] || 0;
  const costStr = Object.entries(def.cost).map(([i,q])=> `${q} ${i}`).join(', ');

  return (
    <div className="card">
      <h3>Warehouses</h3>
      <div className="stat">
        <span>Built: <strong>{count}</strong></span>
        <span>Planks cap: <strong>{planksCap}</strong></span>
        <span>Gold cap: <strong>{goldMax}</strong></span>
      </div>
      <div className="kv small">
        <span>+50 materiales (wood/stone/tools/metal/luxury) por warehouse</span>
        <span>+250 oro</span>
      </div>
      <div className="kv">
        <button className="btn" disabled={!canAfford(id)} onClick={()=>build(id)}>Build Warehouse ({costStr})</button>
      </div>
    </div>
  );
}
