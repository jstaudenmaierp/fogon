import Link from "next/link";
import { Pencil, Users, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EstadoCampania = "activa" | "borrador" | "cerrada";
export type TipoNecesidad = "plata" | "especie" | "voluntariado";

export interface CampaniaOng {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  estado: EstadoCampania;
  tipoNecesidad: TipoNecesidad;
  objetivoMonto: number | null;
  objetivoCantidad: number | null;
  recaudado: number | null;
  donantes: number;
  diasRestantes: number | null;
}

const ESTADO_BADGE: Record<EstadoCampania, { label: string; className: string }> = {
  activa:   { label: "Activa",   className: "bg-green-100 text-green-700" },
  borrador: { label: "Borrador", className: "bg-blue-100 text-blue-700" },
  cerrada:  { label: "Cerrada",  className: "bg-red-100 text-red-700" },
};

const TIPO_BADGE: Record<TipoNecesidad, { label: string; className: string }> = {
  plata:        { label: "plata",        className: "bg-[#fef3c7] text-[#92400e]" },
  especie:      { label: "especie",      className: "bg-green-100 text-green-700" },
  voluntariado: { label: "voluntariado", className: "bg-blue-100 text-blue-700" },
};

const IMAGEN_BG: Record<EstadoCampania, string> = {
  activa:   "bg-secondary",
  borrador: "bg-[#1e3a6e]",
  cerrada:  "bg-[#27272a]",
};

function formatARS(n: number) {
  return `$${n.toLocaleString("es-AR")}`;
}

export function CampaniaCardOng({ campania }: { campania: CampaniaOng }) {
  const { id, titulo, descripcion, imagenUrl, estado, tipoNecesidad,
          objetivoMonto, objetivoCantidad, recaudado, donantes, diasRestantes } = campania;

  const estadoBadge = ESTADO_BADGE[estado];
  const tipoBadge   = TIPO_BADGE[tipoNecesidad];
  const imagenBg    = IMAGEN_BG[estado];

  const porcentaje = objetivoMonto && recaudado != null
    ? Math.min(100, Math.round((recaudado / objetivoMonto) * 100))
    : 0;

  const diasLabel = diasRestantes == null
    ? "Sin fecha definida"
    : diasRestantes === 0
      ? "Finalizada"
      : `${diasRestantes} días restantes`;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm">
      {/* Imagen */}
      <div className={cn("relative h-44 flex items-center justify-center shrink-0", imagenBg)}>
        {imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagenUrl} alt={titulo} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-semibold tracking-widest uppercase text-white/20 select-none">
            Imagen de campaña
          </span>
        )}
        <span className={cn(
          "absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full",
          estadoBadge.className
        )}>
          {estadoBadge.label}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-base leading-tight text-foreground line-clamp-1">{titulo}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-snug">{descripcion}</p>
        </div>

        {/* Progreso */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full rounded-full overflow-hidden bg-border/50">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          {tipoNecesidad === "plata" ? (
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{formatARS(recaudado ?? 0)}</span>
              <span className="text-muted-foreground">
                de {formatARS(objetivoMonto ?? 0)} · {porcentaje}%
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">
                {recaudado ?? 0} {tipoNecesidad === "voluntariado" ? "voluntarios" : "items"}
              </span>
              <span className="text-muted-foreground">
                de meta: {objetivoCantidad ?? 0} · {porcentaje}%
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <span className="font-medium text-foreground">{donantes} donantes</span>
          <span>·</span>
          <span>{diasLabel}</span>
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full ml-auto", tipoBadge.className)}>
            {tipoBadge.label}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 px-5 pb-5">
        <Link
          href={`/ong/causas/${id}/editar`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 gap-1.5")}
        >
          <Pencil className="size-3.5" />
          Editar
        </Link>
        <Link
          href={`/ong/causas/${id}/donantes`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1 gap-1.5")}
        >
          <Users className="size-3.5" />
          Ver donantes
        </Link>
        {estado !== "cerrada" && (
          <Button variant="destructive" size="sm" className="flex-1 gap-1.5">
            <XCircle className="size-3.5" />
            Cerrar campaña
          </Button>
        )}
      </div>
    </div>
  );
}
