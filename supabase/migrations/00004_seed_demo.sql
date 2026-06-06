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
  ('aaaa4444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Recaudación para refacción del techo', '/images/campania4.jpg', 'La sede necesita una nuevo techo urgente.', 'plata', 'empresa', 5, 'activa');

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
