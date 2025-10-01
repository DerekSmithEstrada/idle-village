import React from "react";
import InventoryItem from "./InventoryItem";

const ICONS: Record<string, string> = {
  sticks: "/assets/icons/sticks.png",
  logs: "/assets/icons/logs.png",
  planks: "/assets/icons/planks.png",
  bread: "/assets/icons/bread.png",
  berries: "/assets/icons/berries.png",
  default: "/assets/icons/default.png",
};

export type InventoryRecord = {
  id: string;
  label: string;
  perMinute: number;
  quantity: number;
  capacity: number;
};

type Props = {
  items: InventoryRecord[];
};

export default function InventoryBar({ items }: Props) {
  if (!items?.length) return null;
  return (
    <div className="w-full flex flex-wrap gap-8 items-center py-2">
      {items.map((it) => (
        <InventoryItem
          key={it.id}
          iconSrc={ICONS[it.id] ?? ICONS.default}
          label={it.label}
          perMinute={it.perMinute}
          quantity={it.quantity}
          capacity={it.capacity}
        />
      ))}
    </div>
  );
}
