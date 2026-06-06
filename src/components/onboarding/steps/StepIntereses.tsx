import { cn } from "@/lib/utils";
import type { StepProps } from "../types";

const CATEGORIAS = [
  { label: "Salud", emoji: "🏥" },
  { label: "Educación", emoji: "📚" },
  { label: "Infancia", emoji: "🧒" },
  { label: "Derechos humanos", emoji: "✊" },
  { label: "Alimentación", emoji: "🌽" },
  { label: "Medio ambiente", emoji: "🌿" },
];

export function StepIntereses({ data, onUpdate, onNext }: StepProps) {
  function toggle(label: string) {
    const ya = data.intereses.includes(label);
    onUpdate({
      intereses: ya
        ? data.intereses.filter((i) => i !== label)
        : [...data.intereses, label],
    });
  }

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {/* Grid 3×2 de tarjetas con emoji */}
      <div className="grid grid-cols-3 gap-[12px]">
        {CATEGORIAS.map(({ label, emoji }) => {
          const activo = data.intereses.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={cn(
                "flex flex-col items-center justify-center gap-[10px] rounded-[16px] border-[1.5px] py-[25.5px] px-[1.5px] transition-colors",
                activo
                  ? "bg-[#510d09] border-[#510d09]"
                  : "bg-white border-[rgba(81,13,9,0.12)] hover:border-[rgba(81,13,9,0.35)]"
              )}
            >
              <span className="text-[32px] leading-none">{emoji}</span>
              <span
                className={cn(
                  "text-[14px] font-medium text-center leading-[17.5px]",
                  activo ? "text-[#febd30]" : "text-[#510d09]"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={data.intereses.length === 0}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors mt-[4px]"
      >
        Continuar
      </button>
    </div>
  );
}
