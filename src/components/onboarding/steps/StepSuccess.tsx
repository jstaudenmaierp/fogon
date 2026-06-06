import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function StepSuccess() {
  const router = useRouter();

  // ONGs placeholder — en producción vendrían de Supabase filtradas por intereses
  const ongs = [
    { initials: "FH", nombre: "Fundación Huésped", categoria: "Salud" },
    { initials: "AL", nombre: "Alimentaris", categoria: "Alimentación" },
    { initials: "PP", nombre: "Pequeños Pasos", categoria: "Infancia" },
  ];

  return (
    <div className="fixed inset-0 bg-[#510d09] flex items-center justify-center px-6">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-8 py-16 px-8">
        {/* Icono check */}
        <div className="size-[80px] rounded-full bg-[#febd30] flex items-center justify-center shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)]">
          <Check size={38} strokeWidth={2.5} className="text-[#510d09]" />
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-[32px] font-bold text-white leading-[48px]">
            ¡Tu colmena está lista!
          </h1>
          <p className="text-[16px] text-[rgba(255,255,255,0.62)] mt-3 leading-[24px]">
            Estas ONGs necesitan tu ayuda
          </p>
        </div>

        {/* ONGs sugeridas */}
        <div className="w-full flex flex-col gap-3">
          {ongs.map((ong) => (
            <div
              key={ong.initials}
              className="w-full flex items-center gap-4 px-[21px] py-[17px] bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.14)] rounded-[16px]"
            >
              {/* Avatar */}
              <div className="size-[48px] rounded-full bg-[#febd30] flex items-center justify-center shrink-0">
                <span className="text-[14px] font-bold text-[#510d09]">{ong.initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white leading-[20px]">{ong.nombre}</p>
                <p className="text-[12px] text-[rgba(255,255,255,0.48)] leading-[16px] mt-[2px]">{ong.categoria}</p>
              </div>

              {/* Botón seguir */}
              <div className="h-[24px] px-3 rounded-full bg-[#febd30] flex items-center justify-center shrink-0">
                <span className="text-[12px] font-semibold text-[#510d09]">Seguir</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push("/ingresar")}
          className="w-full h-[56px] rounded-[16px] bg-[#febd30] text-[#510d09] text-[16px] font-semibold hover:bg-[#f5b520] transition-colors"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
