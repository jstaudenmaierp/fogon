export type TipoDonante = 'persona' | 'empresa'

export interface DonanteBase {
  id: string
  user_id: string
  tipo: TipoDonante
  email: string
  telefono: string | null
  created_at: string
}

export interface DonantePersona extends DonanteBase {
  tipo: 'persona'
  nombre: string
  apellido: string
  intereses: string[]
}

export interface DonanteEmpresa extends DonanteBase {
  tipo: 'empresa'
  nombre_empresa: string
  razon_social: string
  cuit: string
  rubro: string
  objetivo: string | null
  mail_contacto: string
}

export type Donante = DonantePersona | DonanteEmpresa
