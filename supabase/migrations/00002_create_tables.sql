CREATE TABLE ong (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  logo_url TEXT,
  descripcion TEXT NOT NULL,
  mp_account_id TEXT,
  tipos_donacion_habilitados tipo_donacion[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE campania (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id UUID NOT NULL REFERENCES ong(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  imagen_url TEXT,
  descripcion TEXT NOT NULL,
  audio_url TEXT,
  tipo_necesidad tipo_necesidad NOT NULL,
  target_donante target_donante NOT NULL DEFAULT 'persona',
  fecha_limite TIMESTAMPTZ,
  urgencia INT DEFAULT 3 CHECK (urgencia BETWEEN 1 AND 5),
  estado estado_campania DEFAULT 'activa',
  local_id UUID UNIQUE,
  sync_estado sync_estado DEFAULT 'sincronizada',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE item_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campania_id UUID NOT NULL REFERENCES campania(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  nuevo_o_usado TEXT DEFAULT 'nuevo',
  vencimiento TIMESTAMPTZ
);

CREATE TABLE donante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo tipo_donante NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  nombre TEXT,
  apellido TEXT,
  intereses TEXT[] DEFAULT '{}',
  nombre_empresa TEXT,
  razon_social TEXT,
  cuit TEXT,
  rubro TEXT,
  objetivo TEXT,
  mail_contacto TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE aporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donante_id UUID NOT NULL REFERENCES donante(id) ON DELETE CASCADE,
  campania_id UUID REFERENCES campania(id) ON DELETE SET NULL,
  tipo tipo_aporte NOT NULL,
  monto DECIMAL(10,2),
  modalidad modalidad_aporte,
  estado estado_aporte DEFAULT 'pendiente',
  mp_payment_id TEXT,
  fecha TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE donacion_general (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ong_id UUID NOT NULL REFERENCES ong(id) ON DELETE CASCADE,
  donante_id UUID NOT NULL REFERENCES donante(id) ON DELETE CASCADE,
  modalidad modalidad_general NOT NULL,
  monto DECIMAL(10,2),
  mp_subscription_id TEXT,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE objetivo_donante (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donante_id UUID NOT NULL REFERENCES donante(id) ON DELETE CASCADE,
  anio INT NOT NULL,
  tipo tipo_objetivo NOT NULL,
  meta_cantidad INT,
  meta_monto DECIMAL(10,2),
  progreso_cantidad INT DEFAULT 0,
  progreso_monto DECIMAL(10,2) DEFAULT 0,
  estado estado_objetivo DEFAULT 'sin_meta',
  UNIQUE(donante_id, anio, tipo)
);
