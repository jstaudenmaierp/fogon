"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Pause, ChevronDown, ChevronRight,
  Coins, RefreshCw, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EstadoDonante = "activo" | "nuevo";

export interface DonanteCausa {
  id: string;
  nombre: string;
  apellido: string;
  desde: string;
  totalDonado: number;
  cantidadDonaciones: number;
  ultimaDonacion: string;
  estado: EstadoDonante;
  telefono: string | null;
}

interface DonantesListaProps {
  campaniaId: string;
  campaniaTitulo: string;
  donantes: DonanteCausa[];
}

// ── utils ──────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { bg: "bg-rose-400",    text: "text-white" },
  { bg: "bg-orange-400",  text: "text-white" },
  { bg: "bg-amber-300",   text: "text-amber-900" },
  { bg: "bg-green-500",   text: "text-white" },
  { bg: "bg-teal-400",    text: "text-white" },
  { bg: "bg-blue-400",    text: "text-white" },
  { bg: "bg-violet-400",  text: "text-white" },
  { bg: "bg-pink-400",    text: "text-white" },
  { bg: "bg-cyan-500",    text: "text-white" },
  { bg: "bg-emerald-400", text: "text-white" },
];

function avatarColor(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function formatARS(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function whatsappUrl(telefono: string) {
  const digits = telefono.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

// ── sub-components ─────────────────────────────────────────────────────────

const ESTADO_BADGE: Record<EstadoDonante, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-green-100 text-green-700" },
  nuevo:  { label: "Nuevo",  className: "bg-blue-100 text-blue-700" },
};

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const { bg, text } = avatarColor(nombre + apellido);
  const iniciales = `${nombre[0]}${apellido[0]}`.toUpperCase();
  return (
    <div className={cn("size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0", bg, text)}>
      {iniciales}
    </div>
  );
}

function StatCard({
  icon: Icon, iconColor, label, value, sublabel, dark = false,
}: {
  icon: React.ElementType; iconColor: string; label: string;
  value: string; sublabel?: string; dark?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl p-5 flex flex-col gap-2 flex-1",
      dark ? "bg-secondary text-secondary-foreground" : "bg-card border border-border"
    )}>
      <Icon className={cn("size-5", dark ? "text-primary" : iconColor)} />
      <p className={cn("text-3xl font-bold leading-none", dark ? "text-primary" : "text-foreground")}>
        {value}
      </p>
      <p className={cn("text-sm", dark ? "text-secondary-foreground/70" : "text-muted-foreground")}>
        {label}
      </p>
      {sublabel && (
        <p className={cn("text-xs font-medium", dark ? "text-primary" : "text-muted-foreground")}>
          {sublabel}
        </p>
      )}
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

type Filtro = "todos" | "nuevos";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos",  label: "Todos" },
  { id: "nuevos", label: "Nuevos" },
];

export function DonantesLista({ campaniaId, campaniaTitulo, donantes }: DonantesListaProps) {
  const [filtro, setFiltro]       = useState<Filtro>("todos");
  const [expandido, setExpandido] = useState<string | null>(null);

  const nuevos   = donantes.filter((d) => d.estado === "nuevo");
  const visibles = filtro === "todos" ? donantes : nuevos;

  const totalRecaudado = donantes.reduce((s, d) => s + d.totalDonado, 0);
  const promedio       = donantes.length ? Math.round(totalRecaudado / donantes.length) : 0;

  const COUNTS: Record<Filtro, number> = {
    todos:  donantes.length,
    nuevos: nuevos.length,
  };

  return (
    <div className="flex flex-col gap-6 px-8 py-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/ong`}>
            <Button variant="ghost" size="icon-sm"><ArrowLeft /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Donantes</h1>
            <p className="text-sm text-muted-foreground">{donantes.length} donantes en total · {campaniaTitulo}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href={`/ong/causas/${campaniaId}/editar`}>
              <Pencil className="size-3.5" />
              Editar campaña
            </Link>
          </Button>
          <Button variant="destructive" size="sm" className="gap-1.5">
            <Pause className="size-3.5" />
            Pausar campaña
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard
          dark icon={Coins} iconColor=""
          value={String(donantes.length)}
          label="Donantes totales"
        />
        <StatCard
          icon={Coins} iconColor="text-primary"
          value={formatARS(totalRecaudado)}
          label="Total recaudado"
        />
        <StatCard
          icon={RefreshCw} iconColor="text-blue-500"
          value={String(nuevos.length)}
          label="Nuevos este mes"
        />
        <StatCard
          icon={Coins} iconColor="text-emerald-500"
          value={formatARS(promedio)}
          label="Promedio por donante"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        {FILTROS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={cn(
              "flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-medium border transition-all",
              filtro === id
                ? "bg-secondary text-secondary-foreground border-secondary"
                : "bg-card text-foreground border-border hover:bg-muted"
            )}
          >
            {label}
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-semibold",
              filtro === id ? "bg-secondary-foreground/20 text-secondary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {COUNTS[id]}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border">
          {["Donante", "Total donado", "Última donación", ""].map((h) => (
            <span key={h} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {visibles.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No hay donantes en esta categoría.
          </div>
        )}

        {visibles.map((donante, i) => {
          const isLast    = i === visibles.length - 1;
          const isOpen    = expandido === donante.id;
          const badge     = ESTADO_BADGE[donante.estado];

          return (
            <div key={donante.id} className={cn(!isLast && "border-b border-border")}>
              {/* Main row */}
              <button
                onClick={() => setExpandido(isOpen ? null : donante.id)}
                className="w-full grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-muted/40 transition-colors text-left"
              >
                {/* Donante */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar nombre={donante.nombre} apellido={donante.apellido} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {donante.nombre} {donante.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">desde {donante.desde}</p>
                  </div>
                  <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full shrink-0", badge.className)}>
                    {badge.label}
                  </span>
                </div>

                {/* Total */}
                <span className="text-sm font-bold text-foreground">{formatARS(donante.totalDonado)}</span>

                {/* Última donación */}
                <span className="text-sm text-muted-foreground">{donante.ultimaDonacion}</span>

                {/* Chevron */}
                <div className="text-muted-foreground">
                  {isOpen
                    ? <ChevronDown className="size-4" />
                    : <ChevronRight className="size-4" />}
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border bg-muted/30">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Coins className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Donaciones totales</p>
                        <p className="text-sm font-bold text-foreground">{formatARS(donante.totalDonado)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <RefreshCw className="size-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Cantidad de donaciones</p>
                        <p className="text-sm font-bold text-foreground">{donante.cantidadDonaciones} donaciones</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Calendar className="size-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">Última donación</p>
                        <p className="text-sm font-bold text-foreground">{donante.ultimaDonacion}</p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp CTA */}
                  {donante.telefono ? (
                    <a
                      href={whatsappUrl(donante.telefono)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start"
                    >
                      <Button variant="outline" size="sm" className="gap-2 border-green-500 text-green-700 hover:bg-green-50">
                        <svg viewBox="0 0 24 24" className="size-4 fill-green-600" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Contactar por WhatsApp
                      </Button>
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Sin número de teléfono registrado.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
