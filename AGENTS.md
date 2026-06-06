# FOGON — AGENTS.md

> **Proyecto**: fogon — Plataforma que conecta ONGs con donantes (personas/empresas)
> **Hackathon**: Paisanos × Crecimiento Build | Track 2
> **Owner**: Juli | **Stack**: Next.js 14 + Supabase + shadcn/ui + Mercado Pago

---

## 1. Project Context

**Qué es fogon**: Plataforma donde ONGs se dan de alta, publican necesidades/campañas
(plata, especie, voluntariado) y reciben aportes. Donantes descubren causas, eligen una
y aportan. Donaciones de plata se procesan con Mercado Pago; especie y voluntariado se
registran para que la ONG coordine.

**Por qué**: ONGs argentinas dependen de cooperación internacional y grants. Necesitan
diversificar hacia donantes individuales pero no tienen infraestructura para captarlos
ni gestionarlos.

**Actores**:
- **ONG** — organización que publica campañas y gestiona donaciones
- **Donante Persona** — individuo que dona plata/especie/tiempo
- **Donante Empresa** — empresa con perfil corporativo

**Objetivo del demo**: una ONG publica una campaña de plata, un donante la descubre desde
el home y dona vía Mercado Pago, y la ONG lo ve en su tabla de donantes.

---

## 2. Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND (Next.js 14)           │
│    App Router + shadcn/ui + Tailwind    │
├─────────────────────────────────────────┤
│      EDGE FUNCTIONS (Supabase)          │
│   Webhooks MP, sync offline, auth       │
├─────────────────────────────────────────┤
│      DATABASE (Supabase Postgres)       │
│    RLS por auth.uid(), multi-tenant     │
├─────────────────────────────────────────┤
│      EXTERNAL SERVICES                  │
│   Mercado Pago (Checkout + Preapproval) │
└─────────────────────────────────────────┘
```

### Decisiones clave

| Decisión | Elección | Por qué |
|----------|----------|---------|
| Access control | RLS en Supabase | Cada query filtra por `auth.uid()`. Sin middleware custom. |
| Webhooks MP | Edge Functions | Recepción de confirmación de pago, actualización de estado. |
| Offline | PWA + IndexedDB | Solo form de campaña ONG. Cola de sync idempotente. |
| Multi-tenant | `ong_id` en tablas | Todas las tablas de negocio tienen FK a `ong`. |
| State management | Server Components | Datos se fetchen en server, no hay estado global client-side. |

---

## 3. Spec-Driven Development Workflow

**Regla de oro**: Nunca escribir implementación sin types definidos primero.

### Flujo por task

```
1. DEFINIR TYPES      → src/types/         (source of truth)
2. DEFINIR SCHEMA     → supabase/migrations/ (SQL)
3. DEFINIR COMPONENTS  → src/components/     (props interface)
4. DEFINIR PAGES       → src/app/            (routing + data fetching)
5. IMPLEMENTAR         → código contra las specs anteriores
6. VERIFICAR           → npm run typecheck && npm run lint
```

### Qué significa en la práctica

- **Primero los types**: Cada entidad del dominio se define como TypeScript type/interface
  en `src/types/`. Estos types son el contrato que todo el código respeta.
- **Después el schema SQL**: El schema de Supabase se deriva de los types. Cada tabla,
  cada columna, cada constraint está documentado en SQL.
- **Los componentes definen sus props**: Antes de escribir JSX, definir la interface de
  props del componente. El componente implementa contra esa interface.
- **Las pages orquestan**: Las pages combinan components, hooks y data fetching. Usan
  los types definidos.
- **Implementar es el último paso**: Recién después de types + schema + interfaces se
  escribe la lógica.

### Por qué

- Cualquier agente puede pick up el proyecto sin contexto previo
- Los types documentan las decisiones de diseño
- Refactors son seguros (TypeScript catcha inconsistencias)
- Testing es trivial (mock against types, no against implementations)

---

## 4. File Structure

```
fogon/
├── AGENTS.md
├── PRD.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 00001_create_enums.sql
│       ├── 00002_create_tables.sql
│       ├── 00003_create_rls.sql
│       └── 00004_seed_demo.sql
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                              # Home
│   │   ├── ong/
│   │   │   ├── nueva/page.tsx                    # Alta ONG
│   │   │   └── [id]/
│   │   │       ├── page.tsx                      # Landing ONG
│   │   │       └── campanas/
│   │   │           ├── nueva/page.tsx             # Crear campaña
│   │   │           └── [id]/
│   │   │               ├── page.tsx              # Dashboard campaña
│   │   │               └── donantes/page.tsx     # Tabla de donantes
│   │   ├── donante/
│   │   │   ├── registro/page.tsx                 # Alta donante
│   │   │   └── [id]/page.tsx                     # Perfil donante
│   │   └── api/
│   │       └── webhooks/
│   │           └── mercadopago/route.ts          # Webhook MP
│   ├── components/
│   │   ├── ui/                                   # shadcn/ui (Button, Card, etc.)
│   │   ├── campaign-card.tsx
│   │   ├── ong-card.tsx
│   │   ├── donor-table.tsx
│   │   ├── donation-form.tsx
│   │   ├── cart-especie.tsx
│   │   ├── voice-dictation.tsx
│   │   ├── image-uploader.tsx
│   │   ├── annual-goal-tracker.tsx
│   │   ├── connection-status-banner.tsx
│   │   └── urgency-badge.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                         # Browser client
│   │   │   ├── server.ts                         # Server client (cookies)
│   │   │   └── admin.ts                          # Service role (edge fn)
│   │   ├── mercadopago.ts                        # MP SDK wrapper
│   │   └── utils.ts                              # cn(), formatDate(), etc.
│   ├── hooks/
│   │   ├── use-campaigns.ts
│   │   ├── use-donors.ts
│   │   └── use-offline-sync.ts
│   ├── types/
│   │   ├── database.ts                           # Generated from schema
│   │   ├── ong.ts
│   │   ├── campania.ts
│   │   ├── donante.ts
│   │   ├── aporte.ts
│   │   ├── donacion-general.ts
│   │   ├── objetivo.ts
│   │   └── index.ts                              # Re-exports
│   └── middleware.ts                             # Auth redirect
├── public/
│   └── icons/
└── docs/
    └── superpowers/
        ├── plans/
        └── specs/
```

---

## 5. Types (Source of Truth)

### `src/types/ong.ts`

```typescript
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
```

### `src/types/campania.ts`

```typescript
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
```

### `src/types/donante.ts`

```typescript
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
```

### `src/types/aporte.ts`

```typescript
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
```

### `src/types/donacion-general.ts`

```typescript
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
```

### `src/types/objetivo.ts`

```typescript
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
```

### `src/types/index.ts`

```typescript
export * from './ong'
export * from './campania'
export * from './donante'
export * from './aporte'
export * from './donacion-general'
export * from './objetivo'
```

---

## 6. Database Schema

### Migración 00001: Enums

```sql
CREATE TYPE tipo_donacion AS ENUM ('plata', 'especie', 'voluntariado', 'general');
CREATE TYPE tipo_necesidad AS ENUM ('plata', 'especie', 'voluntariado');
CREATE TYPE target_donante AS ENUM ('persona', 'empresa');
CREATE TYPE estado_campania AS ENUM ('activa', 'cerrada', 'eliminada');
CREATE TYPE sync_estado AS ENUM ('pendiente', 'sincronizada');
CREATE TYPE tipo_donante AS ENUM ('persona', 'empresa');
CREATE TYPE tipo_aporte AS ENUM ('plata', 'especie', 'voluntariado');
CREATE TYPE modalidad_aporte AS ENUM ('unica', 'suscripcion');
CREATE TYPE estado_aporte AS ENUM ('pendiente', 'confirmado', 'a_coordinar');
CREATE TYPE modalidad_general AS ENUM ('unica', 'suscripcion', 'recursos');
CREATE TYPE tipo_objetivo AS ENUM ('plata', 'especie', 'voluntariado');
CREATE TYPE estado_objetivo AS ENUM ('en_curso', 'cumplido', 'sin_meta');
```

### Migración 00002: Tables

```sql
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
```

### Migración 00003: RLS Policies

```sql
ALTER TABLE ong ENABLE ROW LEVEL SECURITY;
ALTER TABLE campania ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE donante ENABLE ROW LEVEL SECURITY;
ALTER TABLE aporte ENABLE ROW LEVEL SECURITY;
ALTER TABLE donacion_general ENABLE ROW LEVEL SECURITY;
ALTER TABLE objetivo_donante ENABLE ROW LEVEL SECURITY;

-- ONG
CREATE POLICY "ONG select own" ON ong FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ONG insert own" ON ong FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ONG update own" ON ong FOR UPDATE USING (auth.uid() = user_id);

-- Campaña
CREATE POLICY "Campaña public read" ON campania FOR SELECT USING (estado = 'activa');
CREATE POLICY "Campaña ONG manage" ON campania FOR ALL USING (
  ong_id IN (SELECT id FROM ong WHERE user_id = auth.uid())
);

-- Item pedido
CREATE POLICY "Item pedido public read" ON item_pedido FOR SELECT
  USING (campania_id IN (SELECT id FROM campania WHERE estado = 'activa'));
CREATE POLICY "Item pedido ONG manage" ON item_pedido FOR ALL
  USING (campania_id IN (
    SELECT c.id FROM campania c JOIN ong o ON c.ong_id = o.id
    WHERE o.user_id = auth.uid()
  ));

-- Donante
CREATE POLICY "Donante select own" ON donante FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Donante insert own" ON donante FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Donante update own" ON donante FOR UPDATE USING (auth.uid() = user_id);

-- Aporte
CREATE POLICY "Aporte donante read own" ON aporte FOR SELECT
  USING (donante_id IN (SELECT id FROM donante WHERE user_id = auth.uid()));
CREATE POLICY "Aporte ONG read" ON aporte FOR SELECT
  USING (campania_id IN (
    SELECT c.id FROM campania c JOIN ong o ON c.ong_id = o.id
    WHERE o.user_id = auth.uid()
  ));
CREATE POLICY "Aporte donante insert" ON aporte FOR INSERT
  WITH CHECK (donante_id IN (SELECT id FROM donante WHERE user_id = auth.uid()));

-- Donación general
CREATE POLICY "Donacion general donante read" ON donacion_general FOR SELECT
  USING (donante_id IN (SELECT id FROM donante WHERE user_id = auth.uid()));
CREATE POLICY "Donacion general ONG read" ON donacion_general FOR SELECT
  USING (ong_id IN (SELECT id FROM ong WHERE user_id = auth.uid()));

-- Objetivo
CREATE POLICY "Objetivo donante own" ON objetivo_donante FOR ALL
  USING (donante_id IN (SELECT id FROM donante WHERE user_id = auth.uid()));
```

### Migración 00004: Indexes + Seed

```sql
CREATE INDEX idx_campania_ong ON campania(ong_id);
CREATE INDEX idx_campania_estado ON campania(estado);
CREATE INDEX idx_aporte_donante ON aporte(donante_id);
CREATE INDEX idx_aporte_campania ON aporte(campania_id);
CREATE INDEX idx_objetivo_donante_anio ON objetivo_donante(donante_id, anio);

-- Seed demo data
INSERT INTO ong (id, user_id, nombre, logo_url, descripcion, mp_account_id, tipos_donacion_habilitados) VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Fundación Manos Abiertas', '/icons/ong1.png', 'Ayudamos a comunidades del norte argentino con educación y alimentación.', 'mp_ong1', '{plata,especie,voluntariado}'),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'Red de Solidaridad', '/icons/ong2.png', 'Red de apoyo mutuo para familias en situación de vulnerabilidad.', 'mp_ong2', '{plata,voluntariado}');

INSERT INTO campania (id, ong_id, titulo, imagen_url, descripcion, tipo_necesidad, target_donante, urgencia, estado) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Útiles escolares para Formosa', '/images/campania1.jpg', 'Necesitamos recolectar fondos para comprar útiles escolares para 200 niños.', 'plata', 'persona', 4, 'activa'),
  ('aaaa2222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Comida para el comedor', '/images/campania2.jpg', 'El comedor comunitario necesita alimentos no perecederos.', 'especie', 'persona', 5, 'activa'),
  ('aaaa3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Voluntariado en la biblioteca', '/images/campania3.jpg', 'Buscamos voluntarios para ayudar en la biblioteca comunitaria los sábados.', 'voluntariado', 'persona', 2, 'activa'),
  ('aaaa4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Recaudación para refacción del techo', '/images/campania4.jpg', 'La sede necesita una nueva techo urgente.', 'plata', 'empresa', 5, 'activa');

INSERT INTO item_pedido (campania_id, nombre, cantidad, nuevo_o_usado) VALUES
  ('aaaa2222-2222-2222-2222-222222222222', 'Arroz', 10, 'nuevo'),
  ('aaaa2222-2222-2222-2222-222222222222', 'Fideos', 10, 'nuevo'),
  ('aaaa2222-2222-2222-2222-222222222222', 'Aceite', 5, 'nuevo'),
  ('aaaa2222-2222-2222-2222-222222222222', 'Leche', 20, 'nuevo');

INSERT INTO donante (id, user_id, tipo, email, nombre, apellido, intereses) VALUES
  ('dddd1111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'persona', 'maria@email.com', 'María', 'González', '{educación,alimentación}'),
  ('dddd2222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000004', 'empresa', 'contacto@techcorp.com', NULL, NULL, NULL);

UPDATE donante SET nombre_empresa = 'TechCorp', razon_social = 'TechCorp S.A.', cuit = '30-71234567-9', rubro = 'Tecnología', mail_contacto = 'contacto@techcorp.com' WHERE id = 'dddd2222-2222-2222-2222-222222222222';

INSERT INTO aporte (donante_id, campania_id, tipo, monto, modalidad, estado, mp_payment_id) VALUES
  ('dddd1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'plata', 5000.00, 'unica', 'confirmado', 'mp_pay_001'),
  ('dddd1111-1111-1111-1111-111111111111', 'aaaa2222-2222-2222-2222-222222222222', 'especie', NULL, NULL, 'a_coordinar', NULL),
  ('dddd2222-2222-2222-2222-222222222222', 'aaaa4444-4444-4444-4444-444444444444', 'plata', 50000.00, 'unica', 'confirmado', 'mp_pay_002');

INSERT INTO objetivo_donante (donante_id, anio, tipo, meta_cantidad, meta_monto, progreso_cantidad, progreso_monto, estado) VALUES
  ('dddd1111-1111-1111-1111-111111111111', 2026, 'plata', NULL, 50000.00, 0, 5000.00, 'en_curso'),
  ('dddd1111-1111-1111-1111-111111111111', 2026, 'especie', 3, NULL, 1, 0, 'en_curso');
```

---

## 7. Screens & Routing

| Screen | Path | Auth Required | Descripción |
|--------|------|---------------|-------------|
| Home | `/` | No | ONGs + campañas activas ordenadas por prioridad |
| Landing ONG | `/ong/[id]` | No | Perfil ONG + causas activas + pasadas + CTA donar |
| Alta ONG | `/ong/nueva` | Yes (ONG) | Form: logo, nombre, descripción, vincular MP, tipos donación |
| Crear campaña | `/ong/[id]/campanas/nueva` | Yes (ONG) | Form: imagen, título, descripción, urgencia, tipo |
| Dashboard campaña | `/ong/[id]/campanas/[id]` | Yes (ONG) | Editar, cerrar, eliminar, ver donantes |
| Tabla donantes | `/ong/[id]/campanas/[id]/donantes` | Yes (ONG) | Lista de aportes + datos del donante |
| Alta donante | `/donante/registro` | Yes (Donante) | Form: persona o empresa |
| Perfil donante | `/donante/[id]` | Yes (Donante) | Perfil + objetivos anuales + tracker |
| Webhook MP | `/api/webhooks/mercadopago` | Webhook | POST handler para confirmaciones MP |

---

## 8. Components Catalog

| Componente | Props Interface | Ubicación de uso |
|------------|----------------|------------------|
| `CampaignCard` | `{ campania: Campania, ong?: Ong }` | Home, Landing ONG |
| `ONGCard` | `{ ong: Ong }` | Home |
| `DonorTable` | `{ aportes: (Aporte & { donante: Donante })[] }` | Dashboard campaña |
| `DonationForm` | `{ campania: Campania, tipo: TipoAporte, onSuccess: () => void }` | Campaña + General |
| `CartEspecie` | `{ items: ItemPedido[], onConfirm: (selected: ItemPedido[]) => void }` | Campaña especie |
| `VoiceDictation` | `{ onTranscript: (text: string) => void }` | Crear campaña |
| `ImageUploader` | `{ onUpload: (url: string) => void, folder: string }` | Forms con imagen |
| `AnnualGoalTracker` | `{ objetivos: ObjetivoDonante[] }` | Perfil donante |
| `ConnectionStatusBanner` | `{ syncEstado: SyncEstado }` | Lista campañas (offline) |
| `UrgencyBadge` | `{ level: 1 \| 2 \| 3 \| 4 \| 5 }` | CampaignCard |

---

## 9. Forms & Validations

### Form: Alta de ONG

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| logo | image upload | max 5MB, jpg/png | No |
| nombre | text | min 3, max 100 | Sí |
| descripcion | textarea | min 10, max 500 | Sí |
| mp_account_id | text (MP connect) | formato MP | Sí |
| tipos_donacion | multi-select | al menos 1 | Sí |

### Form: Crear campaña

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| imagen | image upload | max 5MB, jpg/png | No |
| titulo | text | min 5, max 150 | Sí |
| descripcion | textarea / voice | min 10, max 2000 | Sí |
| tipo_necesidad | select | plata \| especie \| voluntariado | Sí |
| target_donante | select | persona \| empresa | Sí |
| fecha_limite | date | >= hoy | No |
| urgencia | slider | 1-5 | Sí (default 3) |

### Form: Alta donante persona

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| nombre | text | min 2 | Sí |
| apellido | text | min 2 | Sí |
| email | email | formato email | Sí |
| telefono | tel | formato AR | No |
| intereses | multi-select | opcional | No |

### Form: Alta donante empresa

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| nombre_empresa | text | min 3 | Sí |
| razon_social | text | min 3 | Sí |
| cuit | text | formato CUIT (XX-XXXXXXXX-X) | Sí |
| rubro | text | min 2 | Sí |
| email | email | formato email | Sí |
| mail_contacto | email | formato email | Sí |
| objetivo | textarea | max 500 | No |

### Form: Donación especie (carrito)

| Campo | Tipo | Validación | Requerido |
|-------|------|------------|-----------|
| items seleccionados | checkbox list | al menos 1 | Sí |
| movilidad | select | sí/no | Sí |
| nuevos_usados | por item | nuevo \| usado | Sí |
| vencimiento | date (si aplica) | >= hoy | Condicional |

---

## 10. States & Enums

### Estados de campaña
```
activa    → campañ visible públicamente, recibe donaciones
cerrada   → no recibe donaciones, visible como "pasada" (social proof)
eliminada → soft delete, no visible
```

### Estados de aporte
```
pendiente    → donación initiada, esperando confirmación MP
confirmado   → MP confirmó el pago
a_coordinar  → especie o voluntariado, ONG debe contactar al donante
```

### Estados de sync (offline)
```
pendiente     → guardada localmente, esperando reconexión
sincronizada  → confirmada en Supabase
```

### Estados de objetivo
```
en_curso  → tiene meta seteada y progreso < meta
cumplido  → progreso >= meta
sin_meta  → nunca seteó ese tipo de objetivo
```

### Urgencia (1-5)
```
1 = baja
2 = media-baja
3 = media (default)
4 = alta
5 = crítica
```

---

## 11. Conventions

### Naming
- **Archivos**: `kebab-case` → `campaign-card.tsx`, `use-offline-sync.ts`
- **Componentes**: `PascalCase` → `CampaignCard`, `DonorTable`
- **Funciones/hooks**: `camelCase` → `useCampaigns()`, `formatDate()`
- **Types/Interfaces**: `PascalCase` → `Campania`, `DonantePersona`
- **Enums**: `snake_case` en DB, `camelCase` en TypeScript
- **Routes**: `kebab-case` en URLs → `/ong/nueva`, `/donante/registro`

### Code Style
- **Server Components** por defecto en `src/app/`
- **`'use client'`** solo cuando: tiene estado, useEffect, handlers de evento, browser APIs
- **Imports**: usar `@/` alias → `import { Ong } from '@/types'`
- **Supabase queries**: en Server Components para data fetching inicial
- **Hooks**: solo para data que necesita refetch o real-time en client
- **Error boundaries**: por route segment con `error.tsx`
- **Tailwind** sin CSS modules, sin styled-components
- **shadcn/ui**: importar de `@/components/ui/` — no instalar componentes duplicados

### Patterns
```typescript
// Server Component (default)
export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data } = await supabase.from('campania').select('*').eq('ong_id', params.id)
  return <CampaignList campaigns={data} />
}

// Client Component (when needed)
'use client'
export function DonationForm({ campania, tipo, onSuccess }: DonationFormProps) {
  const [loading, setLoading] = useState(false)
  // ...
}

// Hook
export function useCampaigns(ongId: string) {
  const [campaigns, setCampaigns] = useState<Campania[]>([])
  // ...
  return { campaigns, loading, error }
}
```

---

## 12. Testing

### Comandos de verificación

```bash
npm run typecheck    # tsc --noEmit — verifica que los types sean correctos
npm run lint         # next lint — verifica code style
npm run build        # next build — build completo, catcha errores de runtime
```

### Qué verificar por task

| Tipo de cambio | Verificación mínima |
|----------------|---------------------|
| Nuevo type | `npm run typecheck` pasa |
| Nuevo componente | `npm run typecheck` + render manual |
| Nueva page | `npm run build` + navegar manualmente |
| Nueva migration | `supabase db reset` + verificar en Supabase Studio |
| Hook nuevo | `npm run typecheck` + test manual con datos reales |
| Form | `npm run typecheck` + submit con datos válidos e inválidos |

### Datos de prueba (seed)

El seed incluye:
- 2 ONGs con logos y descripciones
- 4 campañas (2 plata, 1 especie, 1 voluntariado)
- 2 donantes (1 persona, 1 empresa)
- 3 aportes confirmados
- 2 objetivos anuales (1 cumplido, 1 en curso)

---

## 13. Execution Waves

### Dependency Graph

```
WAVE 0 (Foundation)
  │
  ├──> WAVE 1a (ONG Flow)        ──┐
  ├──> WAVE 1b (Discovery+Donor) ──┼──> WAVE 2 (MP + Donantes) ──> WAVE 3
  └──> WAVE 1c (Offline) ──────────┘                              (Polish)
```

### WAVE 0 — Foundation (~3h, 1 persona)

**Bloquea**: Todo lo demás. Sin schema no hay forms ni pages.

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 0.1 | Init repo: `npx create-next-app@14` + tailwind + shadcn/ui | Ninguna | 20min |
| 0.2 | Config Supabase: `supabase init`, config.toml, .env.local | 0.1 | 15min |
| 0.3 | Migración 00001: crear enums SQL | 0.2 | 15min |
| 0.4 | Migración 00002: crear tablas SQL | 0.3 | 30min |
| 0.5 | Migración 00003: RLS policies | 0.4 | 30min |
| 0.6 | Migración 00004: indexes + seed | 0.5 | 20min |
| 0.7 | Types TypeScript (todos los archivos en src/types/) | 0.3 | 30min |
| 0.8 | Supabase clients: client.ts, server.ts, admin.ts | 0.2 | 15min |
| 0.9 | Auth middleware + layout base | 0.8 | 20min |

### WAVE 1a — ONG Flow (~5h, persona A)

**Depende de**: WAVE 0
**Puede correr en paralelo con**: WAVE 1b, WAVE 1c

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 1a.1 | Form Alta ONG (campos, validación, submit) | 0.7, 0.9 | 1.5h |
| 1a.2 | ImageUploader component | 0.7 | 30min |
| 1a.3 | Form Crear campaña (campos, validación, submit) | 1a.1 | 1.5h |
| 1a.4 | VoiceDictation component (Web Speech API) | 1a.3 | 30min |
| 1a.5 | Dashboard campaña (acciones: editar, cerrar, eliminar) | 1a.3 | 1h |
| 1a.6 | UrgencyBadge component | 0.7 | 10min |
| 1a.7 | MP vincular ONG (sandbox flow) | 1a.1 | 30min |

### WAVE 1b — Discovery + Donor (~4h, persona B)

**Depende de**: WAVE 0
**Puede correr en paralelo con**: WAVE 1a, WAVE 1c

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 1b.1 | Home page: listado ONGs + campañas por prioridad | 0.7 | 1h |
| 1b.2 | ONGCard component | 0.7 | 20min |
| 1b.3 | CampaignCard component | 0.7 | 20min |
| 1b.4 | Landing ONG: perfil + campañas activas/pasadas | 1b.2, 1b.3 | 1h |
| 1b.5 | Form Alta donante persona | 0.7, 0.9 | 45min |
| 1b.6 | Form Alta donante empresa | 1b.5 | 30min |
| 1b.7 | Perfil donante + AnnualGoalTracker | 1b.5 | 30min |

### WAVE 1c — Offline (~4h, persona C o background)

**Depende de**: WAVE 0 (solo types + schema)
**Puede correr en paralelo con**: WAVE 1a, WAVE 1b

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 1c.1 | PWA setup: next-pwa, service worker, manifest | 0.1 | 30min |
| 1c.2 | IndexedDB wrapper (cola de sync) | 0.7 | 1h |
| 1c.3 | ConnectionStatusBanner component | 0.7 | 15min |
| 1c.4 | Form campaña con soporte offline (submit a cola) | 1c.2, 1a.3 | 1h |
| 1c.5 | Sync engine: detectar reconexión, volcar cola a Supabase | 1c.2 | 1h |
| 1c.6 | Test: modo avión → crear → reconectar → verificar | 1c.4, 1c.5 | 30min |

### WAVE 2 — MP + Donantes (~5h, 1 persona focused)

**Depende de**: WAVE 1a (ONG+campaign existen) + WAVE 1b (donante existe)
**Riesgo principal**: Integración MP

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 2.1 | DonationForm component (plata) | 1a.3 | 30min |
| 2.2 | Checkout MP sandbox: crear preference, redirect | 2.1 | 1.5h |
| 2.3 | Webhook MP: Edge Function para confirmar pago | 2.2 | 1.5h |
| 2.4 | DonorTable component | 0.7 | 30min |
| 2.5 | Tabla donantes page (ONG view) | 2.4 | 30min |
| 2.6 | Actualización automática de objetivos al confirmar aporte | 2.3 | 30min |

**Fallback MP**: Si la integración se complica, mock controlado:
```typescript
// src/lib/mercadopago-mock.ts
export async function createMockPreference(campaniaId: string, monto: number) {
  return { id: `mock_${Date.now()}`, init_point: `/api/webhooks/mercadopago?mock=true` }
}
```

### WAVE 3 — Polish + Demo (~2h, todos)

**Depende de**: WAVE 2 (flujo completo funcional)

| # | Task | Dependencias | Estimado |
|---|------|-------------|----------|
| 3.1 | Estados vacíos: "No hay campañas", "No hay donantes", etc. | 2.5 | 20min |
| 3.2 | Copy final + texts del demo | 3.1 | 20min |
| 3.3 | Loading states + skeletons | 3.1 | 20min |
| 3.4 | Responsive polish (mobile first) | 3.1 | 20min |
| 3.5 | Ensayo del demo: SC-001 a SC-004 | 3.4 | 30min |
| 3.6 | Fix issues del rehearsal | 3.5 | 30min |

---

## Success Criteria

| ID | Criterio | Verificación |
|----|----------|--------------|
| SC-001 | ONG crea campaña en < 2 min | Timer manual en demo |
| SC-002 | Donante completa aporte sin trabarse | Flujo end-to-end sin errors |
| SC-003 | Aporte aparece en tabla de donantes en vivo | Refrescar página, verificar |
| SC-004 | Campaña offline se sincroniza sin duplicar | Modo avión → reconectar → verificar |

---

## Preguntas Abiertas (no bloquean MVP)

- `[NEEDS CLARIFICATION]` Estructura de donaciones a nivel empresa
- `[NEEDS CLARIFICATION]` Datos legales requeridos para empresas
- `[NEEDS DESIGN]` Layout exacto de home / landing
- `[NEEDS CLARIFICATION]` Opción abierta para generar contacto
- `[NEEDS CLARIFICATION]` Qué es "Recursos" en donación general
