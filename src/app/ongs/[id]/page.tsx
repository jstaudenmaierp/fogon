import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Share2, Calendar } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { CausaCard } from "@/components/cards/CausaCard";
import { diasRestantes } from "@/lib/dates";

const TIPO_LABEL: Record<string, string> = {
  plata: "Dinero",
  especie: "Cosas",
  voluntariado: "Voluntariado",
  general: "General",
};

interface Props {
  params: Promise<{ id: string }>;
}

function OngLogo({ src, nombre }: { src: string | null; nombre: string }) {
  if (!src) {
    return (
      <span className="text-3xl font-bold text-[#510d09]/30 select-none">
        {nombre.charAt(0).toUpperCase()}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={nombre} className="w-full h-full object-cover" />;
}

function CausaPasadaCard({
  titulo,
  imagenUrl,
  fechaLimite,
  resumen,
  tipoNecesidad,
}: {
  titulo: string;
  imagenUrl: string | null;
  fechaLimite: string | null;
  resumen: string;
  tipoNecesidad: string;
}) {
  const fecha = fechaLimite
    ? new Date(fechaLimite).toLocaleDateString("es-AR", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="relative flex flex-col gap-4 bg-[#fffefa] border border-[#e6dbc5] rounded-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pt-4 px-4 pb-6">
      {/* Imagen */}
      <div
        className="relative w-full rounded-[16px] overflow-hidden shrink-0"
        style={{ aspectRatio: "384/241" }}
      >
        {imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagenUrl}
            alt={titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-border" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Badge tipo sobre la imagen */}
      <div className="absolute top-[26px] left-[25px] flex gap-1">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted border border-border text-[#510d09] text-[12px] leading-4 whitespace-nowrap">
          {TIPO_LABEL[tipoNecesidad] ?? tipoNecesidad}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-1">
        {fecha && (
          <div className="flex items-center gap-1">
            <Calendar size={12} strokeWidth={2} className="text-[#cd9317] shrink-0" />
            <span className="text-[12px] leading-4 text-[#cd9317]">{fecha}</span>
          </div>
        )}
        <p className="text-[16px] font-bold text-[#1a1a1a] leading-[1.4] line-clamp-2">{titulo}</p>
        <p className="text-[13px] font-medium text-[#1a1a1a] opacity-[0.56] leading-normal line-clamp-2">
          {resumen}
        </p>
      </div>

      <button className="flex items-center justify-center h-8 w-full rounded-full bg-muted border border-border text-[#510d09] text-[12px] font-medium hover:bg-muted/70 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        Saber más
      </button>
    </div>
  );
}

function DonantePrincipalCard({
  rank,
  nombre,
  avatarUrl,
}: {
  rank: number;
  nombre: string;
  avatarUrl: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-4 bg-[#fffefa] border border-[#e6dbc5] rounded-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] pt-4 px-6 pb-6">
      <div className="relative flex items-center justify-center size-[175px] rounded-full border-4 border-[rgba(254,189,48,0.1)] overflow-hidden bg-muted shrink-0">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl font-bold text-[#510d09]/20 select-none">
            {nombre.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col items-center text-center w-full">
        <p className="text-[13px] text-[#767676] leading-normal">Top {rank}</p>
        <p className="text-[16px] font-bold text-[#1a1a1a] leading-[1.4] w-full truncate text-center">
          {nombre}
        </p>
      </div>
      <button className="flex items-center justify-center h-8 w-full rounded-full bg-muted border border-border text-[#510d09] text-[12px] font-medium hover:bg-muted/70 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)]">
        Saber más
      </button>
    </div>
  );
}

export default async function OngDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: ong } = await supabase
    .from("ong")
    .select("*")
    .eq("id", id)
    .single();

  if (!ong) notFound();

  const [{ data: campanasActivas }, { data: campanasPasadas }, { data: donaciones }] =
    await Promise.all([
      supabase
        .from("campania")
        .select("id, titulo, imagen_url, tipo_necesidad, fecha_limite, descripcion, urgencia")
        .eq("ong_id", id)
        .eq("estado", "activa")
        .order("urgencia", { ascending: false })
        .limit(8),
      supabase
        .from("campania")
        .select("id, titulo, imagen_url, tipo_necesidad, fecha_limite, descripcion")
        .eq("ong_id", id)
        .eq("estado", "cerrada")
        .order("fecha_limite", { ascending: false })
        .limit(6),
      supabase
        .from("donacion_general")
        .select("monto, donante(nombre, apellido, nombre_empresa)")
        .eq("ong_id", id)
        .order("monto", { ascending: false })
        .limit(5),
    ]);

  const tags = (ong.tipos_donacion_habilitados ?? [])
    .map((t: string) => TIPO_LABEL[t] ?? t)
    .filter(Boolean);

  const topDonantes = (donaciones ?? []).map((d, i) => {
    const donante = d.donante as { nombre?: string; apellido?: string; nombre_empresa?: string } | null;
    const nombre =
      donante?.nombre_empresa ??
      [donante?.nombre, donante?.apellido].filter(Boolean).join(" ") ??
      "Anónimo";
    return { rank: i + 1, nombre };
  });

  return (
    <main className="flex flex-col gap-12 pb-20 pt-[120px]">
      {/* Hero */}
      <section className="flex flex-col gap-6 px-20 w-full">
        {/* Volver */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[#510d09] text-[12px] font-medium w-fit hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Volver
        </Link>

        {/* Logo + nombre + descripción + compartir */}
        <div className="flex flex-col gap-4">
          {/* Logo */}
          <div className="flex items-center justify-center size-20 rounded-full border border-[rgba(254,189,48,0.1)] overflow-hidden bg-muted shrink-0">
            <OngLogo src={ong.logo_url} nombre={ong.nombre} />
          </div>

          {/* Nombre + descripción + botón compartir */}
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <h1 className="text-[40px] font-bold text-[#510d09] leading-tight">
                {ong.nombre}
              </h1>
              <p className="text-[16px] text-[#767676] leading-normal">
                {ong.descripcion}
              </p>
            </div>
            <button className="flex items-center gap-2 h-12 px-6 rounded-full bg-muted border border-border text-[#510d09] text-base font-medium hover:bg-muted/70 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)] shrink-0">
              <Share2 size={16} strokeWidth={2} />
              Compartir
            </button>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#fffefa] border border-[#e6dbc5] text-[#1a1a1a] text-[14px] leading-normal"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Card de donación directa */}
      <section className="px-20 w-full">
        <div className="flex items-center gap-4 h-40 rounded-[24px] border border-[#e6dbc5] px-6 pt-4 pb-6 overflow-hidden bg-gradient-to-l from-[#fff2d8] to-[#fffbf3] shadow-[0px_1px_4px_rgba(12,12,13,0.1)]">
          <div className="flex items-center justify-center size-[100px] rounded-2xl bg-muted overflow-hidden shrink-0">
            <OngLogo src={ong.logo_url} nombre={ong.nombre} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-[20px] font-bold text-[#1a1a1a] leading-[1.4] truncate">
              Doná a {ong.nombre}
            </p>
            <p className="text-[16px] text-[#767676] leading-normal line-clamp-2">
              Si querés apoyar el trabajo de la organización sin elegir una campaña puntual, podés
              hacer una donación única o suscribirte mensualmente.
            </p>
          </div>
          <div className="flex gap-2 items-center shrink-0">
            <Link
              href={`/login?redirect=/ongs/${id}/donar?modalidad=unica`}
              className="flex items-center justify-center h-12 px-6 rounded-full bg-[#febd30] text-[#510d09] text-base font-medium hover:bg-[#febd30]/90 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)] whitespace-nowrap"
            >
              Donar por única vez
            </Link>
            <Link
              href={`/login?redirect=/ongs/${id}/donar?modalidad=mensual`}
              className="flex items-center justify-center h-12 px-6 rounded-full bg-[#510d09] text-[rgba(255,242,216,0.92)] text-base font-medium hover:bg-[#510d09]/90 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)] whitespace-nowrap"
            >
              Donar todos los meses
            </Link>
          </div>
        </div>
      </section>

      {/* Causas activas */}
      {campanasActivas && campanasActivas.length > 0 && (
        <section className="flex flex-col gap-5 px-20 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-medium text-[#510d09]">Causas activas</h2>
          </div>
          <div className="grid grid-cols-4 gap-3 w-full items-start">
            {campanasActivas.map((c) => (
              <CausaCard
                key={c.id}
                id={c.id}
                titulo={c.titulo}
                imagenUrl={c.imagen_url}
                tipoNecesidad={c.tipo_necesidad}
                fechaLimite={c.fecha_limite}
                ongNombre={null}
                objetivoDescripcion={c.tipo_necesidad !== "plata" ? c.descripcion : null}
              />
            ))}
          </div>
        </section>
      )}

      {/* Causas pasadas */}
      {campanasPasadas && campanasPasadas.length > 0 && (
        <section className="flex flex-col gap-5 px-20 w-full">
          <h2 className="text-[24px] font-medium text-[#510d09]">Causas pasadas</h2>
          <div className="grid grid-cols-4 gap-3 w-full">
            {campanasPasadas.map((c) => (
              <CausaPasadaCard
                key={c.id}
                titulo={c.titulo}
                imagenUrl={c.imagen_url}
                fechaLimite={c.fecha_limite}
                resumen={c.descripcion}
                tipoNecesidad={c.tipo_necesidad}
              />
            ))}
          </div>
        </section>
      )}

      {/* Principales donantes */}
      {topDonantes.length > 0 && (
        <section className="flex flex-col gap-5 px-20 w-full">
          <h2 className="text-[24px] font-medium text-[#510d09]">Principales donantes</h2>
          <div className="flex gap-3 w-full">
            {topDonantes.map((d) => (
              <DonantePrincipalCard key={d.rank} rank={d.rank} nombre={d.nombre} avatarUrl={null} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
