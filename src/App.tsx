import { useEffect, useState } from 'react';
import InventoryBar from './components/inventory/InventoryBar';
import BuildingsPanel from './components/BuildingsPanel';
import SeasonClock from './components/SeasonClock';
import TradePanel from './components/TradePanel';
import { useGame } from './store/gameStore';
import { selectWorkerSummary } from './selectors/inventorySelectors';
import './styles.css';

export default function App() {
  const tick = useGame((state) => state.tick);
  const workerSummary = useGame(selectWorkerSummary);
  const [tooltip, setTooltip] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="app-shell">
      <InventoryBar />
      <main className="content-grid">
        <section className="panel">
          <header className="panel-header">
            <h2>Buildings</h2>
          </header>
          <div className="panel-body">
            <BuildingsPanel onShowTooltip={setTooltip} />
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <h2>Jobs</h2>
            <span className="panel-counter">
              {workerSummary.assigned}/{workerSummary.capacity}
            </span>
          </header>
          <div className="panel-body jobs-panel">
            <SeasonClock />
            {tooltip && (
              <div className="jobs-tooltip">
                {tooltip.split('\n').map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel">
          <header className="panel-header">
            <h2>Trade</h2>
          </header>
          <div className="panel-body">
            <TradePanel />
          </div>
        </section>
      </main>
    </div>
  );
}
