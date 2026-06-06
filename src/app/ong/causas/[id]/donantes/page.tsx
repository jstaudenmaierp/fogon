import { DonantesLista } from "@/components/ong/DonantesLista";
import type { DonanteCausa } from "@/components/ong/DonantesLista";

// TODO: reemplazar con fetch real desde Supabase filtrando por campania_id
const MOCK_DONANTES: DonanteCausa[] = [
  {
    id: "1", nombre: "Lucía",    apellido: "Fernández", desde: "jun 2025",
    totalDonado: 47500, cantidadDonaciones: 12, ultimaDonacion: "3 jun 2026",
    estado: "activo", telefono: "5491112345678",
  },
  {
    id: "2", nombre: "Ana",      apellido: "Rodríguez", desde: "oct 2025",
    totalDonado: 31000, cantidadDonaciones: 8,  ultimaDonacion: "1 jun 2026",
    estado: "activo", telefono: "5491198765432",
  },
  {
    id: "3", nombre: "Valeria",  apellido: "Morales",   desde: "dic 2025",
    totalDonado: 24000, cantidadDonaciones: 6,  ultimaDonacion: "30 may 2026",
    estado: "activo", telefono: null,
  },
  {
    id: "4", nombre: "Sofía",    apellido: "Herrera",   desde: "may 2026",
    totalDonado: 5000,  cantidadDonaciones: 1,  ultimaDonacion: "28 may 2026",
    estado: "nuevo",  telefono: "5491145678901",
  },
  {
    id: "5", nombre: "Diego",    apellido: "Peralta",   desde: "nov 2025",
    totalDonado: 18500, cantidadDonaciones: 5,  ultimaDonacion: "22 mar 2026",
    estado: "activo", telefono: "5491123456789",
  },
  {
    id: "6", nombre: "Fernanda", apellido: "Castro",    desde: "ago 2025",
    totalDonado: 22000, cantidadDonaciones: 7,  ultimaDonacion: "10 mar 2026",
    estado: "activo", telefono: null,
  },
  {
    id: "7", nombre: "Ricardo",  apellido: "Álvarez",   desde: "ene 2026",
    totalDonado: 8000,  cantidadDonaciones: 2,  ultimaDonacion: "15 feb 2026",
    estado: "activo", telefono: "5491134567890",
  },
  {
    id: "8", nombre: "Camila",   apellido: "Torres",    desde: "oct 2025",
    totalDonado: 14000, cantidadDonaciones: 4,  ultimaDonacion: "1 feb 2026",
    estado: "activo", telefono: "5491156789012",
  },
  {
    id: "9", nombre: "Martín",   apellido: "López",     desde: "may 2026",
    totalDonado: 3500,  cantidadDonaciones: 1,  ultimaDonacion: "25 may 2026",
    estado: "activo", telefono: "5491167890123",
  },
  {
    id: "10", nombre: "Gabriela", apellido: "Sánchez",  desde: "jun 2026",
    totalDonado: 2000,  cantidadDonaciones: 1,  ultimaDonacion: "4 jun 2026",
    estado: "nuevo",  telefono: "5491178901234",
  },
];

export default function DonantesPage({ params }: { params: { id: string } }) {
  return (
    <DonantesLista
      campaniaId={params.id}
      campaniaTitulo="Tratamientos 2026"
      donantes={MOCK_DONANTES}
    />
  );
}
