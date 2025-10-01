import { useMemo } from 'react';
import { useGame } from '../../store/gameStore';
import { selectTopBarSummary } from '../../selectors/inventorySelectors';

const ICONS: Record<string, string> = {
  happiness: '😊',
  population: '👥',
  coins: '🪙',
  logs: '🌲',
  stone: '🪨',
  planks: '🪵',
  wheat: '🌾',
  tools: '🛠️',
};

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value).toLocaleString('en-US')}`;
  }
  if (value >= 100) {
    return Math.round(value).toString();
  }
  return value.toFixed(0);
}

export default function InventoryBar() {
  const summary = useGame(selectTopBarSummary);

  const items = useMemo(
    () => [
      {
        id: 'happiness',
        icon: ICONS.happiness,
        label: 'Happiness',
        value: `${Math.round(summary.happiness * 100)}%`,
      },
      {
        id: 'population',
        icon: ICONS.population,
        label: 'Population',
        value: `${summary.villagers}/${summary.villagersCap}`,
      },
      {
        id: 'coins',
        icon: ICONS.coins,
        label: 'Coins',
        value: formatNumber(summary.gold),
      },
      {
        id: 'logs',
        icon: ICONS.logs,
        label: 'Logs',
        value: formatNumber(summary.logs),
      },
      {
        id: 'stone',
        icon: ICONS.stone,
        label: 'Stone',
        value: formatNumber(summary.stone),
      },
      {
        id: 'planks',
        icon: ICONS.planks,
        label: 'Planks',
        value: formatNumber(summary.planks),
      },
      {
        id: 'wheat',
        icon: ICONS.wheat,
        label: 'Wheat',
        value: formatNumber(summary.wheat),
      },
      {
        id: 'tools',
        icon: ICONS.tools,
        label: 'Tools',
        value: formatNumber(summary.tools),
      },
    ],
    [summary]
  );

  return (
    <div className="inventory-bar">
      {items.map((item) => (
        <div key={item.id} className="inventory-chip">
          <span className="inventory-icon" aria-hidden>{item.icon}</span>
          <div className="inventory-meta">
            <span className="inventory-label">{item.label}</span>
            <span className="inventory-value">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
