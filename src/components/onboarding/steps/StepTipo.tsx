import { cn } from "@/lib/utils";
import type { StepProps, TipoDonacion } from "../types";

const TIPOS: { value: TipoDonacion; emoji: string; label: string; desc: string }[] = [
  { value: "plata", emoji: "💰", label: "Plata", desc: "Donaciones en efectivo o Mercado Pago" },
  { value: "especie", emoji: "📦", label: "Especie", desc: "Ropa, alimentos, materiales" },
  { value: "voluntariado", emoji: "🤝", label: "Voluntariado", desc: "Tu tiempo y talento" },
];

export function StepTipo({ data, onUpdate, onNext }: StepProps) {
  function toggle(tipo: TipoDonacion) {
    const ya = data.objetivo_tipos.includes(tipo);
    onUpdate({
      objetivo_tipos: ya
        ? data.objetivo_tipos.filter((t) => t !== tipo)
        : [...data.objetivo_tipos, tipo],
    });
  }

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {TIPOS.map(({ value, emoji, label, desc }) => {
        const activo = data.objetivo_tipos.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={cn(
              "w-full flex items-center gap-[20px] px-[21.5px] py-[21.5px] rounded-[16px] border-[1.5px] transition-colors text-left",
              activo
                ? "bg-[#510d09] border-[#510d09]"
                : "bg-white border-[rgba(81,13,9,0.12)] hover:border-[rgba(81,13,9,0.35)]"
            )}
          >
            {/* Emoji */}
            <span className="text-[28.8px] leading-none shrink-0">{emoji}</span>

            {/* Texto */}
            <div className="flex-1 min-w-0">
              <p className={cn("text-[14px] font-semibold leading-[20px]", activo ? "text-[#febd30]" : "text-[#510d09]")}>
                {label}
              </p>
              <p className={cn("text-[12px] font-medium leading-[16px] mt-[2px]", activo ? "text-[rgba(254,189,48,0.72)]" : "text-[rgba(81,13,9,0.48)]")}>
                {desc}
              </p>
            </div>

            {/* Checkbox circle */}
            <div
              className={cn(
                "shrink-0 size-[24px] rounded-full border-2 flex items-center justify-center transition-colors",
                activo
                  ? "bg-[#febd30] border-[#febd30]"
                  : "border-[rgba(81,13,9,0.22)]"
              )}
            >
              {activo && (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2.5 6.5L5.5 9.5L10.5 4" stroke="#510d09" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onNext}
        disabled={data.objetivo_tipos.length === 0}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors mt-[4px]"
      >
        Continuar
      </button>
    </div>
  );
}
