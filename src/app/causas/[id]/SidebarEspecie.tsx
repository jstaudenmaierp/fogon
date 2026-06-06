"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { guardarAporteEspecie, guardarAporteVoluntariado } from "@/actions/aportes";

interface Contacto {
  nombre: string;
  fecha: string;
}

interface Props {
  campaniaId: string;
  tipoNecesidad: "especie" | "voluntariado";
  titulo: string;
  contactosCount: number;
  objetivoUnidades: number | null;
  contactos: Contacto[];
  yaContactado: boolean;
}

function timeAgo(fecha: string): string {
  const diff = Date.now() - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} ${mins === 1 ? "minuto" : "minutos"}`;
  const hs = Math.floor(mins / 60);
  if (hs < 24) return `hace ${hs} ${hs === 1 ? "hora" : "horas"}`;
  const dias = Math.floor(hs / 24);
  return `hace ${dias} ${dias === 1 ? "día" : "días"}`;
}

export function SidebarEspecie({
  campaniaId,
  tipoNecesidad,
  titulo,
  contactosCount,
  objetivoUnidades,
  contactos,
  yaContactado: initialYaContactado,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [yaContactado, setYaContactado] = useState(initialYaContactado);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Especie form state
  const [queVasADonar, setQueVasADonar] = useState("");
  const [comoEntregas, setComoEntregas] = useState<"punto_entrega" | "buscan_a_mi">("punto_entrega");
  const [direccion, setDireccion] = useState("");
  const [cuando, setCuando] = useState("");

  // Voluntariado form state
  const [disponibilidad, setDisponibilidad] = useState("");
  const [descripcionVoluntariado, setDescripcionVoluntariado] = useState("");

  const isEspecie = tipoNecesidad === "especie";

  const labelContactos = isEspecie ? "contactos recientes" : "voluntarios anotados";
  const subModal = isEspecie
    ? "Completá la información para que la ONG te contacte."
    : "Completá tu disponibilidad para que la ONG te contacte.";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let result;
    if (isEspecie) {
      result = await guardarAporteEspecie({
        campaniaId,
        queVasADonar,
        comoEntregas,
        direccion,
        cuando,
      });
    } else {
      result = await guardarAporteVoluntariado({
        campaniaId,
        disponibilidad,
        descripcion: descripcionVoluntariado,
      });
    }

    if ("error" in result) {
      setError(result.error);
      setSubmitting(false);
    } else {
      setYaContactado(true);
      setModalOpen(false);
    }
  }

  return (
    <>
      {/* Sidebar card */}
      <div className="bg-gradient-to-bl from-[#fffbf3] to-[#fff2d8] border border-[#e6dbc5] rounded-[24px] p-8 flex flex-col gap-5 w-[569px] shrink-0 shadow-[0px_1px_4px_rgba(12,12,13,0.1)]">
        {/* Counters */}
        <div className="flex flex-col gap-1">
          <p className="text-[28px] font-semibold text-[#1a1a1a]">
            {contactosCount} {labelContactos}
          </p>
          {objetivoUnidades != null && (
            <p className="text-[28px] font-semibold text-[#1a1a1a] opacity-[0.56]">
              {objetivoUnidades} {isEspecie ? "necesarios" : "cupos disponibles"}
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={() => !yaContactado && setModalOpen(true)}
          disabled={yaContactado}
          className={`flex items-center justify-center h-12 w-full rounded-full text-base font-medium shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors ${
            yaContactado
              ? "bg-[#febd30]/60 text-[#510d09] cursor-default opacity-80"
              : "bg-[#febd30] text-[#510d09] hover:bg-[#febd30]/90"
          }`}
        >
          {yaContactado ? "Ya te contactaste con la ONG" : "Quiero donar"}
        </button>

        {/* Contactos recientes */}
        {contactos.length > 0 && (
          <div className="flex flex-col gap-3 pt-1 border-t border-[#e6dbc5]">
            <p className="text-[16px] font-medium text-[#1a1a1a] opacity-[0.56] pt-2">
              Contactos recientes
            </p>
            <div className="flex flex-col gap-3">
              {contactos.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-full border border-[rgba(254,189,48,0.1)] bg-muted overflow-hidden shrink-0">
                    <span className="text-[14px] font-bold text-[#510d09]/30">
                      {c.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[16px] font-bold text-[#1a1a1a] leading-[1.4]">{c.nombre}</p>
                    <p className="text-[13px] text-[#767676]">{timeAgo(c.fecha)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setModalOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-[24px] p-8 w-full max-w-[540px] flex flex-col gap-6 shadow-xl z-10">
            {/* Cerrar */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[rgba(81,13,9,0.4)] hover:text-[#510d09] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div>
              <h2 className="text-[20px] font-bold text-[#510d09]">{titulo}</h2>
              <p className="text-[14px] text-[rgba(81,13,9,0.55)] mt-1">{subModal}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {isEspecie ? (
                <>
                  {/* Qué vas a donar */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      ¿Qué vas a donar?
                    </label>
                    <textarea
                      required
                      value={queVasADonar}
                      onChange={(e) => setQueVasADonar(e.target.value)}
                      placeholder="Contanos qué te interesa donar con el mayor detalle posible"
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-[14px] border border-[#e6dbc5] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[#febd30] resize-none transition-colors"
                    />
                  </div>

                  {/* Cómo lo entregás */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      ¿Cómo lo entregás?
                    </label>
                    <div className="flex flex-col gap-2">
                      {(
                        [
                          { value: "punto_entrega", label: "Lo llevo a un punto de entrega" },
                          { value: "buscan_a_mi", label: "Quiero que pasen a buscarlo" },
                        ] as const
                      ).map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setComoEntregas(value)}
                          className={`flex items-center gap-3 h-[52px] px-5 rounded-[14px] border text-[14px] font-medium transition-colors text-left ${
                            comoEntregas === value
                              ? "border-[#febd30] bg-[#febd30]/10 text-[#510d09]"
                              : "border-[#e6dbc5] bg-white text-[#510d09] hover:border-[#febd30]/60"
                          }`}
                        >
                          <div
                            className={`w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0 ${
                              comoEntregas === value
                                ? "border-[#febd30]"
                                : "border-[#e6dbc5]"
                            }`}
                          >
                            {comoEntregas === value && (
                              <div className="w-[8px] h-[8px] rounded-full bg-[#febd30]" />
                            )}
                          </div>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, número, piso y depto."
                      className="h-[48px] px-4 bg-white rounded-[14px] border border-[#e6dbc5] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[#febd30] transition-colors"
                    />
                  </div>

                  {/* Cuándo */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      ¿Cuándo lo podés llevar?
                    </label>
                    <input
                      type="text"
                      value={cuando}
                      onChange={(e) => setCuando(e.target.value)}
                      placeholder="Ej: lunes y miércoles de 10 a 18hs"
                      className="h-[48px] px-4 bg-white rounded-[14px] border border-[#e6dbc5] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[#febd30] transition-colors"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Voluntariado: disponibilidad */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      ¿Cuándo disponés?
                    </label>
                    <input
                      type="text"
                      required
                      value={disponibilidad}
                      onChange={(e) => setDisponibilidad(e.target.value)}
                      placeholder="Ej: fines de semana, tardes entre semana..."
                      className="h-[48px] px-4 bg-white rounded-[14px] border border-[#e6dbc5] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[#febd30] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#510d09]">
                      ¿Qué podés aportar?
                    </label>
                    <textarea
                      required
                      value={descripcionVoluntariado}
                      onChange={(e) => setDescripcionVoluntariado(e.target.value)}
                      placeholder="Contanos tus habilidades o experiencia relevante"
                      rows={3}
                      className="w-full px-4 py-3 bg-white rounded-[14px] border border-[#e6dbc5] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.35)] outline-none focus:border-[#febd30] resize-none transition-colors"
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-[13px] text-red-600 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center h-12 w-full rounded-full bg-[#febd30] text-[#510d09] text-base font-medium hover:bg-[#febd30]/90 disabled:opacity-50 transition-colors shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
              >
                {submitting ? "Enviando..." : "Confirmar donación"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
