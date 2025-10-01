import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { BuildingId } from '../store/gameStore';
import { getBuildingDefinition, useGame } from '../store/gameStore';
import {
  selectBuildingCapacity,
  selectBuildingState,
  selectCropsAlert,
} from '../selectors/inventorySelectors';

type BuildingsPanelProps = {
  onShowTooltip: (content: string | null) => void;
};

type SectionKey = 'Wood' | 'Stone' | 'Crops';

const LUMBER_TIP = `This building is used to transform logs into planks which can be used for the construction of other buildings.
Maintenance cost: 10 coins /min
1 worker = 40 planks /min
Cost of building: 40 logs, 20 stone, 40 coins`;

function WorkerPopover({
  buildingId,
  onClose,
}: {
  buildingId: BuildingId;
  onClose: () => void;
}) {
  const building = useGame(selectBuildingState(buildingId));
  const capacity = useGame(selectBuildingCapacity(buildingId));
  const assign = useGame((state) => state.assignWorkers);

  return (
    <div className="assign-popover" role="dialog" aria-label="Assign workers">
      <div className="assign-popover-header">Workers</div>
      <div className="assign-popover-body">
        <button
          className="icon-button"
          onClick={() => assign(buildingId, -1)}
          aria-label="Remove worker"
        >
          −
        </button>
        <div className="assign-count">{building.assigned}</div>
        <button
          className="icon-button"
          onClick={() => assign(buildingId, 1)}
          aria-label="Add worker"
        >
          +
        </button>
      </div>
      <div className="assign-capacity">Max {capacity}</div>
      <button className="assign-close" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

function BuildingCard({
  buildingId,
  children,
  onHover,
  onLeave,
  }: {
    buildingId: BuildingId;
    children: ReactNode;
    onHover?: () => void;
    onLeave?: () => void;
  }) {
  const building = useGame(selectBuildingState(buildingId));
  const capacity = useGame(selectBuildingCapacity(buildingId));
  const def = useMemo(() => getBuildingDefinition(buildingId), [buildingId]);
  const build = useGame((state) => state.buildBuilding);
  const demolish = useGame((state) => state.demolishBuilding);
  const status = building.status;
  const [showAssign, setShowAssign] = useState(false);

  return (
    <div
      className="building-card"
      onMouseEnter={onHover}
      onMouseLeave={() => {
        setShowAssign(false);
        onLeave?.();
      }}
    >
      <div className="building-card-header">
        <div>
          <div className="building-name">{def.name}</div>
          <div className="building-workers">
            {building.assigned}/{capacity}
          </div>
        </div>
        <div className={`building-status building-status-${status}`}>
          {status.replace('-', ' ')}
        </div>
      </div>
      <div className="building-card-body">{children}</div>
      <div className="building-card-actions">
        <button className="action-button" onClick={() => build(buildingId)}>
          Build
        </button>
        <button className="action-button" onClick={() => demolish(buildingId)}>
          Demolish
        </button>
        <button className="action-button" onClick={() => setShowAssign((v) => !v)}>
          Assign
        </button>
      </div>
      {showAssign && <WorkerPopover buildingId={buildingId} onClose={() => setShowAssign(false)} />}
    </div>
  );
}

export default function BuildingsPanel({ onShowTooltip }: BuildingsPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<SectionKey, boolean>>({
    Wood: false,
    Stone: true,
    Crops: false,
  });
  const woodcutter = useGame(selectBuildingState('woodcutterCamp'));
  const lumber = useGame(selectBuildingState('lumberHut'));
  const wheat = useGame(selectBuildingState('wheatFarm'));
  const woodCapacity = useGame(selectBuildingCapacity('woodcutterCamp'));
  const lumberSlider = useGame((state) => state.buildings.lumberHut.slider);
  const wheatSlider = useGame((state) => state.buildings.wheatFarm.slider);
  const setSlider = useGame((state) => state.setBuildingSlider);
  const cropsAlert = useGame(selectCropsAlert);

  return (
    <div className="buildings-panel">
      <Section
        title="Wood"
        isCollapsed={collapsed.Wood}
        onToggle={() => setCollapsed((prev) => ({ ...prev, Wood: !prev.Wood }))}
      >
        <BuildingCard buildingId="woodcutterCamp">
          <div className="building-flow">
            <div className="building-flow-label">1 → 1</div>
            <div className="status-track">
              <div
                className="status-indicator"
                style={{ width: `${Math.min(100, Math.max(5, woodCapacity > 0 ? (woodcutter.assigned / woodCapacity) * 100 : 0))}%` }}
              />
            </div>
          </div>
          <div className="building-subtle">{woodcutter.active} active / {woodcutter.built} built</div>
        </BuildingCard>
        <BuildingCard
          buildingId="lumberHut"
          onHover={() => onShowTooltip(LUMBER_TIP)}
          onLeave={() => onShowTooltip(null)}
        >
          <div className="slider-row">
            <input
              type="range"
              min={0}
              max={100}
              value={lumberSlider}
              onChange={(event) => setSlider('lumberHut', Number(event.target.value))}
            />
            <div className="slider-value">{lumberSlider}</div>
          </div>
          <div className="building-subtle">{lumber.active} active / {lumber.built} built</div>
        </BuildingCard>
      </Section>

      <Section
        title="Stone"
        isCollapsed={collapsed.Stone}
        onToggle={() => setCollapsed((prev) => ({ ...prev, Stone: !prev.Stone }))}
      >
        <div className="empty-section">No stone buildings unlocked.</div>
      </Section>

      <Section
        title="Crops"
        isCollapsed={collapsed.Crops}
        onToggle={() => setCollapsed((prev) => ({ ...prev, Crops: !prev.Crops }))}
        alert={cropsAlert ? 'Needs workers or inputs' : undefined}
      >
        <BuildingCard buildingId="wheatFarm">
          <div className="slider-row">
            <input
              type="range"
              min={0}
              max={100}
              value={wheatSlider}
              onChange={(event) => setSlider('wheatFarm', Number(event.target.value))}
            />
            <div className="slider-value">{wheatSlider}</div>
          </div>
          <div className="building-subtle">{wheat.active} active / {wheat.built} built</div>
        </BuildingCard>
      </Section>
    </div>
  );
}

function Section({
  title,
  isCollapsed,
  onToggle,
  alert,
  children,
}: {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  alert?: string;
  children: ReactNode;
}) {
  return (
    <section className="building-section">
      <button className="section-header" onClick={onToggle}>
        <span>{title}</span>
        <span className="section-right">
          {alert && <span className="section-alert">{alert}</span>}
          <span className="section-toggle">{isCollapsed ? '+' : '−'}</span>
        </span>
      </button>
      {!isCollapsed && <div className="section-body">{children}</div>}
    </section>
  );
}
