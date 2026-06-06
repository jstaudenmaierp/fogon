export type TipoNecesidad = 'plata' | 'especie' | 'voluntariado'
export type TargetDonante = 'persona' | 'empresa'
export type EstadoCampania = 'activa' | 'cerrada' | 'eliminada'
export type SyncEstado = 'pendiente' | 'sincronizada'

export interface Campania {
  id: string
  ong_id: string
  titulo: string
  imagen_url: string | null
  descripcion: string
  audio_url: string | null
  tipo_necesidad: TipoNecesidad
  target_donante: TargetDonante
  fecha_limite: string | null
  urgencia: number  // 1-5
  estado: EstadoCampania
  local_id: string | null
  sync_estado: SyncEstado
  created_at: string
}

export interface ItemPedido {
  id: string
  campania_id: string
  nombre: string
  cantidad: number
  nuevo_o_usado: 'nuevo' | 'usado'
  vencimiento: string | null
}
