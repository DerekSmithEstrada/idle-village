import type { ItemId } from './items';

export type BuildingId =
  | 'gathering_tent'
  | 'woodcutter_camp'
  | 'stick_gatherer'
  | 'stone_quarry'
  | 'tool_tent'
  | 'wheat_farm'
  | 'windmill'
  | 'bakery'
  | 'sheep_farm'
  | 'weaver_hut'
  | 'fishing_hut'
  | 'hop_farm'
  | 'brewery'
  | 'grape_vineyard'
  | 'winery'
  | 'smelter'
  | 'warehouse'
  | 'granary'
  | 'tailor_workshop'
  | 'dairy_farm'
  | 'common_wares_workshop'
  | 'cheesemaker'
  | 'hunters_hut'
  | 'butchery'
  | 'stonemason_hut'
  | 'herb_garden'
  | 'iron_mine'
  | 'coal_hut'
  | 'iron_smelter'
  | 'blacksmith'
  | 'weaponsmith'
  | 'cooperage'
  | 'quartz_quarry'
  | 'glass_smelter'
  | 'gold_quarry'
  | 'gold_smelter'
  | 'jeweler'
  | 'cooper_tavern_kitchen'
  | 'apiary'
;

export interface Recipe {
  in?: Partial<Record<ItemId, number>>;
  out: Partial<Record<ItemId, number>>;
  duration: number;
  requiresVillager?: boolean;
  gatherer?: boolean;
}

export interface BuildingDef {
  id: BuildingId;
  name: string;
  cost: Partial<Record<ItemId, number>>;
  recipe?: Recipe;
  capacityBonus?: {
    all?: number;
    byCategory?: Partial<Record<'wood'|'stone'|'tools'|'food'|'metal'|'luxury'|'currency', number>>;
  };
  goldCapBonus?: number;
  employees?: number;
}

export const BUILDINGS: Record<BuildingId, BuildingDef> = {
  gathering_tent: {
    id:'gathering_tent',
    name:'Gathering Tent',
    cost:{ logs:5 },
    recipe:{ out:{ berries:2 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  woodcutter_camp: {
    id:'woodcutter_camp',
    name:'Woodcutter Camp',
    cost:{ logs:8, stone:3 },
    recipe:{ in:{ logs:2 }, out:{ planks:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  stick_gatherer:{
    id:'stick_gatherer',
    name:'Stick Gathering',
    cost:{ gold:20 },
    recipe:{ out:{ sticks:2 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:1
  },
  stone_quarry:{
    id:'stone_quarry',
    name:'Small Stone Quarry',
    cost:{ logs:6 },
    recipe:{ out:{ stone:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  tool_tent:{
    id:'tool_tent',
    name:'Tool Assembly Tent',
    cost:{ planks:6, stone:4 },
    recipe:{ in:{ planks:2, stone:1 }, out:{ tools:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  wheat_farm:{
    id:'wheat_farm',
    name:'Wheat Farm',
    cost:{ logs:10, planks:6, stone:4 },
    recipe:{ out:{ wheat:1 }, duration: 1, requiresVillager:true },
    employees:3
  },
  windmill:{
    id:'windmill',
    name:'Windmill',
    cost:{ planks:8, stone:6 },
    recipe:{ in:{ wheat:2 }, out:{ flour:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  bakery:{
    id:'bakery',
    name:'Bakery',
    cost:{ planks:6, stone:6 },
    recipe:{ in:{ flour:2, logs:1 }, out:{ bread:2 }, duration: 1, requiresVillager:true },
    employees:2
  },
  fishing_hut:{
    id:'fishing_hut',
    name:'Fishing Hut',
    cost:{ logs:6, planks:4 },
    recipe:{ out:{ fish:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  hop_farm:{
    id:'hop_farm',
    name:'Hop Farm',
    cost:{ logs:8, planks:6 },
    recipe:{ out:{ hops:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  brewery:{
    id:'brewery',
    name:'Brewery',
    cost:{ planks:10, stone:6 },
    recipe:{ in:{ hops:2, logs:1 }, out:{ beer:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  grape_vineyard:{
    id:'grape_vineyard',
    name:'Vineyard',
    cost:{ logs:8, planks:8 },
    recipe:{ out:{ grapes:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  winery:{
    id:'winery',
    name:'Winery',
    cost:{ planks:10, stone:6 },
    recipe:{ in:{ grapes:2 }, out:{ wine:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  smelter:{
    id:'smelter',
    name:'Smelter',
    cost:{ stone:12, planks:8 },
    recipe:{ in:{ iron_ore:2, coal:1 }, out:{ iron:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  warehouse:{
    id:'warehouse',
    name:'Warehouse',
    cost:{ planks:10, stone:8 },
    capacityBonus:{ byCategory: { wood:50, stone:50, tools:50, metal:50, luxury:50 } },
    goldCapBonus: 250,
    employees:0
  },
  granary:{
    id:'granary',
    name:'Granary',
    cost:{ planks:8, logs:6 },
    capacityBonus:{ byCategory: { food:50 } },
    employees:0
  },

  sheep_farm:{
    id:'sheep_farm',
    name:'Sheep Farm',
    cost:{ logs:6, planks:4 },
    recipe:{ out:{ wool:2 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  
  weaver_hut:{
    id:'weaver_hut',
    name:'Weaver Hut',
    cost:{ planks:6, stone:4 },
    recipe:{ in:{ wool:2 }, out:{ cloth:1 }, duration: 1, requiresVillager:true },
    employees:2
  },

  tailor_workshop:{
    id:'tailor_workshop',
    name:'Tailor’s Workshop',
    cost:{ planks:8, stone:4 },
    recipe:{ in:{ cloth:1 }, out:{ common_clothes:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  dairy_farm:{
    id:'dairy_farm',
    name:'Dairy Farm',
    cost:{ logs:6, planks:4 },
    recipe:{ out:{ milk:2 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  cheesemaker:{
    id:'cheesemaker',
    name:'Cheesemaker',
    cost:{ planks:6, stone:4 },
    recipe:{ in:{ milk:5 }, out:{ cheese:2 }, duration: 1, requiresVillager:true },
    employees:2
  },
  hunters_hut:{
    id:'hunters_hut',
    name:'Hunter’s Hut',
    cost:{ logs:6, planks:4 },
    recipe:{ out:{ boar:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  butchery:{
    id:'butchery',
    name:'Butchery',
    cost:{ planks:6, stone:6 },
    recipe:{ in:{ boar:1 }, out:{ meat:4 }, duration: 1, requiresVillager:true },
    employees:2
  },
  stonemason_hut:{
    id:'stonemason_hut',
    name:'Stonemason Hut',
    cost:{ planks:6, stone:6 },
    recipe:{ in:{ stone:2 }, out:{ polished_stone:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  coal_hut:{
    id:'coal_hut',
    name:'Coal Hut',
    cost:{ logs:6, planks:4 },
    recipe:{ in:{ logs:2 }, out:{ coal:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  iron_mine:{
    id:'iron_mine',
    name:'Iron Mine',
    cost:{ planks:8, stone:8 },
    recipe:{ out:{ iron_ore:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  iron_smelter:{
    id:'iron_smelter',
    name:'Iron Smelter',
    cost:{ planks:8, stone:8 },
    recipe:{ in:{ iron_ore:2, coal:1 }, out:{ iron:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  blacksmith:{
    id:'blacksmith',
    name:'Blacksmith',
    cost:{ planks:8, stone:8 },
    recipe:{ in:{ iron:1, coal:1 }, out:{ tools:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  weaponsmith:{
    id:'weaponsmith',
    name:'Weaponsmith',
    cost:{ planks:10, stone:10 },
    recipe:{ in:{ iron:1, coal:1, tools:1 }, out:{ weapons:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  cooperage:{
    id:'cooperage',
    name:'Cooperage',
    cost:{ planks:10, stone:6 },
    recipe:{ in:{ planks:4, iron:1, tools:1 }, out:{ barrels:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  quartz_quarry:{
    id:'quartz_quarry',
    name:'Quartz Quarry',
    cost:{ planks:8, stone:8 },
    recipe:{ out:{ quartz:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  glass_smelter:{
    id:'glass_smelter',
    name:'Glass Smelter',
    cost:{ planks:10, stone:10 },
    recipe:{ in:{ quartz:1, coal:1 }, out:{ glass:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  gold_quarry:{
    id:'gold_quarry',
    name:'Gold Quarry',
    cost:{ planks:10, stone:10 },
    recipe:{ out:{ gold_ore:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  gold_smelter:{
    id:'gold_smelter',
    name:'Gold Smelter',
    cost:{ planks:12, stone:12 },
    recipe:{ in:{ gold_ore:1, coal:1 }, out:{ gold_bars:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  jeweler:{
    id:'jeweler',
    name:'Jeweler’s Workshop',
    cost:{ planks:10, stone:10 },
    recipe:{ in:{ gold_bars:1, gems:1 }, out:{ jewellery:1 }, duration: 1, requiresVillager:true },
    employees:2
  },
  cooper_tavern_kitchen:{
    id:'cooper_tavern_kitchen',
    name:'Tavern Kitchen',
    cost:{ planks:8, stone:6 },
    recipe:{ in:{ cheese:1, boar:1 }, out:{ meals:2 }, duration: 1, requiresVillager:true },
    employees:2
  },
  apiary:{
    id:'apiary',
    name:'Apiary',
    cost:{ logs:4, planks:4 },
    recipe:{ out:{ honey:1, wax:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  herb_garden:{
    id:'herb_garden',
    name:'Herb Garden',
    cost:{ logs:4, planks:4 },
    recipe:{ out:{ herbs:1 }, duration: 1, gatherer:true, requiresVillager:true },
    employees:2
  },
  common_wares_workshop:{
    id:'common_wares_workshop',
    name:'Common Wares Workshop',
    cost:{ planks:10, stone:8 },
    recipe:{ in:{ tools:1, planks:1, iron:1 }, out:{ common_wares:1 }, duration: 1, requiresVillager:true },
    employees:2
  }

};