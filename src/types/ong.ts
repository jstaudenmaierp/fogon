export type TipoDonacion = 'plata' | 'especie' | 'voluntariado' | 'general'

export interface Ong {
  id: string
  user_id: string
  nombre: string
  logo_url: string | null
  descripcion: string
  mp_account_id: string | null
  tipos_donacion_habilitados: TipoDonacion[]
  instagram_url: string | null
  facebook_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
  razon_social: string | null
  cuit: string | null
  created_at: string
}
