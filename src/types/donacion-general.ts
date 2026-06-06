export type ModalidadGeneral = 'unica' | 'suscripcion' | 'recursos'

export interface DonacionGeneral {
  id: string
  ong_id: string
  donante_id: string
  modalidad: ModalidadGeneral
  monto: number | null
  mp_subscription_id: string | null
  estado: string
  created_at: string
}
