import { useMemo } from 'react';
import { useGame } from '../store/gameStore';
import { ITEM_ORDER, ITEMS } from '../data/items';

export default function StorageSummary() {
  const inv = useGame(s=>s.inventory);
  const maxByItem = useGame(s=>s.maxByItem);
  const gold = useGame(s=>s.gold);
  const goldMax = useGame(s=>s.goldMax);

  const { usedFood, capFood, usedMat, capMat } = useMemo(()=>{
    let usedFood = 0, capFood = 0, usedMat = 0, capMat = 0;
    ITEM_ORDER.forEach(id => {
      const isFood = ITEMS[id].cat === 'food';
      if (isFood) { usedFood += inv[id]||0; capFood += maxByItem[id]||0; }
      else { usedMat += inv[id]||0; capMat += maxByItem[id]||0; }
    });
    return { usedFood, capFood, usedMat, capMat };
  }, [inv, maxByItem]);

  const pctFood = capFood ? Math.min(100, Math.round((usedFood / capFood) * 100)) : 0;
  const pctMat = capMat ? Math.min(100, Math.round((usedMat / capMat) * 100)) : 0;

  return (
    <div className="card">
      <h3>Storage Summary</h3>
      <div className="stat">
        <span>Food: <strong>{usedFood}</strong> / {capFood}</span>
        <span>Materials: <strong>{usedMat}</strong> / {capMat}</span>
        <span>Gold: <strong>{gold.toFixed(2)}</strong> / {goldMax}</span>
      </div>
      <div className="small">Granary ↑ comida • Warehouse ↑ materiales • Warehouse también ↑ oro</div>
      <div style={{marginTop:8}} className="progress"><div style={{width: `${pctFood}%`}}/></div>
      <div style={{marginTop:8}} className="progress"><div style={{width: `${pctMat}%`}}/></div>
    </div>
  );
}
