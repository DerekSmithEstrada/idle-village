import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItemId } from '../data/items';
import { ITEMS, ITEM_ORDER } from '../data/items';
import type { BuildingId } from '../data/buildings';
import { BUILDINGS } from '../data/buildings';

type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

export interface BuildingState {
  id: BuildingId;
  count: number;
  employees: number;
  progress: number; // segundos acumulados hacia recipe.duration
}

type Inventory = Record<ItemId, number>;
type MaxByItem = Record<ItemId, number>;

interface GameState {
  // tiempo/estación
  season: Season;
  seasonStart: number;       // Date.now() del inicio de la estación
  seasonDurationMs: number;  // 2 min por estación

  // economía
  villagers: number;
  gold: number;
  goldMax: number;

  // inventario y capacidad
  inventory: Inventory;
  maxByItem: MaxByItem;

  // edificios
  buildings: Record<BuildingId, BuildingState>;

  // acciones
  tick: () => void;                         // llamado 1 vez por segundo
  addVillager: () => void;                  // 1 cada 60s (o como quieras)
  canAfford: (id: BuildingId) => boolean;
  build: (id: BuildingId) => void;
  assign: (id: BuildingId, delta: number) => void;
  addItem: (id: ItemId, qty: number) => void;
}

function makeInitialInventory(): Inventory {
  const inv = {} as Inventory;
  for (const id of ITEM_ORDER) inv[id] = 0;
  // oro inicial (tu requisito era comenzar con 20 gold)
  inv.gold = 0; // usamos `gold` separado abajo; en inv lo dejamos en 0 por prolijidad
  return inv;
}

function makeInitialMax(): MaxByItem {
  const max: MaxByItem = {} as any;
  for (const id of ITEM_ORDER) {
    max[id] = ITEMS[id].baseMax ?? 0;
  }
  return max;
}

function makeInitialBuildings(): Record<BuildingId, BuildingState> {
  const bs = {} as Record<BuildingId, BuildingState>;
  (Object.keys(BUILDINGS) as BuildingId[]).forEach((id) => {
    bs[id] = { id, count: 0, employees: 0, progress: 0 };
  });
  return bs;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      // estado inicial
      season: 'Spring',
      seasonStart: Date.now(),
      seasonDurationMs: 2 * 60 * 1000, // 2 minutos por estación

      villagers: 0,
      gold: 20,        // arranque con 20 gold
      goldMax: 500,    // default (como pediste)

      inventory: makeInitialInventory(),
      maxByItem: makeInitialMax(),
      buildings: makeInitialBuildings(),

      // Helpers internos
      // consumir inputs si hay stock suficiente
      // devuelve true si alcanza para todo
      // Nota: trabajamos contra una copia local (mutaremos fuera)
      // para poder “chequear” primero antes de debitar realmente.
      // Al producir, capear por maxByItem.
      tick: () => {
        const s = get();
        const now = Date.now();

        // avanzar estación
        const elapsed = now - s.seasonStart;
        if (elapsed >= s.seasonDurationMs) {
          const order: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
          const next = order[(order.indexOf(s.season) + 1) % 4];
          set({ season: next, seasonStart: now });
        }

        // ingreso de oro por villagers (0.01 oro/seg por aldeano)
        const nextGold = Math.min(s.gold + s.villagers * 0.01, s.goldMax);

        // procesar producción/consumo por edificios
        const bs = { ...s.buildings };
        const inv: Inventory = { ...s.inventory };
        const caps: MaxByItem = { ...s.maxByItem };

        const tryConsume = (need?: Partial<Record<ItemId, number>>) => {
          if (!need) return true;
          for (const [id, qty] of Object.entries(need)) {
            const v = inv[id as ItemId] || 0;
            if (v < (qty || 0)) return false;
          }
          return true;
        };
        const doConsume = (need?: Partial<Record<ItemId, number>>) => {
          if (!need) return;
          for (const [id, qty] of Object.entries(need)) {
            const key = id as ItemId;
            inv[key] = Math.max(0, (inv[key] || 0) - (qty || 0));
          }
        };
        const doProduce = (out: Partial<Record<ItemId, number>>) => {
          for (const [id, qty] of Object.entries(out)) {
            const key = id as ItemId;
            const cap = caps[key] || 0;
            const cur = inv[key] || 0;
            const add = qty || 0;
            inv[key] = Math.min(cap, cur + add);
          }
        };

        (Object.keys(bs) as BuildingId[]).forEach((bid) => {
          const def = BUILDINGS[bid];
          const b = bs[bid];
          if (!def.recipe || b.count <= 0) return;
          // requiere aldeanos?
          if (def.recipe.requiresVillager && b.employees <= 0) return;

          // progresar 1s por tick
          b.progress += 1;

          if (b.progress >= def.recipe.duration) {
            b.progress = 0;

            // Gatherers no requieren insumos
            if (def.recipe.gatherer) {
              doProduce(def.recipe.out);
              return;
            }

            // Edificios con insumos: chequear y consumir
            if (!def.recipe.in || tryConsume(def.recipe.in)) {
              if (def.recipe.in) doConsume(def.recipe.in);
              doProduce(def.recipe.out);
            }
          }
        });

        set({ buildings: bs, inventory: inv, maxByItem: caps, gold: nextGold });
      },

      addVillager: () => set((s) => ({ ...s, villagers: s.villagers + 1 })),

      canAfford: (id) => {
        const state = get();
        const def = BUILDINGS[id];
        if (!def?.cost) return true;
        for (const [iid, qty] of Object.entries(def.cost)) {
          if (iid === 'gold') {
            if (state.gold < (qty || 0)) return false;
          } else {
            const cur = state.inventory[iid as ItemId] || 0;
            if (cur < (qty || 0)) return false;
          }
        }
        return true;
      },

      build: (id) => {
        const state = get();
        const def = BUILDINGS[id];
        if (!def) return;
        if (!state.canAfford(id)) return;

        // debitar
        const inv: Inventory = { ...state.inventory };
        let gold = state.gold;
        if (def.cost) {
          for (const [iid, qty] of Object.entries(def.cost)) {
            if (iid === 'gold') gold = Math.max(0, gold - (qty || 0));
            else inv[iid as ItemId] = Math.max(0, (inv[iid as ItemId] || 0) - (qty || 0));
          }
        }

        // sumar edificio
        const bs = { ...state.buildings };
        const b = bs[id] || { id, count: 0, employees: 0, progress: 0 };
        b.count += 1;

        // aplicar bonus de capacidad (warehouse/granary, etc.)
        const caps = { ...state.maxByItem };
        if (def.capacityBonus) {
          const amountAll = def.capacityBonus.all || 0;
          if (amountAll) {
            (ITEM_ORDER as ItemId[]).forEach((iid) => (caps[iid] = (caps[iid] || 0) + amountAll));
          }
          if (def.capacityBonus.byCategory) {
            const byCat = def.capacityBonus.byCategory;
            (ITEM_ORDER as ItemId[]).forEach((iid) => {
              const cat = ITEMS[iid].cat;
              const add = byCat[cat as keyof typeof byCat] || 0;
              if (add) caps[iid] = (caps[iid] || 0) + add;
            });
          }
        }
        let goldMax = state.goldMax;
        if (def.goldCapBonus) {
          goldMax += def.goldCapBonus;
        }

        bs[id] = b;
        set({ buildings: bs, inventory: inv, maxByItem: caps, gold, goldMax });
      },

      assign: (id, delta) => {
        const bs = { ...get().buildings };
        const b = bs[id];
        if (!b) return;
        b.employees = Math.max(0, b.employees + delta);
        set({ buildings: bs });
      },

      addItem: (id, qty) => {
        const s = get();
        if (id === 'gold') {
          set({ gold: Math.min(s.goldMax, s.gold + qty) });
        } else {
          const inv = { ...s.inventory };
          inv[id] = Math.min(s.maxByItem[id] || 0, (inv[id] || 0) + qty);
          set({ inventory: inv });
        }
      },
    }),
    { name: 'idle-village-save' }
  )
);
