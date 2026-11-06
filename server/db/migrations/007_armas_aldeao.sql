-- 007_armas_aldeao.sql - Armas basicas do aldeao (D&D 5e; regras de quem usa em js/armas.js, itens em js/inventory.js).
-- Sem estas linhas o servidor descartava a arma da mao e da mochila ao salvar (so guarda item do catalogo).

INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES
  ('adaga', 'Adaga de Ferro', 'weapon', 'common', 'weapon', '🔪', 1, 'Lâmina curta de ferro. Leve, rápida e pode ser arremessada.', 'Dano 1d4 perfuração • Leve • Acuidade • Arremesso'),
  ('espada_curta', 'Espada Curta de Ferro', 'weapon', 'common', 'weapon', '🗡️', 1, 'Espada curta e leve, de ferro simples. Arma de guerra (os elfos aprendem desde cedo).', 'Dano 1d6 perfuração • Leve • Acuidade'),
  ('clava', 'Clava de Madeira', 'weapon', 'common', 'weapon', '🏏', 1, 'Um bom pedaço de madeira dura. A arma mais simples que existe.', 'Dano 1d4 impacto • Leve'),
  ('machadinha', 'Machadinha de Ferro', 'weapon', 'common', 'weapon', '🪓', 1, 'Machado pequeno de uma mão, de ferro. Corta lenha e pode ser arremessado (os anões aprendem desde cedo).', 'Dano 1d6 corte • Leve • Arremesso'),
  ('lanca', 'Lança de Ferro', 'weapon', 'common', 'weapon', '🔱', 1, 'Haste de madeira com ponta de ferro. Uma ou duas mãos, ou arremessada.', 'Dano 1d6 perfuração (1d8 com duas mãos) • Arremesso • Versátil')
ON CONFLICT (code) DO NOTHING;
