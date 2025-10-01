import { useGame } from '../store/gameStore';
import { BUILDINGS, type BuildingId } from '../data/buildings';

export default function BuildingsPanel() {
  const canAfford = useGame(s=>s.canAfford);
  const build = useGame(s=>s.build);
  const assign = useGame(s=>s.assign);
  const buildings = useGame(s=>s.buildings);
  return (
    <div className="card">
      <h3>Production Buildings</h3>
      { (Object.keys(BUILDINGS) as BuildingId[]).filter(id => !['warehouse','granary'].includes(id)).map(id=>{
        const def = BUILDINGS[id];
        const b = buildings[id];
        const costStr = Object.entries(def.cost).map(([i,q])=> `${q} ${i}`).join(', ') || 'Free';
        return (
          <div className="building-row" key={id}>
            <div>
              <strong>{def.name}</strong>
              <div className="small">Cost: {costStr}</div>
              {def.recipe && (
                <div className="kv small">
                  {def.recipe.in && Object.entries(def.recipe.in).map(([i,q])=>(<span key={i}>-{q} {i}</span>))}
                  {Object.entries(def.recipe.out).map(([i,q])=>(<span key={i}>+{q} {i}</span>))}
                  <span>{def.recipe.duration}s</span>
                </div>
              )}
            </div>
            <div>
              <button className="btn" disabled={!canAfford(id)} onClick={()=>build(id)}>Build</button>
              <div className="small">x{b.count} • workers {b.employees}</div>
              <div className="kv">
                <button className="btn" onClick={()=>assign(id, +1)}>+ worker</button>
                <button className="btn" onClick={()=>assign(id, -1)}>- worker</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
