CREATE TYPE "public"."estado_aporte" AS ENUM('pendiente', 'confirmado', 'a_coordinar');--> statement-breakpoint
CREATE TYPE "public"."estado_campania" AS ENUM('activa', 'cerrada', 'eliminada');--> statement-breakpoint
CREATE TYPE "public"."estado_objetivo" AS ENUM('en_curso', 'cumplido', 'sin_meta');--> statement-breakpoint
CREATE TYPE "public"."interes_donante" AS ENUM('educacion', 'salud', 'ambiental', 'alimentacion', 'infancias', 'cultura', 'habitat', 'animales', 'politicas_publicas');--> statement-breakpoint
CREATE TYPE "public"."modalidad_aporte" AS ENUM('unica', 'suscripcion');--> statement-breakpoint
CREATE TYPE "public"."modalidad_general" AS ENUM('unica', 'suscripcion', 'recursos');--> statement-breakpoint
CREATE TYPE "public"."sync_estado" AS ENUM('pendiente', 'sincronizada');--> statement-breakpoint
CREATE TYPE "public"."target_donante" AS ENUM('persona', 'empresa');--> statement-breakpoint
CREATE TYPE "public"."tipo_aporte" AS ENUM('plata', 'especie', 'voluntariado');--> statement-breakpoint
CREATE TYPE "public"."tipo_donacion" AS ENUM('plata', 'especie', 'voluntariado', 'general');--> statement-breakpoint
CREATE TYPE "public"."tipo_donante" AS ENUM('persona', 'empresa');--> statement-breakpoint
CREATE TYPE "public"."tipo_necesidad" AS ENUM('plata', 'especie', 'voluntariado');--> statement-breakpoint
CREATE TYPE "public"."tipo_objetivo" AS ENUM('plata', 'especie', 'voluntariado');--> statement-breakpoint
CREATE TABLE "aporte" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donante_id" uuid NOT NULL,
	"campania_id" uuid,
	"tipo" "tipo_aporte" NOT NULL,
	"monto" numeric(10, 2),
	"modalidad" "modalidad_aporte",
	"estado" "estado_aporte" DEFAULT 'pendiente',
	"mp_payment_id" text,
	"fecha" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campania" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ong_id" uuid NOT NULL,
	"titulo" text NOT NULL,
	"imagen_url" text,
	"descripcion" text NOT NULL,
	"audio_url" text,
	"tipo_necesidad" "tipo_necesidad" NOT NULL,
	"target_donante" "target_donante" DEFAULT 'persona' NOT NULL,
	"fecha_limite" timestamp with time zone,
	"urgencia" integer DEFAULT 3,
	"estado" "estado_campania" DEFAULT 'activa',
	"local_id" uuid,
	"sync_estado" "sync_estado" DEFAULT 'sincronizada',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campania_local_id_unique" UNIQUE("local_id"),
	CONSTRAINT "urgencia_check" CHECK ("campania"."urgencia" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "donacion_general" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ong_id" uuid NOT NULL,
	"donante_id" uuid NOT NULL,
	"modalidad" "modalidad_general" NOT NULL,
	"monto" numeric(10, 2),
	"mp_subscription_id" text,
	"estado" text DEFAULT 'pendiente',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "donante" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"tipo" "tipo_donante" NOT NULL,
	"email" text NOT NULL,
	"telefono" text,
	"nombre" text,
	"apellido" text,
	"intereses" "interes_donante"[] DEFAULT '{}',
	"nombre_empresa" text,
	"razon_social" text,
	"cuit" text,
	"rubro" text,
	"objetivo" text,
	"mail_contacto" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "item_pedido" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campania_id" uuid NOT NULL,
	"nombre" text NOT NULL,
	"cantidad" integer DEFAULT 1 NOT NULL,
	"nuevo_o_usado" text DEFAULT 'nuevo',
	"vencimiento" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "objetivo_donante" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"donante_id" uuid NOT NULL,
	"anio" integer NOT NULL,
	"tipo" "tipo_objetivo" NOT NULL,
	"meta_cantidad" integer,
	"meta_monto" numeric(10, 2),
	"progreso_cantidad" integer DEFAULT 0,
	"progreso_monto" numeric(10, 2) DEFAULT '0',
	"estado" "estado_objetivo" DEFAULT 'sin_meta',
	CONSTRAINT "objetivo_donante_donante_anio_tipo_uniq" UNIQUE("donante_id","anio","tipo")
);
--> statement-breakpoint
CREATE TABLE "ong" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"nombre" text NOT NULL,
	"logo_url" text,
	"descripcion" text NOT NULL,
	"mp_account_id" text,
	"tipos_donacion_habilitados" "tipo_donacion"[] DEFAULT '{}',
	"instagram_url" text,
	"facebook_url" text,
	"twitter_url" text,
	"linkedin_url" text,
	"youtube_url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "aporte" ADD CONSTRAINT "aporte_donante_id_donante_id_fk" FOREIGN KEY ("donante_id") REFERENCES "public"."donante"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aporte" ADD CONSTRAINT "aporte_campania_id_campania_id_fk" FOREIGN KEY ("campania_id") REFERENCES "public"."campania"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campania" ADD CONSTRAINT "campania_ong_id_ong_id_fk" FOREIGN KEY ("ong_id") REFERENCES "public"."ong"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donacion_general" ADD CONSTRAINT "donacion_general_ong_id_ong_id_fk" FOREIGN KEY ("ong_id") REFERENCES "public"."ong"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donacion_general" ADD CONSTRAINT "donacion_general_donante_id_donante_id_fk" FOREIGN KEY ("donante_id") REFERENCES "public"."donante"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_pedido" ADD CONSTRAINT "item_pedido_campania_id_campania_id_fk" FOREIGN KEY ("campania_id") REFERENCES "public"."campania"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objetivo_donante" ADD CONSTRAINT "objetivo_donante_donante_id_donante_id_fk" FOREIGN KEY ("donante_id") REFERENCES "public"."donante"("id") ON DELETE cascade ON UPDATE no action;