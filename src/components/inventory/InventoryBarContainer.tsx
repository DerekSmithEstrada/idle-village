import React from "react";
import InventoryBar, { InventoryRecord } from "./InventoryBar";
import { useGame } from "../../store/gameStore";
import { ITEM_ORDER, ITEMS } from "../../data/items";

export default function InventoryBarContainer() {
  const state = useGame();

  const items: InventoryRecord[] = ITEM_ORDER.map((id) => {
    const qty = state.inventory[id] ?? 0;
    const cap = state.maxByItem[id] ?? 0;
    return {
      id,
      label: ITEMS[id].name,
      quantity: Math.floor(qty),
      capacity: cap,
      perMinute: 0, // si tenés un cálculo real, reemplazalo acá
    };
  });

  // Orden: primero lo que más se mueve (cuando tengas perMinute real)
  items.sort((a, b) => Math.abs(b.perMinute) - Math.abs(a.perMinute));

  return <InventoryBar items={items} />;
}
