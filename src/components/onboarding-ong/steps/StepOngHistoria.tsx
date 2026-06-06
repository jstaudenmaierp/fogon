"use client";

import type { OngStepProps } from "../types";
import { PROVINCIAS_ARGENTINA } from "../types";

const input =
  "w-full h-[51px] px-[17.5px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors";

const label = "text-[14px] font-semibold text-[#510d09]";

export function StepOngHistoria({ data, onUpdate, onNext, onBack }: OngStepProps) {
  const todoPais = data.zonasOperacion.length === PROVINCIAS_ARGENTINA.length;

  function toggleTodoPais() {
    if (todoPais) {
      onUpdate({ zonasOperacion: [] });
    } else {
      onUpdate({ zonasOperacion: [...PROVINCIAS_ARGENTINA] });
    }
  }

  function toggleProvincia(prov: string) {
    const next = data.zonasOperacion.includes(prov)
      ? data.zonasOperacion.filter((p) => p !== prov)
      : [...data.zonasOperacion, prov];
    onUpdate({ zonasOperacion: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const canContinue =
    data.aQuienesAyudan.trim().length > 0 &&
    data.zonasOperacion.length > 0 &&
    data.anioFundacion.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* ¿A quiénes ayudan? */}
      <div className="flex flex-col gap-2">
        <span className={label}>¿A quiénes ayudan?</span>
        <input
          type="text"
          required
          autoFocus
          value={data.aQuienesAyudan}
          onChange={(e) => onUpdate({ aQuienesAyudan: e.target.value })}
          placeholder="Ej: niños en situación de vulnerabilidad"
          className={input}
        />
      </div>

      {/* Zona de operación */}
      <div className="flex flex-col gap-3">
        <span className={label}>Zona de operación</span>

        {/* Todo el país */}
        <button
          type="button"
          onClick={toggleTodoPais}
          className={`w-full h-[51px] px-4 rounded-[14px] border-[1.5px] flex items-center justify-between text-[14px] font-medium transition-colors ${
            todoPais
              ? "border-[#febd30] bg-[#febd30]/10"
              : "border-[rgba(81,13,9,0.15)] bg-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors ${
                todoPais
                  ? "border-[#febd30] bg-[#febd30]"
                  : "border-[rgba(81,13,9,0.25)] bg-white"
              }`}
            >
              {todoPais && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="#510d09"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="text-[#510d09]">Todo el país</span>
          </div>
          <span className="text-[12px] text-[rgba(81,13,9,0.45)]">
            Selecciona todas las provincias
          </span>
        </button>

        {/* Provincias grid */}
        <div className="grid grid-cols-2 gap-2">
          {PROVINCIAS_ARGENTINA.map((prov) => {
            const selected = data.zonasOperacion.includes(prov);
            return (
              <button
                key={prov}
                type="button"
                onClick={() => toggleProvincia(prov)}
                className={`h-[45px] px-4 rounded-[14px] border-[1.5px] flex items-center gap-3 text-[14px] transition-colors ${
                  selected
                    ? "border-[rgba(81,13,9,0.4)] bg-white"
                    : "border-[rgba(81,13,9,0.12)] bg-white hover:border-[rgba(81,13,9,0.3)]"
                }`}
              >
                <div
                  className={`w-[17px] h-[17px] rounded-[4px] border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected
                      ? "border-[#510d09] bg-[#510d09]"
                      : "border-[rgba(81,13,9,0.2)] bg-white"
                  }`}
                >
                  {selected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#febd30"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-[#510d09]">{prov}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Año de fundación */}
      <div className="flex flex-col gap-2">
        <span className={label}>Año de fundación</span>
        <input
          type="number"
          required
          min={1800}
          max={new Date().getFullYear()}
          value={data.anioFundacion}
          onChange={(e) => onUpdate({ anioFundacion: e.target.value })}
          placeholder="Ej: 2008"
          className={input}
        />
      </div>

      {/* Mayor logro */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={label}>Mayor logro hasta hoy</span>
          <span className="text-[11px] font-semibold text-[#febd30] bg-[#febd30]/15 px-2 py-[2px] rounded-full">
            Opcional
          </span>
        </div>
        <textarea
          value={data.mayorLogro}
          onChange={(e) => onUpdate({ mayorLogro: e.target.value })}
          placeholder="Ej: Acompañamos a más de 5.000 familias desde 2018"
          rows={3}
          className="w-full px-[17.5px] py-[14px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors resize-none"
        />
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
          disabled={!canContinue}
          className="flex-1 h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}
