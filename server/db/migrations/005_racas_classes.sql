-- 005_racas_classes.sql - Racas e classes classicas do D&D 5e (SRD 5.1, CC-BY-4.0, Wizards of the Coast)
-- GERADO por tools/gerar_ruleset_sql.js a partir de js/ruleset.js (nao editar a mao: edite o ruleset e gere de novo).
-- Tambem registra os itens da fauna (fase 3) que faltavam em ruleset.item: sem o registro o servidor
-- descartava esses itens da mochila ao salvar o personagem.

INSERT INTO ruleset.race (code, name, description, is_playable, properties) VALUES
  ('humano', 'Humano', 'Os mais numerosos e ambiciosos dos povos. Adaptáveis, constroem as vilas e cidades de Suritto.', true, '{"icon":"🧑","speed":30,"size":"Médio","traits":["Versátil: +1 em todos os atributos"],"choose":0}'::jsonb),
  ('elfo', 'Elfo', 'Povo antigo e gracioso das florestas, de vida longa e sentidos apurados.', true, '{"icon":"🧝","speed":30,"size":"Médio","traits":["Visão no escuro","Sentidos aguçados (Percepção)","Ancestralidade feérica: resiste a encantamentos","Transe: descansa meditando"],"choose":0}'::jsonb),
  ('anao', 'Anão', 'Robustos mestres da pedra e do metal, teimosos e leais até o fim.', true, '{"icon":"🧔","speed":25,"size":"Médio","traits":["Visão no escuro","Resiliência anã: resiste a veneno","Robustez: +1 PV por nível","Conhece pedra e cantaria"],"choose":0}'::jsonb),
  ('halfling', 'Halfling', 'Pequenos, alegres e sortudos. Passam despercebidos onde ninguém mais passa.', true, '{"icon":"🧒","speed":25,"size":"Pequeno","traits":["Sortudo: rola de novo um 1 natural","Bravura: resiste a medo","Agilidade halfling","Pés leves: se esconde atrás de criaturas maiores"],"choose":0}'::jsonb),
  ('draconato', 'Draconato', 'Descendentes de dragões, orgulhosos e imponentes, com escamas e sopro elemental.', true, '{"icon":"🐲","speed":30,"size":"Médio","traits":["Sopro de dragão (fogo)","Resistência a fogo"],"choose":0}'::jsonb),
  ('gnomo', 'Gnomo', 'Curiosos inventores e ilusionistas, de energia inesgotável.', true, '{"icon":"🧙","speed":25,"size":"Pequeno","traits":["Visão no escuro","Esperteza gnômica: resiste a magia mental","Engenhoqueiro"],"choose":0}'::jsonb),
  ('meio_elfo', 'Meio-elfo', 'Entre dois mundos, herdam a graça élfica e a ambição humana.', true, '{"icon":"🧝‍♂️","speed":30,"size":"Médio","traits":["Visão no escuro","Ancestralidade feérica","+1 em dois atributos à escolha","Versatilidade em perícias"],"choose":2}'::jsonb),
  ('meio_orc', 'Meio-orc', 'Fortes e intimidadores, carregam a fúria dos orcs e a disciplina dos humanos.', true, '{"icon":"👹","speed":30,"size":"Médio","traits":["Visão no escuro","Resistência implacável: fica com 1 PV uma vez por descanso","Ataques selvagens: crítico mais forte","Ameaçador (Intimidação)"],"choose":0}'::jsonb),
  ('tiferino', 'Tiferino', 'Marcados por um pacto antigo com os planos inferiores: chifres, cauda e olhos brilhantes.', true, '{"icon":"😈","speed":30,"size":"Médio","traits":["Visão no escuro","Resistência infernal: resiste a fogo","Legado infernal: magias inatas"],"choose":0}'::jsonb)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, properties = EXCLUDED.properties;

INSERT INTO ruleset.race_attribute_modifier (race_code, attribute_code, modifier) VALUES
  ('humano', 'forca', 1),
  ('humano', 'destreza', 1),
  ('humano', 'constituicao', 1),
  ('humano', 'inteligencia', 1),
  ('humano', 'sabedoria', 1),
  ('humano', 'carisma', 1),
  ('elfo', 'destreza', 2),
  ('elfo', 'inteligencia', 1),
  ('anao', 'constituicao', 2),
  ('anao', 'sabedoria', 1),
  ('halfling', 'destreza', 2),
  ('halfling', 'carisma', 1),
  ('draconato', 'forca', 2),
  ('draconato', 'carisma', 1),
  ('gnomo', 'inteligencia', 2),
  ('gnomo', 'constituicao', 1),
  ('meio_elfo', 'carisma', 2),
  ('meio_orc', 'forca', 2),
  ('meio_orc', 'constituicao', 1),
  ('tiferino', 'carisma', 2),
  ('tiferino', 'inteligencia', 1)
ON CONFLICT (race_code, attribute_code) DO UPDATE SET modifier = EXCLUDED.modifier;

INSERT INTO ruleset.character_class (code, name, description, hit_die_code, base_hp, hp_per_level, base_mana, mana_per_level, properties) VALUES
  ('barbaro', 'Bárbaro', 'Guerreiro feroz que luta em fúria, aguentando o que mataria outros.', 'd12', 96, 56, 20, 0, '{"icon":"🪓","key":["forca"],"saves":["forca","constituicao"],"caster":0,"role":"Corpo a corpo, muita vida"}'::jsonb),
  ('bardo', 'Bardo', 'Artista e conjurador: sua música inspira aliados e confunde inimigos.', 'd8', 64, 40, 50, 6, '{"icon":"🎻","key":["carisma"],"saves":["destreza","carisma"],"caster":1,"role":"Suporte e magia"}'::jsonb),
  ('clerigo', 'Clérigo', 'Sacerdote com poder divino: cura, protege e castiga.', 'd8', 64, 40, 50, 6, '{"icon":"✨","key":["sabedoria"],"saves":["sabedoria","carisma"],"caster":1,"role":"Cura e magia divina"}'::jsonb),
  ('druida', 'Druida', 'Guardião da natureza, fala com os animais e assume a forma deles.', 'd8', 64, 40, 50, 6, '{"icon":"🌿","key":["sabedoria"],"saves":["inteligencia","sabedoria"],"caster":1,"role":"Natureza e transformação"}'::jsonb),
  ('guerreiro', 'Guerreiro', 'Mestre de todas as armas e armaduras, disciplinado e versátil.', 'd10', 80, 48, 20, 0, '{"icon":"⚔️","key":["forca","destreza"],"saves":["forca","constituicao"],"caster":0,"role":"Corpo a corpo, versátil"}'::jsonb),
  ('monge', 'Monge', 'Lutador de mãos nuas que canaliza a energia interior (ki).', 'd8', 64, 40, 20, 0, '{"icon":"🥋","key":["destreza","sabedoria"],"saves":["forca","destreza"],"caster":0,"role":"Agilidade e golpes rápidos"}'::jsonb),
  ('paladino', 'Paladino', 'Cavaleiro sagrado de um juramento: protege os fracos e castiga o mal.', 'd10', 80, 48, 35, 3, '{"icon":"🛡️","key":["forca","carisma"],"saves":["sabedoria","carisma"],"caster":0.5,"role":"Tanque com magia divina"}'::jsonb),
  ('patrulheiro', 'Patrulheiro', 'Caçador das terras selvagens, rastreador e mestre do arco.', 'd10', 80, 48, 35, 3, '{"icon":"🏹","key":["destreza","sabedoria"],"saves":["forca","destreza"],"caster":0.5,"role":"Caça e combate à distância"}'::jsonb),
  ('ladino', 'Ladino', 'Furtivo e astuto: ataques pelas costas, armadilhas e fechaduras.', 'd8', 64, 40, 20, 0, '{"icon":"🗡️","key":["destreza"],"saves":["destreza","inteligencia"],"caster":0,"role":"Furtividade e dano preciso"}'::jsonb),
  ('feiticeiro', 'Feiticeiro', 'A magia corre no seu sangue, crua e poderosa.', 'd6', 48, 32, 50, 6, '{"icon":"🔥","key":["carisma"],"saves":["constituicao","carisma"],"caster":1,"role":"Magia ofensiva"}'::jsonb),
  ('bruxo', 'Bruxo', 'Fez um pacto com uma entidade sobrenatural em troca de poder.', 'd8', 64, 40, 50, 6, '{"icon":"🌒","key":["carisma"],"saves":["sabedoria","carisma"],"caster":1,"role":"Magia de pacto"}'::jsonb),
  ('mago', 'Mago', 'Estudioso das artes arcanas, com o maior repertório de magias.', 'd6', 48, 32, 50, 6, '{"icon":"📖","key":["inteligencia"],"saves":["inteligencia","sabedoria"],"caster":1,"role":"Magia versátil"}'::jsonb)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, hit_die_code = EXCLUDED.hit_die_code,
  base_hp = EXCLUDED.base_hp, hp_per_level = EXCLUDED.hp_per_level, base_mana = EXCLUDED.base_mana, mana_per_level = EXCLUDED.mana_per_level, properties = EXCLUDED.properties;

INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES
  ('berries', 'Frutinhas Silvestres', 'consumable', 'common', NULL, '🫐', 30, 'Amoras e mirtilos colhidos dos arbustos da mata.', '+8 HP, +12% Nutrição'),
  ('mushroom', 'Cogumelo da Mata', 'consumable', 'common', NULL, '🍄', 20, 'Cogumelo carnudo da mata fechada, a comida preferida dos javalis.', '+5 HP, +15% Nutrição'),
  ('rabbit_fur', 'Pelo de Coelho', 'material', 'common', NULL, '🐇', 20, 'Pelo macio e quente.', 'Material de Costura'),
  ('fox_pelt', 'Pele de Raposa', 'material', 'uncommon', NULL, '🦊', 10, 'Pele avermelhada de raposa.', 'Material de Costura'),
  ('boar_tusk', 'Presa de Javali', 'material', 'uncommon', NULL, '🐗', 20, 'Presa curva e afiada de um javali adulto.', 'Material de Amuleto'),
  ('bear_pelt', 'Pele de Urso', 'material', 'rare', NULL, '🐻', 5, 'Pele pesada do senhor da mata.', 'Material Raro')
ON CONFLICT (code) DO NOTHING;
