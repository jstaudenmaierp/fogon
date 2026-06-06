import type { StepProps } from "../types";

const input =
  "flex-1 h-[51px] px-[17.5px] bg-white rounded-[14px] border-[1.5px] border-[rgba(81,13,9,0.15)] text-[14px] text-[#1a1a1a] placeholder:text-[rgba(81,13,9,0.5)] outline-none focus:border-[rgba(81,13,9,0.4)] transition-colors";

export function StepIdentidad({ data, onUpdate, onNext }: StepProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[12px] w-full">
      <div className="flex gap-[12px]">
        <input
          type="text"
          required
          autoFocus
          value={data.nombre}
          onChange={(e) => onUpdate({ nombre: e.target.value })}
          placeholder="Nombre"
          className={input}
        />
        <input
          type="text"
          required
          value={data.apellido}
          onChange={(e) => onUpdate({ apellido: e.target.value })}
          placeholder="Apellido"
          className={input}
        />
      </div>

      <input
        type="email"
        readOnly
        value={data.email}
        tabIndex={-1}
        className={input + " w-full flex-none opacity-60 cursor-default select-none"}
      />

      <button
        type="submit"
        disabled={!data.nombre.trim() || !data.apellido.trim()}
        className="w-full h-[56px] rounded-[16px] bg-[#510d09] text-[#febd30] text-[16px] font-semibold disabled:opacity-40 hover:bg-[#6b1109] transition-colors mt-[4px]"
      >
        Continuar
      </button>
    </form>
  );
}
