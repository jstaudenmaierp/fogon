"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveOnboarding } from "@/actions/auth";
import type { OnboardingData } from "./types";
import { ColmenaLogo } from "@/components/ColmenaLogo";
import { StepSuccess } from "./steps/StepSuccess";
import { StepIdentidad } from "./steps/StepIdentidad";
import { StepIntereses } from "./steps/StepIntereses";
import { StepTipo } from "./steps/StepTipo";
import { StepMetas } from "./steps/StepMetas";



const STEP_META = [
  { title: "Contanos quién sos", sub: "Solo lo esencial para empezar" },
  { title: "¿Qué causas te importan?", sub: "Elegí al menos una" },
  { title: "¿Cómo querés ayudar?", sub: "Podés elegir más de uno" },
  { title: `Ponete una meta para ${new Date().getFullYear()}`, sub: "Opcional — podés cambiarlo desde tu perfil" },
];

interface OnboardingFlowProps {
  userEmail: string;
}

export function OnboardingFlow({ userEmail }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    nombre: "",
    apellido: "",
    email: userEmail,
    intereses: [],
    objetivo_tipos: [],
    meta_plata: "",
    meta_especie: "",
    meta_voluntariado: "",
  });

  function handleUpdate(updates: Partial<OnboardingData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function handleBack() {
    if (step === 0) {
      router.push("/login");
    } else {
      setStep((s) => s - 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setServerError(null);
    const result = await saveOnboarding({
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      intereses: data.intereses,
      objetivo_tipos: data.objetivo_tipos,
      meta_plata: data.meta_plata ? Number(data.meta_plata) : null,
      meta_especie: data.meta_especie ? Number(data.meta_especie) : null,
      meta_voluntariado: data.meta_voluntariado ? Number(data.meta_voluntariado) : null,
    });
    if (result?.error) {
      setServerError(result.error);
      setSubmitting(false);
      return;
    }
    // Éxito → paso a pantalla de éxito
    setStep(4);
    setSubmitting(false);
  }

  const stepProps = {
    data,
    onUpdate: handleUpdate,
    onNext: () => setStep((s) => s + 1),
    onBack: handleBack,
  };

  // Pantalla de éxito (fuera del layout normal)
  if (step === 4) {
    return <StepSuccess />;
  }

  const meta = STEP_META[step];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      {/* Logo */}
      <ColmenaLogo className="h-[27px] w-auto" />

      {/* Encabezado */}
      <div>
        <h1 className="text-[28px] font-bold text-[#510d09] leading-[42px]">
          {meta.title}
        </h1>
        <p className="text-[14px] text-[rgba(81,13,9,0.5)] mt-[6px]">
          {meta.sub}
        </p>
      </div>

      {/* Steps */}
      {step === 0 && <StepIdentidad {...stepProps} />}
      {step === 1 && <StepIntereses {...stepProps} />}
      {step === 2 && <StepTipo {...stepProps} />}
      {step === 3 && (
        <StepMetas {...stepProps} onSubmit={handleSubmit} submitting={submitting} />
      )}

      {serverError && (
        <p className="text-[13px] text-red-600 text-center -mt-4">{serverError}</p>
      )}
    </div>
  );
}
