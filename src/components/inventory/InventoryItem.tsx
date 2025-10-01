type Props = {
  iconSrc: string;
  label: string;
  perMinute: number;
  quantity: number;
  capacity: number;
};

function formatPerMinute(v: number) {
  return `${(Math.abs(v)).toFixed(1)}/m`;
}

function InventoryItem({
  iconSrc,
  label,
  perMinute,
  quantity,
  capacity,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={iconSrc}
        alt={label}
        className="w-6 h-6 object-contain select-none pointer-events-none"
      />
      <div className="flex flex-col leading-tight">
        <div className="text-sm text-gray-800">{formatPerMinute(perMinute)}</div>
        <div className="text-xs text-gray-500">
          {Math.floor(quantity)} / {capacity}
        </div>
      </div>
    </div>
  );
}

export default InventoryItem;
