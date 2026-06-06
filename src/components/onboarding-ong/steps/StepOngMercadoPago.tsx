"use client";

import type { OngStepProps } from "../types";

interface StepOngMercadoPagoProps extends OngStepProps {
  onSubmit: () => void;
  submitting: boolean;
}

export function StepOngMercadoPago({
  onBack,
  onSubmit,
  submitting,
}: StepOngMercadoPagoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Card MP */}
      <div className="w-full rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.1)] bg-white p-8 flex flex-col items-center gap-3">
        {/* MP logo */}
        <div className="w-[72px] h-[72px] rounded-[18px] bg-[#009ee3] flex items-center justify-center">
          <span className="text-white text-[20px] font-bold">MP</span>
        </div>
        <span className="text-[17px] font-bold text-[#510d09]">Mercado Pago</span>
        <p className="text-[13px] text-[rgba(81,13,9,0.55)] text-center leading-[1.5]">
          Procesamos todos los pagos de forma segura a través de Mercado Pago.
        </p>
      </div>

      {/* Beneficios */}
      <div className="flex flex-col gap-3">
        {[
          "Recibís el dinero directamente en tu cuenta de MP",
          "Podés configurar donaciones únicas y recurrentes",
          "Comisión estándar de Mercado Pago (sin costos extra de Colmena)",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <div className="w-[22px] h-[22px] rounded-full bg-[#febd30] flex items-center justify-center flex-shrink-0 mt-[1px]">
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <path
                  d="M1 4.5L3.8 7.5L10 1"
                  stroke="#510d09"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[14px] text-[#510d09] leading-[1.5]">{item}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-60 hover:bg-[#6b1109] transition-colors mt-2"
      >
        {submitting ? "Guardando..." : "Vincular Mercado Pago ahora"}
      </button>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="text-[13px] text-[rgba(81,13,9,0.45)] hover:text-[rgba(81,13,9,0.7)] transition-colors text-center -mt-3"
      >
        Lo hago después desde mi perfil
      </button>

      <button
        type="button"
        onClick={onBack}
        className="h-[48px] px-6 rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.2)] text-[#510d09] text-[15px] font-medium hover:border-[rgba(81,13,9,0.4)] transition-colors self-start"
      >
        ← Volver
      </button>
    </div>
  );
}
