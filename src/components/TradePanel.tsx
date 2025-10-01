import { useMemo } from 'react';
import { getTradeDefinition, type TradeGoodId, useGame } from '../store/gameStore';

const MODES: { id: 'export' | 'import' | 'balance'; label: string }[] = [
  { id: 'export', label: 'Export' },
  { id: 'import', label: 'Import' },
  { id: 'balance', label: 'Balance' },
];

export default function TradePanel() {
  const trade = useGame((state) => state.trade);
  const setMode = useGame((state) => state.setTradeMode);
  const setRate = useGame((state) => state.setTradeRate);

  const rows = useMemo(() => Object.keys(trade) as TradeGoodId[], [trade]);

  return (
    <div className="trade-panel">
      {rows.map((id) => {
        const state = trade[id];
        const def = getTradeDefinition(id);
        return (
          <div key={id} className={`trade-row trade-row-${def.accent}`}>
            <div className="trade-header">
              <span className="trade-label">{def.label}</span>
              <div className="trade-modes">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    className={`mode-button ${state.mode === mode.id ? 'active' : ''}`}
                    onClick={() => setMode(id, mode.id)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="trade-controls">
              <input
                type="range"
                min={0}
                max={100}
                value={state.targetPerMinute}
                onChange={(event) => setRate(id, Number(event.target.value))}
              />
              <div className="trade-target">+ {state.targetPerMinute}</div>
              <div className="trade-price">{def.price.toFixed(2)} coins</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
