"use client";

import type { OngStepProps } from "../types";

const input =
  "w-full h-[51px] px-[17.5px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors";

const label = "text-[14px] font-semibold text-[#510d09]";

const OptionalBadge = () => (
  <span className="text-[11px] font-semibold text-[#febd30] bg-[#febd30]/15 px-2 py-[2px] rounded-full">
    Opcional
  </span>
);

export function StepOngDatosLegales({ data, onUpdate, onNext, onBack }: OngStepProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const canContinue =
    data.razonSocial.trim().length > 0 && data.cuit.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Razón social */}
      <div className="flex flex-col gap-2">
        <span className={label}>Razón social</span>
        <input
          type="text"
          required
          autoFocus
          value={data.razonSocial}
          onChange={(e) => onUpdate({ razonSocial: e.target.value })}
          placeholder="Ej: Fundación Huésped A.C."
          className={input}
        />
      </div>

      {/* CUIT */}
      <div className="flex flex-col gap-2">
        <span className={label}>CUIT</span>
        <input
          type="text"
          required
          value={data.cuit}
          onChange={(e) => onUpdate({ cuit: e.target.value })}
          placeholder="30-12345678-9"
          className={input}
        />
      </div>

      {/* Sitio web */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={label}>Sitio web</span>
          <OptionalBadge />
        </div>
        <input
          type="url"
          value={data.sitioWeb}
          onChange={(e) => onUpdate({ sitioWeb: e.target.value })}
          placeholder="https://tungo.org.ar"
          className={input}
        />
      </div>

      {/* Redes sociales */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={label}>Redes sociales</span>
          <OptionalBadge />
        </div>
        <div className="flex gap-3">
          {/* Instagram */}
          <div className="flex-1 relative">
            <div className="absolute left-[14px] top-1/2 -translate-y-1/2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(81,13,9,0.4)"
                strokeWidth="1.8"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="rgba(81,13,9,0.4)" stroke="none" />
              </svg>
            </div>
            <input
              type="text"
              value={data.instagram}
              onChange={(e) => onUpdate({ instagram: e.target.value })}
              placeholder="@usuario"
              className="w-full h-[51px] pl-[40px] pr-[14px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors"
            />
          </div>
          {/* LinkedIn */}
          <div className="flex-1 relative">
            <div className="absolute left-[14px] top-1/2 -translate-y-1/2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="rgba(81,13,9,0.4)"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </div>
            <input
              type="text"
              value={data.linkedin}
              onChange={(e) => onUpdate({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/..."
              className="w-full h-[51px] pl-[40px] pr-[14px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Aviso privacidad */}
      <div className="flex items-start gap-3 p-4 rounded-[14px] border-[1.5px] border-[#febd30]/40 bg-[#febd30]/8">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(81,13,9,0.5)"
          strokeWidth="1.8"
          className="mt-[1px] flex-shrink-0"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-[13px] text-[rgba(81,13,9,0.65)] leading-[1.5]">
          Tus datos legales son privados y solo los usamos para verificar tu
          cuenta. No se muestran en tu perfil público.
        </p>
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
