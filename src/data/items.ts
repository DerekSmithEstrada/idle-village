
export type ItemId =
  | 'gold'
  | 'sticks' | 'logs' | 'planks'
  | 'stone' | 'polished_stone'
  | 'silex' | 'tools' | 'weapons'
  | 'berries' | 'fish'
  | 'wheat' | 'flour' | 'bread'
  | 'hops' | 'beer'
  | 'grapes' | 'wine'
  | 'milk' | 'cheese' | 'meals'
  | 'boar' | 'meat'
  | 'wool' | 'cloth' | 'common_clothes'
  | 'iron_ore' | 'coal' | 'iron'
  | 'quartz' | 'glass'
  | 'gold_ore' | 'gold_bars' | 'gems' | 'jewellery'
  | 'barrels' | 'common_wares'
  | 'honey' | 'wax' | 'herbs'
;

export type ItemCategory =
  | 'currency' | 'wood' | 'stone' | 'tools' | 'food' | 'luxury' | 'metal';

export interface ItemDef {
  id: ItemId;
  name: string;
  cat: ItemCategory;
  stackable?: boolean;
  baseMax?: number;
}

export const ITEMS: Record<ItemId, ItemDef> = {
  gold: { id:'gold', name:'Gold', cat:'currency', stackable:true, baseMax: 500 },

  sticks:{ id:'sticks', name:'Sticks', cat:'wood', stackable:true },
  logs:{ id:'logs', name:'Logs', cat:'wood', stackable:true },
  planks:{ id:'planks', name:'Planks', cat:'wood', stackable:true },

  stone:{ id:'stone', name:'Stone', cat:'stone', stackable:true },
  polished_stone:{ id:'polished_stone', name:'Polished Stone', cat:'stone', stackable:true },

  silex:{ id:'silex', name:'Silex', cat:'tools', stackable:true },
  tools:{ id:'tools', name:'Tools', cat:'tools', stackable:true },
  weapons:{ id:'weapons', name:'Swords', cat:'tools', stackable:true },

  berries:{ id:'berries', name:'Berries', cat:'food', stackable:true },
  fish:{ id:'fish', name:'Fish', cat:'food', stackable:true },

  wheat:{ id:'wheat', name:'Wheat', cat:'food', stackable:true },
  flour:{ id:'flour', name:'Flour', cat:'food', stackable:true },
  bread:{ id:'bread', name:'Bread', cat:'food', stackable:true },

  hops:{ id:'hops', name:'Hops', cat:'food', stackable:true },
  beer:{ id:'beer', name:'Beer', cat:'luxury', stackable:true },

  grapes:{ id:'grapes', name:'Grapes', cat:'food', stackable:true },
  wine:{ id:'wine', name:'Wine', cat:'luxury', stackable:true },

  milk:{ id:'milk', name:'Milk', cat:'food', stackable:true },
  cheese:{ id:'cheese', name:'Cheese', cat:'food', stackable:true },
  meals:{ id:'meals', name:'Meals', cat:'luxury', stackable:true },

  boar:{ id:'boar', name:'Boar', cat:'food', stackable:true },
  meat:{ id:'meat', name:'Meat', cat:'food', stackable:true },

  wool:{ id:'wool', name:'Wool', cat:'luxury', stackable:true },
  cloth:{ id:'cloth', name:'Cloth', cat:'luxury', stackable:true },
  common_clothes:{ id:'common_clothes', name:'Common Clothes', cat:'luxury', stackable:true },

  iron_ore:{ id:'iron_ore', name:'Iron Ore', cat:'metal', stackable:true },
  coal:{ id:'coal', name:'Coal', cat:'metal', stackable:true },
  iron:{ id:'iron', name:'Iron', cat:'metal', stackable:true },

  quartz:{ id:'quartz', name:'Quartz', cat:'metal', stackable:true },
  glass:{ id:'glass', name:'Glass', cat:'metal', stackable:true },

  gold_ore:{ id:'gold_ore', name:'Gold Ore', cat:'metal', stackable:true },
  gold_bars:{ id:'gold_bars', name:'Gold Bars', cat:'metal', stackable:true },
  gems:{ id:'gems', name:'Gems', cat:'luxury', stackable:true },
  jewellery:{ id:'jewellery', name:'Jewellery', cat:'luxury', stackable:true },

  barrels:{ id:'barrels', name:'Barrels', cat:'luxury', stackable:true },
  common_wares:{ id:'common_wares', name:'Common Wares', cat:'luxury', stackable:true },

  honey:{ id:'honey', name:'Honey', cat:'luxury', stackable:true },
  wax:{ id:'wax', name:'Wax', cat:'luxury', stackable:true },
  herbs:{ id:'herbs', name:'Herbs', cat:'luxury', stackable:true },
};

export const ITEM_ORDER: ItemId[] = [
  'gold',
  'sticks','logs','planks',
  'stone','polished_stone',
  'silex','tools','weapons',
  'berries','fish','wheat','flour','bread',
  'hops','beer',
  'grapes','wine',
  'milk','cheese','meals',
  'boar','meat',
  'wool','cloth','common_clothes',
  'iron_ore','coal','iron',
  'quartz','glass',
  'gold_ore','gold_bars','gems','jewellery',
  'barrels','common_wares',
  'honey','wax','herbs'
];
