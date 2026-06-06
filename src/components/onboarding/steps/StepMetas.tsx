import type { StepProps } from "../types";

const META_CONFIG = {
  plata: { label: "Donar en plata", prefix: "$", suffix: null, field: "meta_plata" as const },
  especie: { label: "Donaciones en especie", prefix: null, suffix: "veces", field: "meta_especie" as const },
  voluntariado: { label: "Voluntariados", prefix: null, suffix: "veces", field: "meta_voluntariado" as const },
};

interface StepMetasProps extends StepProps {
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export function StepMetas({ data, onUpdate, onSubmit, submitting }: StepMetasProps) {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {/* GoalRows por cada tipo seleccionado */}
      {data.objetivo_tipos.map((tipo) => {
        const config = META_CONFIG[tipo];
        return (
          <div
            key={tipo}
            className="w-full bg-white border-[1.5px] border-[rgba(81,13,9,0.12)] rounded-[16px] flex items-center justify-between px-[21.5px] py-[17.5px]"
          >
            <span className="text-[14px] font-medium text-[#510d09]">{config.label}</span>
            <div className="flex items-center gap-[4px]">
              {config.prefix && (
                <span className="text-[14px] text-[rgba(81,13,9,0.45)]">{config.prefix}</span>
              )}
              <input
                type="number"
                min={1}
                value={data[config.field]}
                onChange={(e) => onUpdate({ [config.field]: e.target.value })}
                placeholder="—"
                className="w-[80px] text-[14px] font-semibold text-[#510d09] text-right bg-transparent outline-none placeholder:text-[rgba(81,13,9,0.3)]"
              />
              {config.suffix && (
                <span className="text-[14px] text-[rgba(81,13,9,0.45)]">{config.suffix}</span>
              )}
            </div>
          </div>
        );
      })}

      {/* CTA principal */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors mt-[8px]"
      >
        {submitting ? "Guardando..." : "Guardar mis metas"}
      </button>

      {/* Skip */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="w-full py-[4px] text-[14px] font-medium text-[rgba(81,13,9,0.38)] text-center hover:text-[rgba(81,13,9,0.6)] transition-colors"
      >
        Ahora no, lo hago después
      </button>
    </div>
  );
}
