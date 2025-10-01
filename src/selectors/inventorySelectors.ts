// Tipos ilustrativos, ajustá a tu modelo real:
export type Building = {
  activeWorkers: number;
  productionPerSecond?: Record<string, number>;  // { itemId: ratePerSecondPorTrabajador? o total? }
  consumptionPerSecond?: Record<string, number>;
};

export type GameState = {
  inventory: Record<
    string,
    { quantity: number; capacity: number; label: string }
  >;
  buildings: Building[];
};

// Si tus tasas son por edificio total, NO multipliques por workers.
// Si son por trabajador, multiplicá por activeWorkers como abajo.
export function computePerMinuteByItem(state: GameState): Record<string, number> {
  const accum: Record<string, number> = {};

  for (const b of state.buildings) {
    const factor = Math.max(0, b.activeWorkers || 0);
    if (b.productionPerSecond) {
      for (const [itemId, rate] of Object.entries(b.productionPerSecond)) {
        const add = rate * factor; // quitalo si ya es por edificio
        accum[itemId] = (accum[itemId] || 0) + add;
      }
    }
    if (b.consumptionPerSecond) {
      for (const [itemId, rate] of Object.entries(b.consumptionPerSecond)) {
        const sub = rate * factor; // quitalo si ya es por edificio
        accum[itemId] = (accum[itemId] || 0) - sub;
      }
    }
  }

  // pasar a por minuto
  for (const key of Object.keys(accum)) {
    accum[key] = accum[key] * 60;
  }
  return accum;
}
