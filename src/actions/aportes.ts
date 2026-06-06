"use server";

import { createClient } from "@/lib/supabase/server";

export async function guardarAporteEspecie(data: {
  campaniaId: string;
  queVasADonar: string;
  comoEntregas: "punto_entrega" | "buscan_a_mi";
  direccion: string;
  cuando: string;
}): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tenés que iniciar sesión para donar." };

  const { data: donante } = await supabase
    .from("donante")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!donante) return { error: "Completá tu perfil antes de donar." };

  const { error } = await supabase.from("aporte").insert({
    donante_id: donante.id,
    campania_id: data.campaniaId,
    tipo: "especie",
    estado: "a_coordinar",
  });

  if (error) return { error: error.message };

  return { ok: true };
}

export async function guardarAporteVoluntariado(data: {
  campaniaId: string;
  disponibilidad: string;
  descripcion: string;
}): Promise<{ error: string } | { ok: true }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tenés que iniciar sesión para participar." };

  const { data: donante } = await supabase
    .from("donante")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!donante) return { error: "Completá tu perfil antes de participar." };

  const { error } = await supabase.from("aporte").insert({
    donante_id: donante.id,
    campania_id: data.campaniaId,
    tipo: "voluntariado",
    estado: "a_coordinar",
  });

  if (error) return { error: error.message };

  return { ok: true };
}
