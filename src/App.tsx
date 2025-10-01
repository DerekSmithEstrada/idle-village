import { useEffect } from 'react';
import Header from './components/Header';
import BuildingsPanel from './components/BuildingsPanel';
import SeasonClock from './components/SeasonClock';
import StorageSummary from './components/StorageSummary';
import WarehousesPanel from './components/WarehousesPanel';
import GranaryPanel from './components/GranaryPanel';
import { useGame } from './store/gameStore';
import './styles.css';
import InventoryBarContainer from "./components/inventory/InventoryBarContainer";

export default function App() {
  const tick = useGame((s) => s.tick);
  const addVillager = useGame((s) => s.addVillager);

  useEffect(() => {
    const iv = setInterval(() => tick(), 1000);
    return () => clearInterval(iv);
  }, [tick]);

  useEffect(() => {
    const vs = setInterval(() => addVillager(), 60000);
    return () => clearInterval(vs);
  }, [addVillager]);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <Header />
      </header>

      {/* INVENTARIO (debajo del header) */}
      <section className="px-4 py-3">
        <InventoryBarContainer />
      </section>

      {/* CONTENIDO */}
      <main className="px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <SeasonClock />
          <StorageSummary />
          <WarehousesPanel />
          <GranaryPanel />
        </div>
        <div className="space-y-4">
          <BuildingsPanel />
        </div>
      </main>
    </div>
  );
}
