"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import type { OngStepProps } from "../types";
import { CAUSAS_ONG } from "../types";

const input =
  "w-full h-[51px] px-[17.5px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors";

const label = "text-[14px] font-semibold text-[#510d09]";

export function StepOngIdentidad({ data, onUpdate, onNext }: OngStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    onUpdate({ logoFile: file, logoPreview: preview });
  }

  function toggleCausa(causa: string) {
    const next = data.causas.includes(causa)
      ? data.causas.filter((c) => c !== causa)
      : [...data.causas, causa];
    onUpdate({ causas: next });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const canContinue =
    data.nombre.trim().length > 0 && data.descripcion.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Logo */}
      <div className="flex flex-col gap-2">
        <span className={label}>Logo de la organización</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-[120px] h-[120px] rounded-[16px] border-[2px] border-dashed border-[rgba(81,13,9,0.3)] bg-white flex flex-col items-center justify-center gap-2 hover:border-[rgba(81,13,9,0.5)] transition-colors"
        >
          {data.logoPreview ? (
            <img
              src={data.logoPreview}
              alt="Logo"
              className="w-full h-full object-cover rounded-[14px]"
            />
          ) : (
            <>
              <Camera size={28} className="text-[rgba(81,13,9,0.35)]" />
              <span className="text-[12px] text-[rgba(81,13,9,0.45)]">
                Subir logo
              </span>
            </>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <span className={label}>Nombre de la organización</span>
        <input
          type="text"
          required
          autoFocus
          value={data.nombre}
          onChange={(e) => onUpdate({ nombre: e.target.value })}
          placeholder="Ej: Fundación Huésped"
          className={input}
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2">
        <span className={label}>Descripción corta</span>
        <div className="relative">
          <textarea
            required
            value={data.descripcion}
            onChange={(e) =>
              onUpdate({ descripcion: e.target.value.slice(0, 300) })
            }
            placeholder="Describí brevemente a qué se dedica tu organización..."
            rows={4}
            className="w-full px-[17.5px] py-[14px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors resize-none"
          />
          <span className="absolute bottom-3 right-4 text-[12px] text-[rgba(81,13,9,0.35)]">
            {data.descripcion.length}/300
          </span>
        </div>
      </div>

      {/* Causas */}
      <div className="flex flex-col gap-3">
        <span className={label}>Causas que trabajan</span>
        <div className="grid grid-cols-2 gap-2">
          {CAUSAS_ONG.map((causa) => {
            const selected = data.causas.includes(causa);
            return (
              <button
                key={causa}
                type="button"
                onClick={() => toggleCausa(causa)}
                className={`h-[51px] rounded-[14px] border-[1.5px] text-[14px] font-medium transition-colors ${
                  selected
                    ? "border-[#510d09] bg-[#510d09] text-[#febd30]"
                    : "border-[rgba(81,13,9,0.2)] bg-white text-[#510d09] hover:border-[#510d09]"
                }`}
              >
                {causa}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={!canContinue}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors mt-2"
      >
        Continuar
      </button>
    </form>
  );
}
