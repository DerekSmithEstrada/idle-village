import { useGame } from '../store/gameStore';

export default function Header() {
  const season = useGame(s=>s.season);
  const gold = useGame(s=>s.gold);
  const goldMax = useGame(s=>s.goldMax);
  return (
    <div className="card header">
      <div className="season">Season: {season}</div>
      <div>Gold: <strong>{gold.toFixed(2)}</strong> / <span className="small">{goldMax}</span></div>
    </div>
  );
}
