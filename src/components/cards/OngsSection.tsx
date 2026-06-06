import { createAdminClient } from "@/lib/supabase/admin";
import { SectionHeader } from "./SectionHeader";
import { OngCard } from "./OngCard";

interface OngsSectionProps {
  title?: string;
  limit?: number;
}

export async function OngsSection({ title = "Conocé ONGs", limit = 5 }: OngsSectionProps) {
  const supabase = createAdminClient();

  // Traer ONGs que tienen campañas activas, con nombre y logo reales
  const { data: campanias } = await supabase
    .from("campania")
    .select("ong_id, ong(id, nombre, logo_url)")
    .eq("estado", "activa");

  if (!campanias?.length) return null;

  const ongMap = new Map<string, { nombre: string; logoUrl: string | null; causasActivas: number }>();
  for (const c of campanias) {
    const ong = c.ong as unknown as { id: string; nombre: string; logo_url: string | null } | null;
    if (!ong) continue;
    const entry = ongMap.get(ong.id) ?? { nombre: ong.nombre, logoUrl: ong.logo_url, causasActivas: 0 };
    entry.causasActivas += 1;
    ongMap.set(ong.id, entry);
  }

  const ongs = Array.from(ongMap.entries()).slice(0, limit);
  if (!ongs.length) return null;

  return (
    <section className="flex flex-col gap-5 px-20 w-full">
      <SectionHeader title={title} />
      <div className="grid grid-cols-5 gap-3 w-full">
        {ongs.map(([id, info]) => (
          <OngCard
            key={id}
            id={id}
            nombre={info.nombre}
            logoUrl={info.logoUrl}
            categoria=""
            causasActivas={info.causasActivas}
          />
        ))}
      </div>
    </section>
  );
}
