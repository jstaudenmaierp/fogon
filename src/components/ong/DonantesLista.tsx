"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Pause, Coins, RefreshCw, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
  { bg: "bg-rose-500",    text: "text-white" },
  { bg: "bg-orange-500",  text: "text-white" },
  { bg: "bg-amber-400",   text: "text-white" },
  { bg: "bg-green-600",   text: "text-white" },
  { bg: "bg-teal-500",    text: "text-white" },
  { bg: "bg-blue-500",    text: "text-white" },
  { bg: "bg-violet-500",  text: "text-white" },
  { bg: "bg-pink-500",    text: "text-white" },
  { bg: "bg-cyan-600",    text: "text-white" },
  { bg: "bg-emerald-500", text: "text-white" },
];

function avatarColor(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

function formatARS(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

function whatsappUrl(tel: string) {
  return `https://wa.me/${tel.replace(/\D/g, "")}`;
}

// ── sub-components ─────────────────────────────────────────────────────────

const ESTADO_BADGE: Record<EstadoDonante, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-green-100 text-green-800 font-semibold" },
  nuevo:  { label: "Nuevo",  className: "bg-blue-100 text-blue-800 font-semibold" },
};

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const { bg, text } = avatarColor(nombre + apellido);
  return (
    <div className={cn("size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0", bg, text)}>
      {nombre[0]}{apellido[0]}
    </div>
  );
}

function StatCard({
  icon: Icon, iconClass, label, value, dark = false,
}: {
  icon: React.ElementType; iconClass: string; label: string; value: string; dark?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-2xl p-5 flex flex-col gap-2 flex-1",
      dark ? "bg-secondary text-secondary-foreground" : "bg-white border border-[#e6dbc5]"
    )}>
      <Icon className={cn("size-5", iconClass)} />
      <p className={cn("text-3xl font-bold leading-none", dark ? "text-primary" : "text-foreground")}>
        {value}
      </p>
      <p className={cn("text-sm", dark ? "text-secondary-foreground/70" : "text-foreground/60")}>
        {label}
      </p>
    </div>
  );
}

// ── main ───────────────────────────────────────────────────────────────────

type Filtro = "todos" | "nuevos";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos",  label: "Todos" },
  { id: "nuevos", label: "Nuevos" },
];

export function DonantesLista({ campaniaId, campaniaTitulo, donantes }: DonantesListaProps) {
  const nuevos = donantes.filter((d) => d.estado === "nuevo");
  const totalRecaudado = donantes.reduce((s, d) => s + d.totalDonado, 0);
  const promedio = donantes.length ? Math.round(totalRecaudado / donantes.length) : 0;

  const COUNTS: Record<Filtro, number> = { todos: donantes.length, nuevos: nuevos.length };

  return (
    <div className="flex flex-col gap-6 px-8 py-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/ong" className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}>
            <ArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Donantes</h1>
            <p className="text-sm text-muted-foreground">
              {donantes.length} donantes en total · {campaniaTitulo}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/ong/causas/${campaniaId}/editar`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <Pencil className="size-3.5" />
            Editar campaña
          </Link>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Pause className="size-3.5" />
            Pausar campaña
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <StatCard dark icon={Coins} iconClass="text-primary" value={String(donantes.length)} label="Donantes totales" />
        <StatCard icon={Coins} iconClass="text-primary" value={formatARS(totalRecaudado)} label="Total recaudado" />
        <StatCard icon={UserPlus} iconClass="text-blue-500" value={String(nuevos.length)} label="Nuevos este mes" />
        <StatCard icon={RefreshCw} iconClass="text-emerald-600" value={formatARS(promedio)} label="Promedio por donante" />
      </div>

      {/* Tabla */}
      <div className="bg-white border border-[#e6dbc5] rounded-2xl overflow-hidden">
        {/* Columnas */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#e6dbc5] bg-[#fdf8f0]">
          {["Donante", "Total donado", "Última donación", ""].map((h) => (
            <span key={h} className="text-xs font-bold text-foreground/50 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {donantes.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">No hay donantes todavía.</p>
        )}

        {donantes.map((donante, i) => {
          const isLast = i === donantes.length - 1;
          const badge  = ESTADO_BADGE[donante.estado];

          return (
            <div
              key={donante.id}
              className={cn(
                "grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4",
                !isLast && "border-b border-[#e6dbc5]"
              )}
            >
              {/* Donante */}
              <div className="flex items-center gap-3 min-w-0">
                <Avatar nombre={donante.nombre} apellido={donante.apellido} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {donante.nombre} {donante.apellido}
                  </p>
                  <p className="text-xs text-foreground/50">desde {donante.desde}</p>
                </div>
                <span className={cn("text-xs px-2.5 py-1 rounded-full shrink-0", badge.className)}>
                  {badge.label}
                </span>
              </div>

              {/* Total */}
              <span className="text-sm font-bold text-foreground">{formatARS(donante.totalDonado)}</span>

              {/* Última donación */}
              <span className="text-sm text-foreground/60">{donante.ultimaDonacion}</span>

              {/* WhatsApp */}
              <div>
                {donante.telefono ? (
                  <a
                    href={whatsappUrl(donante.telefono)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-green-300 bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-green-600 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                ) : (
                  <span className="text-xs text-foreground/30 italic">Sin teléfono</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
