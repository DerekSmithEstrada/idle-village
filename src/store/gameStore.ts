import { create } from 'zustand';

type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export type BuildingId = 'woodcutterCamp' | 'lumberHut' | 'wheatFarm';

export type ResourceId = 'logs' | 'stone' | 'planks' | 'wheat' | 'tools';

type BuildingStatus = 'idle' | 'running' | 'no-workers' | 'no-input' | 'no-coins';

type TradeMode = 'export' | 'import' | 'balance';

interface BuildingDefinition {
  id: BuildingId;
  name: string;
  category: 'Wood' | 'Stone' | 'Crops';
  workerCapacity: number;
  outputsPerWorkerPerMinute: Partial<Record<ResourceId, number>>;
  inputsPerWorkerPerMinute?: Partial<Record<ResourceId, number>>;
  maintenancePerMinutePerWorker?: number;
  hasIntensitySlider?: boolean;
}

interface BuildingState {
  id: BuildingId;
  built: number;
  active: number;
  assigned: number;
  slider: number;
  status: BuildingStatus;
}

interface TradeDefinition {
  id: TradeGoodId;
  label: string;
  resource: ResourceId;
  price: number;
  accent: 'red' | 'green' | 'gray' | 'yellow';
}

interface TradeSetting {
  id: TradeGoodId;
  mode: TradeMode;
  targetPerMinute: number;
}

export type TradeGoodId = 'wood' | 'planks' | 'tools' | 'wheat';

const BUILDING_DEFS: Record<BuildingId, BuildingDefinition> = {
  woodcutterCamp: {
    id: 'woodcutterCamp',
    name: 'Woodcutter camp',
    category: 'Wood',
    workerCapacity: 2,
    outputsPerWorkerPerMinute: { logs: 60 },
  },
  lumberHut: {
    id: 'lumberHut',
    name: 'Lumber hut',
    category: 'Wood',
    workerCapacity: 4,
    outputsPerWorkerPerMinute: { planks: 40 },
    inputsPerWorkerPerMinute: { logs: 40 },
    maintenancePerMinutePerWorker: 2.5,
    hasIntensitySlider: true,
  },
  wheatFarm: {
    id: 'wheatFarm',
    name: 'Wheat farm',
    category: 'Crops',
    workerCapacity: 2,
    outputsPerWorkerPerMinute: { wheat: 25 },
    hasIntensitySlider: true,
  },
};

const TRADE_DEFS: Record<TradeGoodId, TradeDefinition> = {
  wood: { id: 'wood', label: 'Wood', resource: 'logs', price: 0.1, accent: 'red' },
  planks: { id: 'planks', label: 'Planks', resource: 'planks', price: 0.15, accent: 'green' },
  tools: { id: 'tools', label: 'Tools', resource: 'tools', price: 0.5, accent: 'gray' },
  wheat: { id: 'wheat', label: 'Wheat', resource: 'wheat', price: 0.8, accent: 'yellow' },
};

const SEASON_ORDER: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];

export interface GameState {
  season: Season;
  seasonStart: number;
  seasonDurationMs: number;
  happiness: number;
  villagers: number;
  villagersCap: number;
  workerCapacity: number;
  otherAssignedWorkers: number;
  gold: number;
  goldMax: number;
  resources: Record<ResourceId, number>;
  buildings: Record<BuildingId, BuildingState>;
  trade: Record<TradeGoodId, TradeSetting>;
  tick: () => void;
  buildBuilding: (id: BuildingId) => void;
  demolishBuilding: (id: BuildingId) => void;
  assignWorkers: (id: BuildingId, delta: number) => void;
  setBuildingSlider: (id: BuildingId, value: number) => void;
  setTradeMode: (id: TradeGoodId, mode: TradeMode) => void;
  setTradeRate: (id: TradeGoodId, value: number) => void;
}

function createInitialBuildings(): Record<BuildingId, BuildingState> {
  return {
    woodcutterCamp: {
      id: 'woodcutterCamp',
      built: 1,
      active: 1,
      assigned: 1,
      slider: 100,
      status: 'running',
    },
    lumberHut: {
      id: 'lumberHut',
      built: 2,
      active: 1,
      assigned: 4,
      slider: 50,
      status: 'running',
    },
    wheatFarm: {
      id: 'wheatFarm',
      built: 1,
      active: 1,
      assigned: 0,
      slider: 25,
      status: 'no-workers',
    },
  };
}

function createInitialTrade(): Record<TradeGoodId, TradeSetting> {
  return {
    wood: { id: 'wood', mode: 'export', targetPerMinute: 20 },
    planks: { id: 'planks', mode: 'import', targetPerMinute: 40 },
    tools: { id: 'tools', mode: 'balance', targetPerMinute: 60 },
    wheat: { id: 'wheat', mode: 'import', targetPerMinute: 90 },
  };
}

function sumAssignedWorkers(state: GameState, omitId?: BuildingId): number {
  return (Object.values(state.buildings) as BuildingState[])
    .filter((b) => (omitId ? b.id !== omitId : true))
    .reduce((acc, b) => acc + b.assigned, 0);
}

function buildingCapacity(def: BuildingDefinition, building: BuildingState): number {
  const active = Math.min(building.active, building.built);
  return active * def.workerCapacity;
}

export const BUILDINGS = BUILDING_DEFS;
export const TRADE_GOODS = TRADE_DEFS;

export const useGame = create<GameState>((set, get) => ({
  season: 'Spring',
  seasonStart: Date.now(),
  seasonDurationMs: 2 * 60 * 1000,
  happiness: 0.78,
  villagers: 185,
  villagersCap: 500,
  workerCapacity: 20,
  otherAssignedWorkers: 10,
  gold: 48,
  goldMax: 500,
  resources: {
    logs: 6,
    stone: 25,
    planks: 0,
    wheat: 0,
    tools: 0,
  },
  buildings: createInitialBuildings(),
  trade: createInitialTrade(),

  tick: () => {
    const state = get();
    const now = Date.now();
    let season = state.season;
    let seasonStart = state.seasonStart;

    if (now - state.seasonStart >= state.seasonDurationMs) {
      const idx = SEASON_ORDER.indexOf(state.season);
      season = SEASON_ORDER[(idx + 1) % SEASON_ORDER.length];
      seasonStart = now;
    }

    let gold = state.gold;
    const resources: Record<ResourceId, number> = { ...state.resources };
    const buildings: Record<BuildingId, BuildingState> = { ...state.buildings };

    (Object.keys(BUILDING_DEFS) as BuildingId[]).forEach((id) => {
      const def = BUILDING_DEFS[id];
      const current = { ...state.buildings[id] };
      const cap = buildingCapacity(def, current);
      const workers = Math.min(current.assigned, cap);
      const intensity = def.hasIntensitySlider ? current.slider / 100 : 1;
      let status: BuildingStatus = 'idle';

      if (cap <= 0) {
        status = 'idle';
      } else if (workers < 1 || intensity <= 0) {
        status = 'no-workers';
      } else {
        const inputRates = def.inputsPerWorkerPerMinute ?? {};
        const outputRates = def.outputsPerWorkerPerMinute;
        const maintenancePerMinute = (def.maintenancePerMinutePerWorker ?? 0) * workers * intensity;
        const maintenancePerSecond = maintenancePerMinute / 60;
        const requiredInputs: Partial<Record<ResourceId, number>> = {};
        let canRun = true;
        let block: BuildingStatus = 'running';

        for (const [key, value] of Object.entries(inputRates)) {
          const perSecond = ((value ?? 0) * workers * intensity) / 60;
          if (perSecond > 0) {
            requiredInputs[key as ResourceId] = perSecond;
            if ((resources[key as ResourceId] ?? 0) < perSecond - 1e-6) {
              canRun = false;
              block = 'no-input';
              break;
            }
          }
        }

        if (canRun && maintenancePerSecond > 0 && gold < maintenancePerSecond - 1e-6) {
          canRun = false;
          block = 'no-coins';
        }

        if (canRun) {
          for (const [key, cost] of Object.entries(requiredInputs)) {
            resources[key as ResourceId] = Math.max(0, (resources[key as ResourceId] ?? 0) - (cost ?? 0));
          }
          if (maintenancePerSecond > 0) {
            gold = Math.max(0, gold - maintenancePerSecond);
          }

          for (const [key, value] of Object.entries(outputRates)) {
            const perSecond = ((value ?? 0) * workers * intensity) / 60;
            resources[key as ResourceId] = (resources[key as ResourceId] ?? 0) + perSecond;
          }
          status = 'running';
        } else {
          status = block;
        }
      }

      buildings[id] = { ...current, status, assigned: workers };
    });

    (Object.keys(TRADE_DEFS) as TradeGoodId[]).forEach((tradeId) => {
      const tradeDef = TRADE_DEFS[tradeId];
      const tradeState = state.trade[tradeId];
      if (!tradeState) return;
      if (tradeState.mode === 'balance' || tradeState.targetPerMinute <= 0) return;

      const perSecond = tradeState.targetPerMinute / 60;
      if (tradeState.mode === 'export') {
        const available = resources[tradeDef.resource] ?? 0;
        const amount = Math.min(perSecond, available);
        if (amount > 0) {
          resources[tradeDef.resource] = available - amount;
          gold += amount * tradeDef.price;
        }
      } else if (tradeState.mode === 'import') {
        const affordable = tradeDef.price > 0 ? gold / tradeDef.price : 0;
        const amount = Math.min(perSecond, affordable);
        if (amount > 0) {
          gold = Math.max(0, gold - amount * tradeDef.price);
          resources[tradeDef.resource] = (resources[tradeDef.resource] ?? 0) + amount;
        }
      }
    });

    set({
      season,
      seasonStart,
      gold,
      resources,
      buildings,
    });
  },

  buildBuilding: (id) => {
    set((state) => {
      const current = { ...state.buildings[id] };
      current.built += 1;
      current.active = Math.min(current.built, current.active + 1);
      return { buildings: { ...state.buildings, [id]: current } };
    });
  },

  demolishBuilding: (id) => {
    set((state) => {
      const def = BUILDING_DEFS[id];
      const current = { ...state.buildings[id] };
      if (current.built <= 0) return {};
      current.built = Math.max(0, current.built - 1);
      current.active = Math.min(current.active, current.built);
      const capacity = buildingCapacity(def, current);
      current.assigned = Math.min(current.assigned, capacity);
      return { buildings: { ...state.buildings, [id]: current } };
    });
  },

  assignWorkers: (id, delta) => {
    const state = get();
    const def = BUILDING_DEFS[id];
    const current = { ...state.buildings[id] };
    const others = sumAssignedWorkers(state, id);
    const globalLimit = Math.max(0, state.workerCapacity - state.otherAssignedWorkers - others);
    const capacity = buildingCapacity(def, current);
    const maxForBuilding = Math.min(capacity, globalLimit + current.assigned);
    const next = Math.max(0, Math.min(maxForBuilding, current.assigned + delta));
    current.assigned = next;
    set({ buildings: { ...state.buildings, [id]: current } });
  },

  setBuildingSlider: (id, value) => {
    set((state) => {
      const current = { ...state.buildings[id] };
      current.slider = Math.max(0, Math.min(100, Math.round(value)));
      return { buildings: { ...state.buildings, [id]: current } };
    });
  },

  setTradeMode: (id, mode) => {
    set((state) => ({
      trade: { ...state.trade, [id]: { ...state.trade[id], mode } },
    }));
  },

  setTradeRate: (id, value) => {
    set((state) => ({
      trade: {
        ...state.trade,
        [id]: {
          ...state.trade[id],
          targetPerMinute: Math.max(0, Math.min(200, Math.round(value))),
        },
      },
    }));
  },
}));

export function getBuildingDefinition(id: BuildingId): BuildingDefinition {
  return BUILDING_DEFS[id];
}

export function getTradeDefinition(id: TradeGoodId): TradeDefinition {
  return TRADE_DEFS[id];
}

export function getTotalAssignedWorkers(state: GameState): number {
  return state.otherAssignedWorkers + sumAssignedWorkers(state);
}

export function getAvailableWorkers(state: GameState): number {
  return Math.max(0, state.workerCapacity - getTotalAssignedWorkers(state));
}

