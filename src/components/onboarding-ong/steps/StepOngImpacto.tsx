"use client";

import type { OngStepProps } from "../types";

const input =
  "w-full h-[51px] px-[17.5px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors";

const label = "text-[14px] font-semibold text-[#510d09]";

const FRECUENCIAS = [
  { value: "mensual", label: "Mensual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "anual", label: "Anual" },
] as const;

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function StepOngImpacto({ data, onUpdate, onNext, onBack }: OngStepProps) {
  const mesActual = MONTHS[new Date().getMonth()];
  const anioActual = new Date().getFullYear();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  function handleSkip() {
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Nota */}
      <div className="border-l-[3px] border-[#febd30] pl-4 py-1">
        <p className="text-[13px] text-[rgba(81,13,9,0.65)] leading-[1.5]">
          Podés tener más de una métrica. Agregá la principal ahora y sumá más
          desde tu perfil.
        </p>
      </div>

      {/* Nombre de la métrica */}
      <div className="flex flex-col gap-2">
        <span className={label}>Nombre de la métrica</span>
        <input
          type="text"
          autoFocus
          value={data.metricaNombre}
          onChange={(e) => onUpdate({ metricaNombre: e.target.value })}
          placeholder="Ej: personas beneficiadas · kilos distribuidos · casos acompañados · familias asistidas"
          className={input}
        />
      </div>

      {/* Unidad de medida */}
      <div className="flex flex-col gap-2">
        <span className={label}>Unidad de medida</span>
        <input
          type="text"
          value={data.metricaUnidad}
          onChange={(e) => onUpdate({ metricaUnidad: e.target.value })}
          placeholder="Ej: personas · kilos · familias · casos"
          className={input}
        />
      </div>

      {/* Frecuencia */}
      <div className="flex flex-col gap-3">
        <span className={label}>Frecuencia de actualización</span>
        <div className="flex gap-2">
          {FRECUENCIAS.map(({ value, label: lbl }) => (
            <button
              key={value}
              type="button"
              onClick={() => onUpdate({ metricaFrecuencia: value })}
              className={`flex-1 h-[51px] rounded-[14px] border-[1.5px] text-[14px] font-medium transition-colors ${
                data.metricaFrecuencia === value
                  ? "border-[#510d09] bg-[#510d09] text-[#febd30]"
                  : "border-[rgba(81,13,9,0.2)] bg-white text-[#510d09] hover:border-[#510d09]"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[rgba(81,13,9,0.5)] tracking-widest uppercase">
          Así se ve en tu perfil público
        </span>
        <div className="w-full rounded-[16px] bg-[#510d09] px-6 py-5 flex flex-col gap-3">
          <span className="text-[11px] font-bold text-[#febd30] tracking-widest uppercase">
            Impacto — {mesActual} de {anioActual}
          </span>
          <div className="w-8 h-[3px] bg-[#febd30] rounded-full" />
          <div className="text-center py-2">
            <p className="text-[20px] font-bold text-white">
              {data.metricaNombre || "—"}
            </p>
            <p className="text-[13px] text-[rgba(255,255,255,0.5)] mt-1">
              Actualizado por la ONG
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="h-[56px] px-6 rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.2)] text-[#510d09] text-[15px] font-medium hover:border-[rgba(81,13,9,0.4)] transition-colors"
        >
          ← Volver
        </button>
        <button
          type="submit"
          className="flex-1 h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold hover:bg-[#6b1109] transition-colors"
        >
          Continuar
        </button>
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="text-[13px] text-[rgba(81,13,9,0.45)] hover:text-[rgba(81,13,9,0.7)] transition-colors text-center -mt-3"
      >
        Lo completo después
      </button>
    </form>
  );
}
