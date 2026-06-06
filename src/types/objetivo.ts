export type TipoObjetivo = 'plata' | 'especie' | 'voluntariado'
export type EstadoObjetivo = 'en_curso' | 'cumplido' | 'sin_meta'

export interface ObjetivoDonante {
  id: string
  donante_id: string
  anio: number
  tipo: TipoObjetivo
  meta_cantidad: number | null
  meta_monto: number | null
  progreso_cantidad: number
  progreso_monto: number
  estado: EstadoObjetivo
}
