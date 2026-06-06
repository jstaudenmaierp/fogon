"use client";

import { useState } from "react";
import { saveOngOnboarding } from "@/actions/ong";
import type { OngOnboardingData } from "./types";
import { StepOngIdentidad } from "./steps/StepOngIdentidad";
import { StepOngHistoria } from "./steps/StepOngHistoria";
import { StepOngDatosLegales } from "./steps/StepOngDatosLegales";
import { StepOngImpacto } from "./steps/StepOngImpacto";
import { StepOngMercadoPago } from "./steps/StepOngMercadoPago";

const TOTAL_STEPS = 5;

const NAV_TABS = [
  "1. Identidad",
  "2. Historia",
  "3. Datos legales",
  "4. Impacto",
  "5. Mercado Pago",
  "6. Dashboard",
];

const STEP_META = [
  {
    title: "Contanos sobre tu organización",
    sub: "Esta información va a aparecer en tu perfil público.",
  },
  {
    title: "Contanos más sobre su trabajo",
    sub: "Ayuda a los donantes a entender a quiénes ayudás.",
  },
  {
    title: "Datos de la organización",
    sub: "Necesitamos estos datos para validar tu cuenta.",
  },
  {
    title: "¿Cómo medís el impacto de tu organización?",
    sub: "Cada ONG tiene su propia forma de medir. Esto va a aparecer en tu perfil público para que los donantes entiendan tu trabajo.",
  },
  {
    title: "Vinculá tu cuenta de Mercado Pago",
    sub: "Para recibir donaciones en plata necesitás conectar tu cuenta de MP.",
  },
];

export function OngOnboardingFlow() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [data, setData] = useState<OngOnboardingData>({
    logoFile: null,
    logoPreview: null,
    nombre: "",
    descripcion: "",
    causas: [],
    aQuienesAyudan: "",
    zonasOperacion: [],
    anioFundacion: "",
    mayorLogro: "",
    razonSocial: "",
    cuit: "",
    sitioWeb: "",
    instagram: "",
    linkedin: "",
    metricaNombre: "",
    metricaUnidad: "",
    metricaFrecuencia: "mensual",
    mpVinculado: false,
  });

  function handleUpdate(updates: Partial<OngOnboardingData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setServerError(null);
    const result = await saveOngOnboarding({
      nombre: data.nombre,
      descripcion: data.descripcion,
      razonSocial: data.razonSocial,
      cuit: data.cuit,
      instagram: data.instagram,
      linkedin: data.linkedin,
    });
    if (result?.error) {
      setServerError(result.error);
      setSubmitting(false);
    }
  }

  const stepProps = {
    data,
    onUpdate: handleUpdate,
    onNext: () => setStep((s) => s + 1),
    onBack: handleBack,
  };

  const meta = STEP_META[step];

  return (
    <div className="min-h-screen flex flex-col bg-[#fff2d8]">
      {/* Nav tabs */}
      <nav className="w-full border-b border-[rgba(81,13,9,0.08)] bg-[#fff2d8]">
        <div className="max-w-[700px] mx-auto px-6 flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {NAV_TABS.map((tab, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => isCompleted && setStep(i)}
                disabled={!isCompleted && !isActive}
                className={`flex-shrink-0 px-[14px] py-[7px] rounded-[20px] text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#510d09] text-white"
                    : isCompleted
                    ? "text-[rgba(81,13,9,0.6)] hover:text-[#510d09] cursor-pointer"
                    : "text-[rgba(81,13,9,0.35)] cursor-default"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-[620px] flex flex-col gap-7">
          {/* Barra de progreso */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 gap-[6px]">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-[5px] rounded-full transition-colors duration-300"
                  style={{
                    background:
                      i < step
                        ? "#febd30"
                        : i === step
                        ? "#febd30"
                        : "rgba(81,13,9,0.12)",
                    opacity: i === step ? 0.6 : 1,
                  }}
                />
              ))}
            </div>
            <span className="text-[13px] text-[rgba(81,13,9,0.45)] font-medium flex-shrink-0">
              {step + 1}/{TOTAL_STEPS}
            </span>
          </div>

          {/* Encabezado */}
          <div>
            <h1 className="text-[26px] font-bold text-[#510d09] leading-tight">
              {meta.title}
            </h1>
            <p className="text-[14px] text-[rgba(81,13,9,0.5)] mt-[6px] leading-[1.5]">
              {meta.sub}
            </p>
          </div>

          {/* Pasos */}
          {step === 0 && <StepOngIdentidad {...stepProps} />}
          {step === 1 && <StepOngHistoria {...stepProps} />}
          {step === 2 && <StepOngDatosLegales {...stepProps} />}
          {step === 3 && <StepOngImpacto {...stepProps} />}
          {step === 4 && (
            <StepOngMercadoPago
              {...stepProps}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}

          {serverError && (
            <p className="text-[13px] text-red-600 text-center -mt-4">
              {serverError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
