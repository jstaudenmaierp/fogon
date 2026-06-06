"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MONTOS_PRESET = [1000, 5000, 10000, 20000, 50000];

function formatMonto(n: number) {
  return n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

interface Props {
  campaniaId: string;
  recaudado: number | null;
  objetivo: number | null;
}

function CircularProgress({ pct }: { pct: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, Math.max(0, pct / 100)));
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Track */}
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e6dbc5" strokeWidth="10" />
      {/* Progress */}
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#510d09"
        strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      {/* Label */}
      <text
        x="60"
        y="65"
        textAnchor="middle"
        className="text-[18px] font-medium fill-[#510d09] opacity-56"
        style={{ fontSize: 18, fontFamily: "inherit", opacity: 0.56, fill: "#510d09" }}
      >
        {Math.round(pct)}%
      </text>
    </svg>
  );
}

export function DonacionForm({ campaniaId, recaudado, objetivo }: Props) {
  const router = useRouter();
  const [montoSeleccionado, setMontoSeleccionado] = useState<number | null>(10000);
  const [montoCustom, setMontoCustom] = useState("");

  const pct = objetivo && recaudado ? (recaudado / objetivo) * 100 : 0;
  const montoFinal = montoCustom ? parseInt(montoCustom.replace(/\D/g, ""), 10) : montoSeleccionado;

  function handleDonar() {
    if (!montoFinal || montoFinal <= 0) return;
    router.push(`/login?redirect=/causas/${campaniaId}/pago?monto=${montoFinal}`);
  }

  return (
    <div className="bg-gradient-to-bl from-[#fffbf3] to-[#fff2d8] border border-[#e6dbc5] rounded-[24px] p-8 flex flex-col gap-6 w-[569px] shrink-0 shadow-[0px_1px_4px_rgba(12,12,13,0.1)]">
      {/* Progreso */}
      {objetivo != null && (
        <div className="flex gap-6 items-center">
          <CircularProgress pct={pct} />
          <div className="flex flex-col gap-0.5">
            <p className="text-[28px] font-medium text-[#1a1a1a] leading-normal whitespace-nowrap">
              {recaudado != null ? formatMonto(recaudado) : "$0"} recaudado
            </p>
            <p className="text-[28px] font-medium text-[#1a1a1a] opacity-[0.56] leading-normal whitespace-nowrap">
              de {formatMonto(objetivo)}
            </p>
          </div>
        </div>
      )}

      {/* Selector de monto */}
      <div className="flex flex-col gap-3">
        <p className="text-[16px] text-[#767676]">Elegí un monto</p>
        <div className="flex items-center justify-between gap-2">
          {MONTOS_PRESET.map((m) => {
            const selected = montoSeleccionado === m && !montoCustom;
            return (
              <button
                key={m}
                onClick={() => { setMontoSeleccionado(m); setMontoCustom(""); }}
                className={`flex items-center justify-center px-4 py-2.5 rounded-[24px] text-[18px] font-medium transition-colors border ${
                  selected
                    ? "bg-[#fff0d0] border-[#febd30] text-[#510d09]"
                    : "bg-[#fffbf3] border-[#e6dbc5] text-[#510d09] hover:bg-[#fff2d8]"
                }`}
              >
                {formatMonto(m)}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Otro monto"
          value={montoCustom}
          onChange={(e) => {
            setMontoCustom(e.target.value);
            setMontoSeleccionado(null);
          }}
          className="h-12 w-full rounded-full border border-[#e6dbc5] bg-white px-4 text-[20px] text-[#510d09] placeholder:text-[#510d09] placeholder:opacity-45 outline-none focus:border-[#febd30] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        />
      </div>

      {/* Botón donar */}
      <button
        onClick={handleDonar}
        disabled={!montoFinal || montoFinal <= 0}
        className="flex items-center justify-center h-12 w-full rounded-full bg-[#febd30] text-[#510d09] text-base font-medium hover:bg-[#febd30]/90 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Donar por única vez
      </button>
    </div>
  );
}
