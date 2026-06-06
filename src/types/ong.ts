export type TipoDonacion = 'plata' | 'especie' | 'voluntariado' | 'general'

export interface Ong {
  id: string
  user_id: string
  nombre: string
  logo_url: string | null
  descripcion: string
  mp_account_id: string | null
  tipos_donacion_habilitados: TipoDonacion[]
  created_at: string
}
