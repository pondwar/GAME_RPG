-- 008_itens_longe_e_chao.sql
-- 1) Itens que existiam so no jogo (js/inventory.js) e eram DESCARTADOS ao salvar: armas de longe, municao,
--    dardo, azagaia e as ervas. O servidor so guarda item que existe em ruleset.item.
-- 2) world.ground_item: coisas soltas no chao do mapa (armas arremessadas que cairam, tecla Q). O jogo manda a lista
--    inteira do realm (PUT) e le ao abrir (GET), entao recarregar a pagina nao faz mais sumir nada.

INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES
  ('arco_curto', 'Arco Curto', 'weapon', 'common', 'weapon', '🏹', 1, 'Arco de madeira simples. Dispara flechas a boa distância.', 'Dano 1d6 perfuração • Munição: flecha • Duas mãos'),
  ('arco_longo', 'Arco Longo', 'weapon', 'common', 'weapon', '🏹', 1, 'Arco grande, de alcance e força maiores. Os elfos aprendem desde cedo.', 'Dano 1d8 perfuração • Munição: flecha • Duas mãos • Pesada'),
  ('besta_leve', 'Besta Leve', 'weapon', 'common', 'weapon', '🏹', 1, 'Besta de duas mãos: demora a recarregar, mas acerta forte.', 'Dano 1d8 perfuração • Munição: virote • Recarga • Duas mãos'),
  ('besta_pesada', 'Balestra (Besta Pesada)', 'weapon', 'common', 'weapon', '🏹', 1, 'Besta enorme e pesada. Dispara virotes de longe com muita força.', 'Dano 1d10 perfuração • Munição: virote • Recarga • Duas mãos • Pesada'),
  ('besta_mao', 'Besta de Mão', 'weapon', 'common', 'weapon', '🏹', 1, 'Besta pequena que se usa com uma mão. Leve e rápida de recarregar.', 'Dano 1d6 perfuração • Munição: virote • Recarga • Leve'),
  ('funda', 'Funda', 'weapon', 'common', 'weapon', '🪃', 1, 'Uma tira de couro que gira e arremessa pedras.', 'Dano 1d4 impacto • Munição: pedra'),
  ('flecha', 'Flecha', 'material', 'common', NULL, '➶', 99, 'Munição de arco. Cada disparo gasta uma.', 'Munição de arco'),
  ('virote', 'Virote', 'material', 'common', NULL, '➶', 99, 'Munição de besta. Cada disparo gasta um.', 'Munição de besta'),
  ('pedra', 'Pedra de Funda', 'material', 'common', NULL, '⚪', 99, 'Pedra lisa para a funda. Cada disparo gasta uma.', 'Munição de funda'),
  ('dardo', 'Dardo', 'material', 'common', NULL, '➳', 20, 'Dardo curto e leve. Aperte Q para arremessar; depois é só pegá-lo do chão.', 'Dano 1d4 perfuração • Acuidade • Arremesso'),
  ('azagaia', 'Azagaia', 'material', 'common', NULL, '➳', 10, 'Lança leve feita para voar longe. Aperte Q para arremessar; depois é só pegá-la do chão.', 'Dano 1d6 perfuração • Arremesso (9 m)'),
  ('chamomile', 'Camomila', 'consumable', 'common', NULL, '🌼', 30, 'Flores de camomila colhidas no campo. Um chá calma o corpo e a mente.', '+10 HP'),
  ('mint', 'Hortelã', 'consumable', 'common', NULL, '🌿', 30, 'Folhas de hortelã, frescas e perfumadas. Aliviam o estômago e dão ânimo.', '+4 HP, +8 Estamina'),
  ('sage', 'Sálvia', 'consumable', 'common', NULL, '🪻', 30, 'Sálvia de folhas acinzentadas. Cicatriza pequenos ferimentos.', '+14 HP'),
  ('boldo', 'Boldo', 'consumable', 'common', NULL, '🍃', 30, 'Folhas largas de boldo, de gosto amargo. Um chá alivia o estômago depois de uma refeição pesada.', '+10 HP, +5% Nutrição'),
  ('lemongrass', 'Erva-cidreira', 'consumable', 'common', NULL, '🌾', 30, 'Capim perfumado de cheiro cítrico. O chá acalma e dá fôlego.', '+6 HP, +10 Estamina'),
  ('guaco', 'Guaco', 'consumable', 'common', NULL, '🌿', 30, 'Trepadeira de folhas em forma de coração. O xarope de guaco cura a tosse e fortalece o peito.', '+14 HP')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE world.ground_item (
  id         bigserial PRIMARY KEY,
  realm_id   smallint NOT NULL REFERENCES world.realm (id) ON DELETE CASCADE,
  item_code  text NOT NULL REFERENCES ruleset.item (code) ON UPDATE CASCADE,
  x          real NOT NULL,
  y          real NOT NULL,
  angle      real NOT NULL DEFAULT 0,          -- giro do desenho no chao (radianos)
  expires_at timestamptz NOT NULL,             -- depois disso a coisa some do mapa
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ground_item_realm_idx ON world.ground_item (realm_id, expires_at);
COMMENT ON TABLE world.ground_item IS 'Itens soltos no chao do mapa (armas arremessadas que cairam). O jogo grava a lista inteira do realm e le ao abrir.';
