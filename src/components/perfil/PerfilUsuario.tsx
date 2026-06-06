"use client";

import { useState } from "react";
import { Pencil, Share2, EyeOff, Plus, Camera, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DonantePersona } from "@/types/donante";
import type { ObjetivoDonante } from "@/types/objetivo";

const INTERES_COLORS: Record<string, string> = {
  "Salud":            "bg-rose-100 text-rose-700",
  "Niñez":            "bg-orange-100 text-orange-700",
  "Alimentación":     "bg-green-100 text-green-700",
  "Derechos":         "bg-blue-100 text-blue-700",
  "Educación":        "bg-purple-100 text-purple-700",
  "Medioambiente":    "bg-emerald-100 text-emerald-700",
  "Animales":         "bg-amber-100 text-amber-700",
  "Personas mayores": "bg-slate-100 text-slate-600",
  "Discapacidad":     "bg-teal-100 text-teal-700",
};

interface CausaSugerida {
  id: string;
  titulo: string;
  ongNombre: string;
  tipo: "plata" | "especie" | "voluntariado";
  categoria: string;
}

interface PerfilUsuarioProps {
  donante: DonantePersona;
  objetivo: ObjetivoDonante | null;
  donacionesCount: number;
  causasApoyadas: number;
  causasSugeridas: CausaSugerida[];
}

const TIPO_BADGE = {
  plata:        "bg-[#fef3c7] text-[#92400e]",
  especie:      "bg-green-100 text-green-700",
  voluntariado: "bg-blue-100 text-blue-700",
};

function formatARS(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

export function PerfilUsuario({
  donante, objetivo, donacionesCount, causasApoyadas, causasSugeridas,
}: PerfilUsuarioProps) {
  const [perfilPublico, setPerfilPublico] = useState(false);
  const [mostrarCausas, setMostrarCausas] = useState(true);

  const iniciales = `${donante.nombre[0]}${donante.apellido[0]}`.toUpperCase();
  const tieneIntereses = donante.intereses.length > 0;

  const progresoPct = objetivo?.meta_monto && objetivo.progreso_monto
    ? Math.min(100, Math.round((objetivo.progreso_monto / objetivo.meta_monto) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-xl mx-auto px-4">

        {/* Cover + Avatar */}
        <div className="relative mb-14">
          {/* Cover */}
          <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/80 via-primary/30 to-muted relative">
            {/* Bell */}
            <button className="absolute top-3 right-3 size-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-card transition-colors">
              <Bell className="size-4 text-foreground" />
            </button>
          </div>

          {/* Avatar */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-10">
            <div className="relative">
              <div className="size-20 rounded-full border-4 border-card bg-primary flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-primary-foreground">{iniciales}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
                <Camera className="size-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Edit button */}
          <button className="absolute right-0 -bottom-14 size-8 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
            <Pencil className="size-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Nombre + badge */}
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {donante.nombre} {donante.apellido}
          </h1>
          {causasApoyadas > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Acompañaste {causasApoyadas} {causasApoyadas === 1 ? "causa" : "causas"}
            </span>
          )}
        </div>

        {/* Intereses */}
        {tieneIntereses ? (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {donante.intereses.map((interes) => (
              <span
                key={interes}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-full",
                  INTERES_COLORS[interes] ?? "bg-muted text-foreground"
                )}
              >
                {interes}
              </span>
            ))}
          </div>
        ) : (
          <div className="mb-6 rounded-xl border-2 border-dashed border-border p-5 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-muted-foreground">Contá qué causas te importan.</p>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Plus className="size-3.5" />
              Agregar intereses
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mb-5 text-sm">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-lg text-foreground">{donacionesCount}</span>
            <span className="text-muted-foreground">donaciones</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-bold text-lg text-foreground">{causasApoyadas}</span>
            <span className="text-muted-foreground">causas apoyadas</span>
          </div>
        </div>

        {/* Privacidad */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <button
            onClick={() => setPerfilPublico((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <EyeOff className="size-4" />
            {perfilPublico ? "Tu perfil es público." : "Tu perfil es privado."}
            <span className="text-secondary underline-offset-2 hover:underline ml-0.5">
              {perfilPublico ? "Hacerlo privado" : "Cambiar visibilidad"}
            </span>
          </button>
          <Button variant="outline" size="sm" className="gap-2 rounded-full px-5">
            <Share2 className="size-3.5" />
            Compartir perfil
          </Button>
        </div>

        {/* Meta anual */}
        {objetivo && objetivo.meta_monto && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Meta anual {objetivo.anio}</p>
              <span className="text-xs text-muted-foreground">{progresoPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-border/50 mb-2">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progresoPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {formatARS(objetivo.progreso_monto)}
              </span>
              <span className="text-muted-foreground">
                de {formatARS(objetivo.meta_monto)}
              </span>
            </div>
          </div>
        )}

        {/* Causas sugeridas */}
        {causasSugeridas.length > 0 && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setMostrarCausas((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <span className="text-sm font-semibold text-foreground">Causas para vos</span>
              <span className="text-muted-foreground text-lg leading-none">
                {mostrarCausas ? "︿" : "﹀"}
              </span>
            </button>

            {mostrarCausas && (
              <div className="divide-y divide-border">
                {causasSugeridas.map((causa) => (
                  <div key={causa.id} className="flex items-center gap-3 px-5 py-4">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                      {causa.ongNombre[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{causa.titulo}</p>
                      <p className="text-xs text-muted-foreground">{causa.ongNombre}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        TIPO_BADGE[causa.tipo]
                      )}>
                        {causa.tipo}
                      </span>
                      <Button variant="secondary" size="xs" className="rounded-full">
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
