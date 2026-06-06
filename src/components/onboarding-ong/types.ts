export interface OngOnboardingData {
  // Step 1 - Identidad
  logoFile: File | null;
  logoPreview: string | null;
  nombre: string;
  descripcion: string;
  causas: string[];

  // Step 2 - Historia
  aQuienesAyudan: string;
  zonasOperacion: string[];
  anioFundacion: string;
  mayorLogro: string;

  // Step 3 - Datos legales
  razonSocial: string;
  cuit: string;
  sitioWeb: string;
  instagram: string;
  linkedin: string;

  // Step 4 - Impacto
  metricaNombre: string;
  metricaUnidad: string;
  metricaFrecuencia: "mensual" | "trimestral" | "anual";

  // Step 5 - Mercado Pago
  mpVinculado: boolean;
}

export interface OngStepProps {
  data: OngOnboardingData;
  onUpdate: (updates: Partial<OngOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CAUSAS_ONG = [
  "Salud",
  "Educación",
  "Infancia",
  "Derechos humanos",
  "Alimentación",
  "Medio ambiente",
  "Género",
  "Discapacidad",
];

export const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];
