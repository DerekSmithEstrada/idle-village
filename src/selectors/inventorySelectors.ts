import type { BuildingId, GameState } from '../store/gameStore';
import { BUILDINGS, getAvailableWorkers, getBuildingDefinition, getTotalAssignedWorkers } from '../store/gameStore';

export interface TopBarSummary {
  happiness: number;
  villagers: number;
  villagersCap: number;
  gold: number;
  logs: number;
  stone: number;
  planks: number;
  wheat: number;
  tools: number;
}

export function selectTopBarSummary(state: GameState): TopBarSummary {
  return {
    happiness: state.happiness,
    villagers: state.villagers,
    villagersCap: state.villagersCap,
    gold: state.gold,
    logs: state.resources.logs ?? 0,
    stone: state.resources.stone ?? 0,
    planks: state.resources.planks ?? 0,
    wheat: state.resources.wheat ?? 0,
    tools: state.resources.tools ?? 0,
  };
}

export function selectWorkerSummary(state: GameState): { assigned: number; capacity: number; available: number } {
  const assigned = getTotalAssignedWorkers(state);
  return {
    assigned,
    capacity: state.workerCapacity,
    available: getAvailableWorkers(state),
  };
}

export function selectBuildingState(id: BuildingId) {
  return (state: GameState) => state.buildings[id];
}

export function selectBuildingCapacity(id: BuildingId) {
  const def = getBuildingDefinition(id);
  return (state: GameState) => {
    const building = state.buildings[id];
    const active = Math.min(building.active, building.built);
    return active * def.workerCapacity;
  };
}

export function selectCropsAlert(state: GameState): boolean {
  const wheat = state.buildings.wheatFarm;
  return wheat.status === 'no-workers' || wheat.status === 'no-input';
}

export const BUILDING_LIST = Object.keys(BUILDINGS) as BuildingId[];
