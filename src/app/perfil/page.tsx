import { PerfilUsuario } from "@/components/perfil/PerfilUsuario";
import type { DonantePersona } from "@/types/donante";
import type { ObjetivoDonante } from "@/types/objetivo";

// TODO: reemplazar con fetch real desde Supabase usando el user_id autenticado
const MOCK_DONANTE: DonantePersona = {
  id: "d-1",
  user_id: "u-1",
  tipo: "persona",
  nombre: "Josefina",
  apellido: "Staudenmaier",
  email: "josefinastaudenmaier@gmail.com",
  telefono: null,
  intereses: ["Salud", "Niñez", "Alimentación"],
  created_at: "2025-01-01T00:00:00Z",
};

const MOCK_OBJETIVO: ObjetivoDonante = {
  id: "o-1",
  donante_id: "d-1",
  anio: 2026,
  tipo: "plata",
  meta_cantidad: null,
  meta_monto: 50000,
  progreso_cantidad: 0,
  progreso_monto: 18500,
  estado: "en_curso",
};

const MOCK_CAUSAS_SUGERIDAS = [
  {
    id: "c-1",
    titulo: "Tratamientos para personas con VIH",
    ongNombre: "Fundación Huésped",
    tipo: "plata" as const,
    categoria: "Salud",
  },
  {
    id: "c-2",
    titulo: "Juguetes para niños hospitalizados",
    ongNombre: "Pequeños Gigantes",
    tipo: "especie" as const,
    categoria: "Niñez",
  },
  {
    id: "c-3",
    titulo: "Bolsones invierno 2026",
    ongNombre: "Banco de Alimentos",
    tipo: "especie" as const,
    categoria: "Alimentación",
  },
];

export default function PerfilPage() {
  return (
    <PerfilUsuario
      donante={MOCK_DONANTE}
      objetivo={MOCK_OBJETIVO}
      donacionesCount={5}
      causasApoyadas={3}
      causasSugeridas={MOCK_CAUSAS_SUGERIDAS}
    />
  );
}
