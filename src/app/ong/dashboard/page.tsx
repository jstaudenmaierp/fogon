import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ColmenaLogoIcon } from "@/components/ColmenaLogo";

export default async function OngDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/ong/dashboard");

  const { data: ong } = await supabase
    .from("ong")
    .select("id, nombre, descripcion, logo_url, mp_account_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!ong) redirect("/onboarding/ong");

  const initials = ong.nombre
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const sinMP = !ong.mp_account_id;

  return (
    <div className="min-h-screen flex flex-col bg-[#fff2d8]">
      {/* Header oscuro */}
      <header className="w-full bg-[#510d09] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ColmenaLogoIcon className="h-[22px] w-[19px] text-[#febd30]" />
          <span className="text-[19px] font-semibold tracking-[-0.04em] text-[#febd30] leading-none">
            colmena
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[14px] font-semibold text-[#febd30]">
              {ong.nombre}
            </p>
            <p className="text-[12px] text-[rgba(254,189,48,0.6)]">
              En revisión
            </p>
          </div>
          <div className="w-[38px] h-[38px] rounded-full bg-[#febd30] flex items-center justify-center">
            <span className="text-[13px] font-bold text-[#510d09]">
              {initials}
            </span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 max-w-[700px] mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/* Banners de acción */}
        <div className="flex flex-col gap-3">
          {sinMP && (
            <div className="flex items-center justify-between p-4 rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.15)] bg-white gap-4">
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(81,13,9,0.5)"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-[14px] text-[#510d09]">
                  Vinculá tu Mercado Pago para empezar a recibir donaciones
                </p>
              </div>
              <button className="flex-shrink-0 h-[36px] px-4 rounded-[10px] bg-[#febd30] text-[#510d09] text-[13px] font-semibold hover:bg-[#f5b320] transition-colors">
                Vincular
              </button>
            </div>
          )}

          <div className="flex items-center justify-between p-4 rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.15)] bg-white gap-4">
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(81,13,9,0.5)"
                strokeWidth="1.8"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p className="text-[14px] text-[#510d09]">
                Publicá tu primera campaña y empezá a recibir donaciones
              </p>
            </div>
            <button className="flex-shrink-0 h-[36px] px-4 rounded-[10px] bg-[#510d09] text-[#febd30] text-[13px] font-semibold hover:bg-[#6b1109] transition-colors">
              Crear campaña
            </button>
          </div>
        </div>

        {/* Perfil público */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-bold text-[rgba(81,13,9,0.5)] tracking-widest uppercase">
            Tu perfil público
          </h2>
          <div className="bg-white rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.08)] p-5 flex items-start gap-4">
            <div className="w-[52px] h-[52px] rounded-[14px] bg-[#febd30] flex items-center justify-center flex-shrink-0">
              <span className="text-[16px] font-bold text-[#510d09]">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[16px] font-bold text-[#510d09]">
                  {ong.nombre}
                </p>
                <span className="flex-shrink-0 text-[11px] text-[rgba(81,13,9,0.5)] bg-[rgba(81,13,9,0.06)] px-2 py-[3px] rounded-full">
                  Pendiente de campaña
                </span>
              </div>
              {ong.descripcion && (
                <p className="text-[13px] text-[rgba(81,13,9,0.6)] mt-1 leading-[1.5] line-clamp-2">
                  {ong.descripcion}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-bold text-[rgba(81,13,9,0.5)] tracking-widest uppercase">
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🏛", label: "Donaciones recibidas", value: "$0" },
              { icon: "👥", label: "Donantes", value: "0" },
              { icon: "📈", label: "Campañas activas", value: "0" },
              { icon: "💛", label: "Impacto", value: "0" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white rounded-[16px] border-[1.5px] border-[rgba(81,13,9,0.08)] p-5"
              >
                <p className="text-[12px] text-[rgba(81,13,9,0.45)]">{label}</p>
                <p className="text-[28px] font-bold text-[#510d09] mt-1">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
