// gerar_ruleset_sql.js - Gera server/db/migrations/005_racas_classes.sql e 006_raca_classe.sql a partir de js/ruleset.js
// (racas e classes do D&D 5e SRD) e registra os itens do jogo que ainda nao existiam em ruleset.item
// (sem eles o servidor descartava esses itens da mochila ao salvar).
// Uso: node tools/gerar_ruleset_sql.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'js', 'ruleset.js'), 'utf8'), ctx);
const R = ctx.window.SurittoRules;
const q = (s) => s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;

let sql = `-- 005_racas_classes.sql - Racas e classes classicas do D&D 5e (SRD 5.1, CC-BY-4.0, Wizards of the Coast)
-- GERADO por tools/gerar_ruleset_sql.js a partir de js/ruleset.js (nao editar a mao: edite o ruleset e gere de novo).
-- Tambem registra os itens da fauna (fase 3) que faltavam em ruleset.item: sem o registro o servidor
-- descartava esses itens da mochila ao salvar o personagem.

`;
sql += `INSERT INTO ruleset.race (code, name, description, is_playable, properties) VALUES\n` +
  Object.entries(R.RACES).map(([code, r]) => `  (${q(code)}, ${q(r.name)}, ${q(r.desc)}, true, ${q(JSON.stringify({ icon: r.icon, speed: r.speed, size: r.size, traits: r.traits, choose: r.choose || 0 }))}::jsonb)`).join(',\n') +
  `\nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, properties = EXCLUDED.properties;\n\n`;
const mods = [];
for (const [code, r] of Object.entries(R.RACES)) for (const [a, v] of Object.entries(r.bonus)) mods.push(`  (${q(code)}, ${q(a)}, ${v})`);
sql += `INSERT INTO ruleset.race_attribute_modifier (race_code, attribute_code, modifier) VALUES\n${mods.join(',\n')}\nON CONFLICT (race_code, attribute_code) DO UPDATE SET modifier = EXCLUDED.modifier;\n\n`;
sql += `INSERT INTO ruleset.character_class (code, name, description, hit_die_code, base_hp, hp_per_level, base_mana, mana_per_level, properties) VALUES\n` +
  Object.entries(R.CLASSES).map(([code, c]) => `  (${q(code)}, ${q(c.name)}, ${q(c.desc)}, 'd${c.hitDie}', ${c.hitDie * R.HP_SCALE}, ${Math.ceil(c.hitDie / 2 + 1) * R.HP_SCALE}, ${Math.round(20 + c.caster * 30)}, ${Math.round(c.caster * 6)}, ${q(JSON.stringify({ icon: c.icon, key: c.key, saves: c.saves, caster: c.caster, role: c.role }))}::jsonb)`).join(',\n') +
  `\nON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, hit_die_code = EXCLUDED.hit_die_code,\n  base_hp = EXCLUDED.base_hp, hp_per_level = EXCLUDED.hp_per_level, base_mana = EXCLUDED.base_mana, mana_per_level = EXCLUDED.mana_per_level, properties = EXCLUDED.properties;\n\n`;
// itens criados no cliente (js/inventory.js) depois da semente 002
const items = [
  ['berries', 'Frutinhas Silvestres', 'consumable', 'common', null, '🫐', 30, 'Amoras e mirtilos colhidos dos arbustos da mata.', '+8 HP, +12% Nutrição'],
  ['mushroom', 'Cogumelo da Mata', 'consumable', 'common', null, '🍄', 20, 'Cogumelo carnudo da mata fechada, a comida preferida dos javalis.', '+5 HP, +15% Nutrição'],
  ['rabbit_fur', 'Pelo de Coelho', 'material', 'common', null, '🐇', 20, 'Pelo macio e quente.', 'Material de Costura'],
  ['fox_pelt', 'Pele de Raposa', 'material', 'uncommon', null, '🦊', 10, 'Pele avermelhada de raposa.', 'Material de Costura'],
  ['boar_tusk', 'Presa de Javali', 'material', 'uncommon', null, '🐗', 20, 'Presa curva e afiada de um javali adulto.', 'Material de Amuleto'],
  ['bear_pelt', 'Pele de Urso', 'material', 'rare', null, '🐻', 5, 'Pele pesada do senhor da mata.', 'Material Raro']
];
sql += `INSERT INTO ruleset.item (code, name, item_type_code, rarity_code, equipment_slot_code, icon, max_stack, description, stats_text) VALUES\n` +
  items.map(i => `  (${i.map((v, k) => k === 6 ? v : q(v)).join(', ')})`).join(',\n') + `\nON CONFLICT (code) DO NOTHING;\n`;

fs.writeFileSync(path.join(root, 'server', 'db', 'migrations', '005_racas_classes.sql'), sql);
console.log('gerado server/db/migrations/005_racas_classes.sql');

// 006: classes que cada raca pode seguir (regra do Suritto, ver RACE_CLASSES em js/ruleset.js)
let sql6 = `-- 006_raca_classe.sql - Classes que cada raca pode seguir (regra do Suritto inspirada no AD&D; o D&D 5e nao restringe)
-- GERADO por tools/gerar_ruleset_sql.js a partir de js/ruleset.js (RACE_CLASSES). O servidor recusa ficha fora desta tabela.

CREATE TABLE IF NOT EXISTS ruleset.race_class (
  race_code  text NOT NULL REFERENCES ruleset.race (code) ON UPDATE CASCADE ON DELETE CASCADE,
  class_code text NOT NULL REFERENCES ruleset.character_class (code) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (race_code, class_code)
);

DELETE FROM ruleset.race_class;
`;
const pairs = [];
for (const [r, list] of Object.entries(R.RACE_CLASSES)) for (const c of list) pairs.push(`  (${q(r)}, ${q(c)})`);
sql6 += `INSERT INTO ruleset.race_class (race_code, class_code) VALUES\n${pairs.join(',\n')};\n`;
fs.writeFileSync(path.join(root, 'server', 'db', 'migrations', '006_raca_classe.sql'), sql6);
console.log('gerado server/db/migrations/006_raca_classe.sql');
