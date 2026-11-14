-- 010_armas_dnd.sql - As armas corpo a corpo do D&D que faltavam (js/armas.js). Sem estas linhas o servidor descartava a arma ao salvar.
-- Gerado por tools/arte/gerar_armas_dados.py.

INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES
  ('clava_grande', 'Clava Grande', 'weapon', 'common', 'weapon', '🏏', 1, 'Tronco nodoso e pesado, de duas mãos. Esmaga tudo que acerta.', 'Dano 1d8 impacto • Duas mãos'),
  ('martelo_leve', 'Martelo Leve', 'weapon', 'common', 'weapon', '🔨', 1, 'Martelo pequeno de ferro, leve e fácil de arremessar.', 'Dano 1d4 impacto • Leve • Arremesso'),
  ('maca', 'Maça de Ferro', 'weapon', 'common', 'weapon', '🔨', 1, 'Cabeça de ferro com rebarbas na ponta de um cabo de madeira.', 'Dano 1d6 impacto'),
  ('bordao', 'Bordão', 'weapon', 'common', 'weapon', '🦯', 1, 'Cajado longo de madeira dura. Uma ou duas mãos.', 'Dano 1d6 impacto (1d8 com duas mãos) • Versátil'),
  ('foice', 'Foice Curta', 'weapon', 'common', 'weapon', '🌾', 1, 'Lâmina curva de ceifar, de cabo curto.', 'Dano 1d4 corte • Leve'),
  ('machado_batalha', 'Machado de Batalha', 'weapon', 'common', 'weapon', '🪓', 1, 'Machado de uma lâmina larga, feito para a guerra.', 'Dano 1d8 corte (1d10 com duas mãos) • Versátil'),
  ('mangual', 'Mangual', 'weapon', 'common', 'weapon', '⛓️', 1, 'Cabo com corrente e uma bola de ferro com espinhos.', 'Dano 1d8 impacto'),
  ('glaive', 'Glaive', 'weapon', 'common', 'weapon', '⚔️', 1, 'Haste longa com uma lâmina curva de um fio na ponta.', 'Dano 1d10 corte • Alcance • Pesada • Duas mãos'),
  ('machado_grande', 'Machado Grande', 'weapon', 'common', 'weapon', '🪓', 1, 'Machado enorme de duas mãos, com lâmina larga.', 'Dano 1d12 corte • Pesada • Duas mãos'),
  ('montante', 'Montante', 'weapon', 'common', 'weapon', '⚔️', 1, 'Espada enorme de duas mãos, de lâmina longa e reta.', 'Dano 2d6 corte • Pesada • Duas mãos'),
  ('alabarda', 'Alabarda', 'weapon', 'common', 'weapon', '⚔️', 1, 'Haste longa com machado, ponta e gancho. Alcança longe.', 'Dano 1d10 corte • Alcance • Pesada • Duas mãos'),
  ('lanca_montada', 'Lança de Cavalaria', 'weapon', 'common', 'weapon', '🔱', 1, 'Lança longuíssima de cavaleiro, com guarda de mão.', 'Dano 1d12 perfuração • Alcance • Montado: uma mão'),
  ('malho', 'Malho', 'weapon', 'common', 'weapon', '🔨', 1, 'Marreta gigante de duas mãos. Cada pancada é um terremoto.', 'Dano 2d6 impacto • Pesada • Duas mãos'),
  ('maca_estrela', 'Maça-Estrela', 'weapon', 'common', 'weapon', '🔨', 1, 'Cabo de madeira com uma bola de ferro cheia de espinhos.', 'Dano 1d8 perfuração'),
  ('pique', 'Pique', 'weapon', 'common', 'weapon', '🔱', 1, 'Lança comprida de soldado, para segurar a linha.', 'Dano 1d10 perfuração • Alcance • Pesada • Duas mãos'),
  ('rapieira', 'Rapieira', 'weapon', 'common', 'weapon', '🗡️', 1, 'Lâmina fina e comprida, feita para estocadas rápidas.', 'Dano 1d8 perfuração • Acuidade'),
  ('cimitarra', 'Cimitarra', 'weapon', 'common', 'weapon', '🗡️', 1, 'Lâmina curva de um fio, leve e ágil.', 'Dano 1d6 corte • Leve • Acuidade'),
  ('tridente', 'Tridente', 'weapon', 'common', 'weapon', '🔱', 1, 'Haste longa com três pontas. Pode ser arremessado.', 'Dano 1d6 perfuração (1d8 com duas mãos) • Arremesso • Versátil'),
  ('picareta_guerra', 'Picareta de Guerra', 'weapon', 'common', 'weapon', '⛏️', 1, 'Cabo de madeira com uma ponta curva de aço que fura armaduras.', 'Dano 1d8 perfuração'),
  ('martelo_guerra', 'Martelo de Guerra', 'weapon', 'common', 'weapon', '🔨', 1, 'Martelo de aço com uma ponta atrás. Uma ou duas mãos.', 'Dano 1d8 impacto (1d10 com duas mãos) • Versátil'),
  ('chicote', 'Chicote', 'weapon', 'common', 'weapon', '➰', 1, 'Tira de couro trançado. Acerta de longe, mas dói pouco.', 'Dano 1d4 corte • Acuidade • Alcance')
ON CONFLICT (code) DO NOTHING;
