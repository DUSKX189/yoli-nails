"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  max: number;
  disabled?: boolean;
};

export default function QuantitySelector({
  value,
  onChange,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  const set = (next: number) => onChange(Math.min(Math.max(next, 1), Math.max(max, 1)));

  return (
    <div
      role="group"
      aria-label="Cantidad"
      className={`flex h-[52px] shrink-0 items-center rounded-full border border-ink/20 font-body ${
        disabled ? "opacity-40" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Quitar una unidad"
        className="flex h-full w-12 items-center justify-center rounded-l-full text-xl hover:text-wine disabled:cursor-not-allowed disabled:hover:text-current"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10);
          if (!Number.isNaN(next)) set(next);
        }}
        aria-label="Cantidad"
        className="w-10 bg-transparent text-center text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Añadir una unidad"
        className="flex h-full w-12 items-center justify-center rounded-r-full text-xl hover:text-wine disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-current"
      >
        +
      </button>
    </div>
  );
}
