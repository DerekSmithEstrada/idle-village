import React, { useEffect, useState } from 'react';
import { useGame } from '../store/gameStore';

function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function SeasonClock() {
  const season = useGame(s => s.season);
  const seasonStart = useGame(s => s.seasonStart);
  const dur = useGame(s => s.seasonDurationMs);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const iv = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);

  const left = Math.max(0, dur - (now - seasonStart));
  const per = 1 - left / dur;

  return (
    <div className="card">
      <h3>Season Clock</h3>
      <div>
        Current: <strong>{season}</strong> &nbsp;•&nbsp; Time left: <strong>{fmt(left)}</strong>
      </div>
      <div className="small">2:00 min por estación • 8:00 min por año</div>
      <div className="progress" style={{ marginTop: 8 }}>
        <div style={{ width: `${(per * 100).toFixed(2)}%` }} />
      </div>
    </div>
  );
}
