export type TipoDonacion = "plata" | "especie" | "voluntariado";

export interface OnboardingData {
  nombre: string;
  apellido: string;
  email: string;
  intereses: string[];
  objetivo_tipos: TipoDonacion[];
  meta_plata: string;
  meta_especie: string;
  meta_voluntariado: string;
}

export interface StepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}
