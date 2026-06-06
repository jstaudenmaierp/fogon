import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  decimal,
  pgEnum,
} from 'drizzle-orm/pg-core'

// Enums
export const tipoDonacionEnum = pgEnum('tipo_donacion', [
  'plata', 'especie', 'voluntariado', 'general',
])

export const tipoNecesidadEnum = pgEnum('tipo_necesidad', [
  'plata', 'especie', 'voluntariado',
])

export const targetDonanteEnum = pgEnum('target_donante', [
  'persona', 'empresa',
])

export const estadoCampaniaEnum = pgEnum('estado_campania', [
  'activa', 'cerrada', 'eliminada',
])

export const syncEstadoEnum = pgEnum('sync_estado', [
  'pendiente', 'sincronizada',
])

export const tipoDonanteEnum = pgEnum('tipo_donante', [
  'persona', 'empresa',
])

export const tipoAporteEnum = pgEnum('tipo_aporte', [
  'plata', 'especie', 'voluntariado',
])

export const modalidadAporteEnum = pgEnum('modalidad_aporte', [
  'unica', 'suscripcion',
])

export const estadoAporteEnum = pgEnum('estado_aporte', [
  'pendiente', 'confirmado', 'a_coordinar',
])

export const modalidadGeneralEnum = pgEnum('modalidad_general', [
  'unica', 'suscripcion', 'recursos',
])

export const tipoObjetivoEnum = pgEnum('tipo_objetivo', [
  'plata', 'especie', 'voluntariado',
])

export const estadoObjetivoEnum = pgEnum('estado_objetivo', [
  'en_curso', 'cumplido', 'sin_meta',
])

export const interesDonanteEnum = pgEnum('interes_donante', [
  'educacion', 'salud', 'ambiental', 'alimentacion',
  'infancias', 'cultura', 'habitat', 'animales', 'politicas_publicas',
])

// Tables
export const ong = pgTable('ong', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => authUsers.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  logoUrl: text('logo_url'),
  descripcion: text('descripcion').notNull(),
  mpAccountId: text('mp_account_id'),
  tiposDonacionHabilitados: tipoDonacionEnum('tipos_donacion_habilitados').array().default([]),
  instagramUrl: text('instagram_url'),
  facebookUrl: text('facebook_url'),
  twitterUrl: text('twitter_url'),
  linkedinUrl: text('linkedin_url'),
  youtubeUrl: text('youtube_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const campania = pgTable('campania', {
  id: uuid('id').defaultRandom().primaryKey(),
  ongId: uuid('ong_id').notNull().references(() => ong.id, { onDelete: 'cascade' }),
  titulo: text('titulo').notNull(),
  imagenUrl: text('imagen_url'),
  descripcion: text('descripcion').notNull(),
  audioUrl: text('audio_url'),
  tipoNecesidad: tipoNecesidadEnum('tipo_necesidad').notNull(),
  targetDonante: targetDonanteEnum('target_donante').notNull().default('persona'),
  fechaLimite: timestamp('fecha_limite', { withTimezone: true }),
  urgencia: integer('urgencia').default(3),
  estado: estadoCampaniaEnum('estado').default('activa'),
  localId: uuid('local_id').unique(),
  syncEstado: syncEstadoEnum('sync_estado').default('sincronizada'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const itemPedido = pgTable('item_pedido', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaniaId: uuid('campania_id').notNull().references(() => campania.id, { onDelete: 'cascade' }),
  nombre: text('nombre').notNull(),
  cantidad: integer('cantidad').notNull().default(1),
  nuevoUsado: text('nuevo_o_usado').default('nuevo'),
  vencimiento: timestamp('vencimiento', { withTimezone: true }),
})

export const donante = pgTable('donante', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => authUsers.id, { onDelete: 'cascade' }),
  tipo: tipoDonanteEnum('tipo').notNull(),
  email: text('email').notNull(),
  telefono: text('telefono'),
  nombre: text('nombre'),
  apellido: text('apellido'),
  intereses: interesDonanteEnum('intereses').array().default([]),
  nombreEmpresa: text('nombre_empresa'),
  razonSocial: text('razon_social'),
  cuit: text('cuit'),
  rubro: text('rubro'),
  objetivo: text('objetivo'),
  mailContacto: text('mail_contacto'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const aporte = pgTable('aporte', {
  id: uuid('id').defaultRandom().primaryKey(),
  donanteId: uuid('donante_id').notNull().references(() => donante.id, { onDelete: 'cascade' }),
  campaniaId: uuid('campania_id').references(() => campania.id, { onDelete: 'set null' }),
  tipo: tipoAporteEnum('tipo').notNull(),
  monto: decimal('monto', { precision: 10, scale: 2 }),
  modalidad: modalidadAporteEnum('modalidad'),
  estado: estadoAporteEnum('estado').default('pendiente'),
  mpPaymentId: text('mp_payment_id'),
  fecha: timestamp('fecha', { withTimezone: true }).defaultNow(),
})

export const donacionGeneral = pgTable('donacion_general', {
  id: uuid('id').defaultRandom().primaryKey(),
  ongId: uuid('ong_id').notNull().references(() => ong.id, { onDelete: 'cascade' }),
  donanteId: uuid('donante_id').notNull().references(() => donante.id, { onDelete: 'cascade' }),
  modalidad: modalidadGeneralEnum('modalidad').notNull(),
  monto: decimal('monto', { precision: 10, scale: 2 }),
  mpSubscriptionId: text('mp_subscription_id'),
  estado: text('estado').default('pendiente'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const objetivoDonante = pgTable('objetivo_donante', {
  id: uuid('id').defaultRandom().primaryKey(),
  donanteId: uuid('donante_id').notNull().references(() => donante.id, { onDelete: 'cascade' }),
  anio: integer('anio').notNull(),
  tipo: tipoObjetivoEnum('tipo').notNull(),
  metaCantidad: integer('meta_cantidad'),
  metaMonto: decimal('meta_monto', { precision: 10, scale: 2 }),
  progresoCantidad: integer('progreso_cantidad').default(0),
  progresoMonto: decimal('progreso_monto', { precision: 10, scale: 2 }).default(0),
  estado: estadoObjetivoEnum('estado').default('sin_meta'),
})

// Reference to auth.users (Supabase)
const authUsers = pgTable('auth.users', {
  id: uuid('id').primaryKey(),
})
