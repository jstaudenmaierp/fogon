import { createAdminClient } from "@/lib/supabase/admin";
import { SectionHeader } from "./SectionHeader";
import { CausaCard } from "./CausaCard";

interface CausasSectionProps {
  title: string;
  urgenciaMin?: number;
  limit?: number;
}

export async function CausasSection({ title, urgenciaMin, limit = 4 }: CausasSectionProps) {
  const supabase = createAdminClient();

  let query = supabase
    .from("campania")
    .select("id, titulo, imagen_url, tipo_necesidad, fecha_limite, descripcion, urgencia, ong(nombre)")
    .eq("estado", "activa")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (urgenciaMin != null) {
    query = query.gte("urgencia", urgenciaMin);
  }

  const { data: campanias } = await query;
  if (!campanias?.length) return null;

  return (
    <section className="flex flex-col gap-5 px-20 w-full">
      <SectionHeader title={title} />
      <div className="grid grid-cols-4 gap-3 w-full items-start">
        {campanias.map((c) => (
          <CausaCard
            key={c.id}
            id={c.id}
            titulo={c.titulo}
            imagenUrl={c.imagen_url}
            tipoNecesidad={c.tipo_necesidad}
            fechaLimite={c.fecha_limite}
            ongNombre={(c.ong as { nombre?: string } | null)?.nombre ?? null}
            objetivoDescripcion={c.tipo_necesidad !== "plata" ? c.descripcion : null}
          />
        ))}
      </div>
    </section>
  );
}
