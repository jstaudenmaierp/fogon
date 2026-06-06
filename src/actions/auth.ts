"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveOnboarding(formData: {
  nombre: string;
  apellido: string;
  email: string;
  intereses: string[];
  objetivo_tipos: string[];
  meta_plata: number | null;
  meta_especie: number | null;
  meta_voluntariado: number | null;
}): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: donante, error: donanteError } = await supabase
    .from("donante")
    .insert({
      user_id: user.id,
      tipo: "persona",
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      intereses: formData.intereses,
      telefono: null,
    })
    .select("id")
    .single();

  if (donanteError) return { error: donanteError.message };

  const metaMap: Record<string, number | null> = {
    plata: formData.meta_plata,
    especie: formData.meta_especie,
    voluntariado: formData.meta_voluntariado,
  };

  for (const tipo of formData.objetivo_tipos) {
    const meta = metaMap[tipo] ?? null;
    const isPlata = tipo === "plata";
    await supabase.from("objetivo_donante").insert({
      donante_id: donante.id,
      anio: new Date().getFullYear(),
      tipo,
      meta_monto: isPlata ? meta : null,
      meta_cantidad: !isPlata ? meta : null,
      progreso_cantidad: 0,
      progreso_monto: 0,
      estado: meta ? "en_curso" : "sin_meta",
    });
  }
}
