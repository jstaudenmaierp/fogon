import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { diasRestantes } from "@/lib/dates";
import { DonacionForm } from "./DonacionForm";
import { SidebarEspecie } from "./SidebarEspecie";

const TIPO_LABEL: Record<string, string> = {
  plata: "Plata",
  especie: "Cosas",
  voluntariado: "Voluntariado",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CausaDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: campania } = await supabase
    .from("campania")
    .select("*, ong(id, nombre, logo_url)")
    .eq("id", id)
    .eq("estado", "activa")
    .single();

  if (!campania) notFound();

  const tipo = campania.tipo_necesidad as "plata" | "especie" | "voluntariado";
  const ong = campania.ong as { id: string; nombre: string; logo_url: string | null } | null;
  const dias = diasRestantes(campania.fecha_limite);

  // Para plata: aportes confirmados con monto
  // Para especie/voluntariado: aportes a_coordinar como "contactos"
  const estadoAporte = tipo === "plata" ? "confirmado" : "a_coordinar";

  const { data: aportes } = await supabase
    .from("aporte")
    .select("monto, fecha, donante(nombre, apellido, nombre_empresa)")
    .eq("campania_id", id)
    .eq("estado", estadoAporte)
    .order("fecha", { ascending: false })
    .limit(5);

  // Para especie: items pedidos
  const { data: itemsPedidos } = tipo !== "plata"
    ? await supabase
        .from("item_pedido")
        .select("nombre, cantidad")
        .eq("campania_id", id)
    : { data: null };

  // Contar total de aportes/contactos
  const { count: totalAportes } = await supabase
    .from("aporte")
    .select("id", { count: "exact", head: true })
    .eq("campania_id", id)
    .eq("estado", estadoAporte);

  // Para plata: total recaudado
  const recaudadoTotal =
    tipo === "plata"
      ? (aportes?.reduce((acc, a) => acc + (parseFloat(a.monto ?? "0") || 0), 0) ?? 0)
      : 0;

  // Verificar si el usuario actual ya se contactó
  let yaContactado = false;
  if (tipo !== "plata") {
    const authSupabase = await createClient();
    const { data: { user } } = await authSupabase.auth.getUser();
    if (user) {
      const { data: donante } = await authSupabase
        .from("donante")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (donante) {
        const { count } = await supabase
          .from("aporte")
          .select("id", { count: "exact", head: true })
          .eq("campania_id", id)
          .eq("donante_id", donante.id)
          .eq("estado", "a_coordinar");
        yaContactado = (count ?? 0) > 0;
      }
    }
  }

  // Objetivo en unidades (suma de cantidades de items pedidos)
  const objetivoUnidades = itemsPedidos
    ? itemsPedidos.reduce((acc, i) => acc + (i.cantidad ?? 0), 0)
    : null;

  return (
    <main className="flex flex-col gap-12 pb-20 pt-[120px]">
      {/* Volver */}
      <section className="flex flex-col gap-6 px-20 w-full">
        <Link
          href={ong ? `/ongs/${ong.id}` : "/"}
          className="flex items-center gap-1.5 text-[#510d09] text-[12px] font-medium w-fit hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          Volver
        </Link>

        {/* Hero imagen con título */}
        <div className="relative w-full h-[350px] rounded-[16px] overflow-hidden border border-[#e6dbc5] shadow-[0px_1px_4px_rgba(12,12,13,0.1)]">
          {campania.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campania.imagen_url}
              alt={campania.titulo}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-border" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[40%] to-[#fffbf3] to-[86%]" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 px-6 pb-6">
            <div className="flex gap-1.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted border border-border text-[#510d09] text-[14px] leading-4 whitespace-nowrap">
                {TIPO_LABEL[tipo] ?? tipo}
              </span>
            </div>
            <h1 className="text-[40px] font-bold text-[#510d09] leading-tight">
              {campania.titulo}
            </h1>
          </div>
        </div>
      </section>

      {/* Cuerpo principal: descripción + sidebar */}
      <section className="flex gap-20 items-start px-20 w-full">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/* ONG + deadline */}
          <div className="flex items-center justify-between gap-4">
            {ong && (
              <Link
                href={`/ongs/${ong.id}`}
                className="flex items-center gap-2 text-[#510d09] text-[16px] hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center justify-center size-6 rounded-full border border-[rgba(254,189,48,0.1)] overflow-hidden bg-muted shrink-0">
                  {ong.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ong.logo_url} alt={ong.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-[#510d09]/30">
                      {ong.nombre.charAt(0)}
                    </span>
                  )}
                </div>
                {ong.nombre}
              </Link>
            )}
            {dias !== null && (
              <div className="flex items-center gap-2 text-[#cd9317]">
                <Calendar size={20} strokeWidth={2} className="shrink-0" />
                <span className="text-[16px]">
                  Vence en {dias} {dias === 1 ? "día" : "días"}
                </span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <p className="text-[18px] font-medium text-[#1a1a1a] opacity-[0.56]">
              Sobre esta campaña
            </p>
            <p className="text-[20px] font-medium text-[#1a1a1a] leading-normal whitespace-pre-wrap">
              {campania.descripcion}
            </p>
          </div>

          {/* Lista de pedidos (solo especie) */}
          {tipo === "especie" && itemsPedidos && itemsPedidos.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[20px] font-bold text-[#1a1a1a]">Lista de pedidos</p>
              <ul className="flex flex-col gap-1 pl-5 list-disc">
                {itemsPedidos.map((item, i) => (
                  <li key={i} className="text-[20px] font-medium text-[#1a1a1a] leading-normal">
                    {item.nombre}
                    {item.cantidad > 1 && (
                      <span className="text-[#767676] ml-1">×{item.cantidad}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Columna derecha: sidebar */}
        <div className="sticky top-28">
          {tipo === "plata" ? (
            <>
              <DonacionForm
                campaniaId={id}
                recaudado={recaudadoTotal > 0 ? recaudadoTotal : null}
                objetivo={null}
              />
              {/* Donaciones recientes */}
              {aportes && aportes.length > 0 && (
                <div className="mt-6 flex flex-col gap-4 w-[569px]">
                  <p className="text-[18px] font-medium text-[#1a1a1a] opacity-[0.56]">
                    Donaciones recientes
                  </p>
                  <div className="flex flex-col gap-3">
                    {aportes.map((a, i) => {
                      const donante = a.donante as {
                        nombre?: string;
                        apellido?: string;
                        nombre_empresa?: string;
                      } | null;
                      const nombre =
                        donante?.nombre_empresa ??
                        [donante?.nombre, donante?.apellido].filter(Boolean).join(" ") ??
                        "Anónimo";
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-10 rounded-full border border-[rgba(254,189,48,0.1)] bg-muted overflow-hidden shrink-0">
                              <span className="text-[14px] font-bold text-[#510d09]/30">
                                {nombre.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[16px] font-bold text-[#1a1a1a] leading-[1.4]">{nombre}</p>
                              <p className="text-[13px] text-[#767676] leading-normal">
                                {a.fecha
                                  ? (() => {
                                      const diff = Date.now() - new Date(a.fecha).getTime();
                                      const mins = Math.floor(diff / 60000);
                                      if (mins < 60) return `hace ${mins} min`;
                                      const hs = Math.floor(mins / 60);
                                      if (hs < 24) return `hace ${hs}h`;
                                      return `hace ${Math.floor(hs / 24)} días`;
                                    })()
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <p className="text-[13px] text-[#767676]">
                            {a.monto
                              ? parseFloat(a.monto).toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                  maximumFractionDigits: 0,
                                })
                              : "—"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <SidebarEspecie
              campaniaId={id}
              tipoNecesidad={tipo}
              titulo={campania.titulo}
              contactosCount={totalAportes ?? 0}
              objetivoUnidades={objetivoUnidades}
              contactos={(aportes ?? []).map((a) => {
                const donante = a.donante as {
                  nombre?: string;
                  apellido?: string;
                  nombre_empresa?: string;
                } | null;
                return {
                  nombre:
                    donante?.nombre_empresa ??
                    [donante?.nombre, donante?.apellido].filter(Boolean).join(" ") ??
                    "Anónimo",
                  fecha: a.fecha,
                };
              })}
              yaContactado={yaContactado}
            />
          )}
        </div>
      </section>
    </main>
  );
}
