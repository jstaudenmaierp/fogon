export type TipoAporte = 'plata' | 'especie' | 'voluntariado'
export type ModalidadAporte = 'unica' | 'suscripcion'
export type EstadoAporte = 'pendiente' | 'confirmado' | 'a_coordinar'

export interface Aporte {
  id: string
  donante_id: string
  campania_id: string | null
  tipo: TipoAporte
  monto: number | null
  modalidad: ModalidadAporte | null
  estado: EstadoAporte
  mp_payment_id: string | null
  fecha: string
}
