"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { CardBadge } from "./CardBadge";
import { diasRestantes, formatMonto } from "@/lib/dates";

const TIPO_LABEL: Record<string, string> = {
  plata: "Plata",
  especie: "Cosas",
  voluntariado: "Voluntariado",
};

export interface CausaCardProps {
  id: string;
  titulo: string;
  imagenUrl: string | null;
  tipoNecesidad: "plata" | "especie" | "voluntariado";
  fechaLimite: string | null;
  ongNombre: string | null;
  categorias?: string[];
  objetivoMonto?: number | null;
  progresoPorcentaje?: number | null;
  objetivoDescripcion?: string | null;
}

function CardImage({ src, alt }: { src: string | null; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-muted to-border" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export function CausaCard({
  id,
  titulo,
  imagenUrl,
  tipoNecesidad,
  fechaLimite,
  ongNombre,
  categorias = [],
  objetivoMonto,
  progresoPorcentaje,
  objetivoDescripcion,
}: CausaCardProps) {
  const dias = diasRestantes(fechaLimite);
  const esPlata = tipoNecesidad === "plata";

  return (
    <div className="relative flex flex-col gap-4 bg-[#fffefa] border border-[#e6dbc5] rounded-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pt-4 px-4 pb-6 h-full">

      {/* Imagen con gradiente */}
      <div className="relative w-full rounded-[16px] overflow-hidden shrink-0" style={{ aspectRatio: "384/241" }}>
        <CardImage src={imagenUrl} alt={titulo} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Badges sobre la imagen */}
      <div className="absolute top-[26px] left-[25px] flex gap-1 flex-wrap">
        <CardBadge label={TIPO_LABEL[tipoNecesidad] ?? tipoNecesidad} />
        {categorias.map((cat) => (
          <CardBadge key={cat} label={cat} />
        ))}
      </div>

      {/* Contenido de texto + stats */}
      <div className="flex flex-col gap-4 flex-1 min-h-0">
        {/* Deadline + título + ONG */}
        <div className="flex flex-col gap-1">
          {dias !== null && (
            <div className="flex items-center gap-1">
              <Calendar size={12} strokeWidth={2} className="text-[#cd9317] shrink-0" />
              <span className="text-[12px] leading-4 text-[#cd9317]">
                Vence en {dias} {dias === 1 ? "día" : "días"}
              </span>
            </div>
          )}
          <p className="text-[16px] font-bold text-[#1a1a1a] leading-[1.4] line-clamp-2">
            {titulo}
          </p>
          {ongNombre && (
            <p className="text-[13px] text-[#767676] leading-normal">
              por {ongNombre}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[13px] font-medium text-[#1a1a1a] whitespace-nowrap">
            <span className="opacity-[0.56]">Objetivo</span>
            {esPlata && objetivoMonto != null && (
              <span>{formatMonto(objetivoMonto)}</span>
            )}
          </div>

          {esPlata ? (
            <div
              className="h-2 w-full rounded-full overflow-hidden"
              style={{ background: "rgba(230,219,197,0.5)" }}
            >
              <div
                className="h-full bg-[#510d09] rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, progresoPorcentaje ?? 25))}%` }}
              />
            </div>
          ) : (
            <p className="text-[13px] font-medium text-[#1a1a1a] truncate leading-normal">
              {objetivoDescripcion ?? "—"}
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/causas/${id}`}
        className="flex items-center justify-center h-8 rounded-full bg-[#febd30] text-[#510d09] text-[12px] font-medium hover:bg-[#febd30]/90 transition-colors shrink-0 w-full"
      >
        Quiero donar
      </Link>
    </div>
  );
}
