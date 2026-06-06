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
