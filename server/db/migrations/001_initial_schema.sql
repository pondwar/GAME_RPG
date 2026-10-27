-- =====================================================================
-- 001_initial_schema.sql - Modelo inicial do Suritto RPG
-- =====================================================================
-- Convencoes:
--   * snake_case, nomes de tabela no singular, ingles na estrutura;
--     termos do Tormenta (pericia) ficam como sao.
--   * Schemas por dominio:
--       account  - contas de jogador (login)
--       ruleset  - regras/dados estaticos do jogo (racas, classes, skills, itens...)
--       player   - estado de cada personagem
--       world    - estado persistente do mundo (construcoes, recursos, relogio)
--       audit    - historico (rolagens de dados)
--   * Tabelas de regra usam `code` (texto curto, estavel) como chave; o codigo do
--     jogo usa os mesmos codes (ex.: skill 'woodcutting', pericia 'sobrevivencia').
--   * Entidades de jogador usam uuid v7 (ordenado no tempo, nativo do PG 18).
--   * Campos flexiveis/em desenho ficam em jsonb (`properties`, `item_state`...)
--     ate a mecanica estabilizar; depois viram colunas.
-- =====================================================================

CREATE SCHEMA account;
CREATE SCHEMA ruleset;
CREATE SCHEMA player;
CREATE SCHEMA world;
CREATE SCHEMA audit;

-- Atualiza updated_at automaticamente
CREATE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

-- =====================================================================
-- RULESET - regras do jogo (Tormenta20 / D20)
-- =====================================================================

CREATE TABLE ruleset.attribute (
  code         text PRIMARY KEY,               -- forca, destreza, constituicao, inteligencia, sabedoria, carisma
  name         text NOT NULL,
  abbreviation text NOT NULL UNIQUE,           -- FOR, DES, CON, INT, SAB, CAR
  sort_order   smallint NOT NULL DEFAULT 0
);
COMMENT ON TABLE ruleset.attribute IS 'Atributos do personagem (Tormenta20).';

CREATE TABLE ruleset.die (
  code  text PRIMARY KEY,                       -- d4, d6, d8, d10, d12, d20, d100
  faces smallint NOT NULL UNIQUE CHECK (faces >= 2)
);
COMMENT ON TABLE ruleset.die IS 'Tipos de dado usados nas rolagens.';

CREATE TABLE ruleset.roll_outcome (
  code       text PRIMARY KEY,                  -- critical_failure, failure, success, critical_success
  name       text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE ruleset.race (
  code        text PRIMARY KEY,
  name        text NOT NULL,
  description text,
  is_playable boolean NOT NULL DEFAULT true,
  properties  jsonb NOT NULL DEFAULT '{}'::jsonb  -- habilidades de raca, tamanho, deslocamento... (em desenho)
);

CREATE TABLE ruleset.race_attribute_modifier (
  race_code      text NOT NULL REFERENCES ruleset.race (code) ON UPDATE CASCADE ON DELETE CASCADE,
  attribute_code text NOT NULL REFERENCES ruleset.attribute (code) ON UPDATE CASCADE,
  modifier       smallint NOT NULL,
  PRIMARY KEY (race_code, attribute_code)
);

CREATE TABLE ruleset.character_class (
  code           text PRIMARY KEY,
  name           text NOT NULL,
  description    text,
  hit_die_code   text REFERENCES ruleset.die (code) ON UPDATE CASCADE,
  base_hp        smallint NOT NULL DEFAULT 0,
  hp_per_level   smallint NOT NULL DEFAULT 0,
  base_mana      smallint NOT NULL DEFAULT 0,
  mana_per_level smallint NOT NULL DEFAULT 0,
  properties     jsonb NOT NULL DEFAULT '{}'::jsonb  -- pericias de classe, proficiencias, poderes... (em desenho)
);

CREATE TABLE ruleset.pericia (
  code               text PRIMARY KEY,           -- sobrevivencia, atletismo, ladinagem...
  name               text NOT NULL,
  key_attribute_code text REFERENCES ruleset.attribute (code) ON UPDATE CASCADE,
  attribute_label    text,                        -- rotulo exibido hoje no jogo (ex.: 'Sabedoria / Vigor')
  icon               text,
  max_bonus          smallint NOT NULL DEFAULT 15,
  description        text,
  examples           text[] NOT NULL DEFAULT '{}'
);
COMMENT ON TABLE ruleset.pericia IS 'Pericias D20 (testes 1d20 + bonus).';

CREATE TABLE ruleset.skill_category (
  code       text PRIMARY KEY,                    -- combat, gathering, crafting, survival
  name       text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE ruleset.skill (
  code                 text PRIMARY KEY,          -- woodcutting, mining, attack...
  name                 text NOT NULL,
  title                text,
  category_code        text NOT NULL REFERENCES ruleset.skill_category (code) ON UPDATE CASCADE,
  icon                 text,
  color                text,
  max_level            smallint NOT NULL DEFAULT 99,
  synergy_pericia_code text REFERENCES ruleset.pericia (code) ON UPDATE CASCADE,
  description          text,
  sort_order           smallint NOT NULL DEFAULT 0
);
COMMENT ON TABLE ruleset.skill IS 'Habilidades primarias (progressao 1-99).';

CREATE TABLE ruleset.skill_milestone (
  skill_code     text NOT NULL REFERENCES ruleset.skill (code) ON UPDATE CASCADE ON DELETE CASCADE,
  required_level smallint NOT NULL,
  description    text NOT NULL,
  PRIMARY KEY (skill_code, required_level)
);

CREATE TABLE ruleset.item_type (
  code text PRIMARY KEY,                          -- consumable, weapon, offhand, armor, material
  name text NOT NULL
);

CREATE TABLE ruleset.item_rarity (
  code       text PRIMARY KEY,                    -- common, uncommon, rare, epic, legendary
  name       text NOT NULL,
  color      text,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE ruleset.equipment_slot (
  code       text PRIMARY KEY,                    -- weapon, offhand, armor
  name       text NOT NULL,
  sort_order smallint NOT NULL DEFAULT 0
);

CREATE TABLE ruleset.item (
  code                text PRIMARY KEY,
  name                text NOT NULL,
  item_type_code      text NOT NULL REFERENCES ruleset.item_type (code) ON UPDATE CASCADE,
  rarity_code         text NOT NULL REFERENCES ruleset.item_rarity (code) ON UPDATE CASCADE,
  equipment_slot_code text REFERENCES ruleset.equipment_slot (code) ON UPDATE CASCADE,
  icon                text,
  max_stack           smallint NOT NULL DEFAULT 1 CHECK (max_stack >= 1),
  description         text,
  stats_text          text,
  properties          jsonb NOT NULL DEFAULT '{}'::jsonb  -- dano, efeitos de uso, valor... (em desenho)
);

-- =====================================================================
-- ACCOUNT - contas
-- =====================================================================

CREATE TABLE account.user_account (
  id            uuid PRIMARY KEY DEFAULT uuidv7(),
  username      text NOT NULL,
  email         text,
  password_hash text,                             -- nunca senha pura (argon2/bcrypt no servidor)
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'banned', 'disabled')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE UNIQUE INDEX user_account_username_uq ON account.user_account (lower(username));
CREATE UNIQUE INDEX user_account_email_uq ON account.user_account (lower(email)) WHERE email IS NOT NULL;
CREATE TRIGGER user_account_updated_at BEFORE UPDATE ON account.user_account
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE account.keybinding (
  account_id  uuid NOT NULL REFERENCES account.user_account (id) ON DELETE CASCADE,
  action_code text NOT NULL,                      -- ex.: open_inventory, interact, hotbar_1
  key_code    text NOT NULL,                      -- KeyboardEvent.code (ex.: 'KeyI', 'Digit1')
  PRIMARY KEY (account_id, action_code)
);
COMMENT ON TABLE account.keybinding IS 'Atalhos configurados pelo jogador (por conta).';

-- =====================================================================
-- WORLD - mundo persistente
-- =====================================================================

CREATE TABLE world.realm (
  id         smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code       text NOT NULL UNIQUE,                -- local, br-01...
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE world.realm IS 'Servidor/mundo (shard). Cada realm tem seu proprio mapa e personagens.';

CREATE TABLE world.world_clock (
  realm_id     smallint PRIMARY KEY REFERENCES world.realm (id) ON DELETE CASCADE,
  virtual_time timestamptz NOT NULL,
  time_scale   real NOT NULL DEFAULT 1,
  weather_code text NOT NULL DEFAULT 'clear',
  updated_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER world_clock_updated_at BEFORE UPDATE ON world.world_clock
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- PLAYER - personagens
-- =====================================================================

CREATE TABLE player.game_character (
  id                uuid PRIMARY KEY DEFAULT uuidv7(),
  account_id        uuid REFERENCES account.user_account (id) ON DELETE CASCADE,
  realm_id          smallint NOT NULL REFERENCES world.realm (id),
  name              text NOT NULL,
  race_code         text REFERENCES ruleset.race (code) ON UPDATE CASCADE,
  class_code        text REFERENCES ruleset.character_class (code) ON UPDATE CASCADE,
  level             smallint NOT NULL DEFAULT 1 CHECK (level >= 1),
  xp_total          bigint NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
  hp                real NOT NULL,
  max_hp            integer NOT NULL CHECK (max_hp > 0),
  mana              real NOT NULL,
  max_mana          integer NOT NULL CHECK (max_mana >= 0),
  stamina           real NOT NULL,
  max_stamina       integer NOT NULL CHECK (max_stamina > 0),
  hunger            real NOT NULL DEFAULT 100 CHECK (hunger BETWEEN 0 AND 100),
  coins             bigint NOT NULL DEFAULT 0 CHECK (coins >= 0),
  pos_x             double precision NOT NULL,
  pos_y             double precision NOT NULL,
  pos_z             real NOT NULL DEFAULT 0,
  facing            text NOT NULL DEFAULT 'down' CHECK (facing IN ('down', 'up', 'left', 'right')),
  play_time_seconds bigint NOT NULL DEFAULT 0,
  state             jsonb NOT NULL DEFAULT '{}'::jsonb,  -- buffs, tocha acesa, flags... (em desenho)
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);
CREATE UNIQUE INDEX game_character_name_uq ON player.game_character (realm_id, lower(name)) WHERE deleted_at IS NULL;
CREATE INDEX game_character_account_idx ON player.game_character (account_id);
CREATE TRIGGER game_character_updated_at BEFORE UPDATE ON player.game_character
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE player.character_attribute (
  character_id   uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  attribute_code text NOT NULL REFERENCES ruleset.attribute (code) ON UPDATE CASCADE,
  value          smallint NOT NULL,
  PRIMARY KEY (character_id, attribute_code)
);

CREATE TABLE player.character_skill (
  character_id uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  skill_code   text NOT NULL REFERENCES ruleset.skill (code) ON UPDATE CASCADE,
  level        smallint NOT NULL DEFAULT 1 CHECK (level >= 1),
  xp_progress  integer NOT NULL DEFAULT 0 CHECK (xp_progress >= 0),  -- XP dentro do nivel atual
  xp_total     bigint NOT NULL DEFAULT 0 CHECK (xp_total >= 0),      -- XP ganho na vida toda
  PRIMARY KEY (character_id, skill_code)
);

CREATE TABLE player.character_pericia (
  character_id uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  pericia_code text NOT NULL REFERENCES ruleset.pericia (code) ON UPDATE CASCADE,
  bonus        smallint NOT NULL DEFAULT 0,
  xp_progress  integer NOT NULL DEFAULT 0 CHECK (xp_progress >= 0),
  xp_total     bigint NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
  PRIMARY KEY (character_id, pericia_code)
);

CREATE TABLE player.inventory_slot (
  character_id uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  slot_index   smallint NOT NULL CHECK (slot_index >= 0),
  item_code    text NOT NULL REFERENCES ruleset.item (code) ON UPDATE CASCADE,
  quantity     integer NOT NULL CHECK (quantity > 0),
  item_state   jsonb NOT NULL DEFAULT '{}'::jsonb,  -- encantamento, durabilidade... (por unidade/stack)
  PRIMARY KEY (character_id, slot_index)
);

CREATE TABLE player.character_equipment (
  character_id        uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  equipment_slot_code text NOT NULL REFERENCES ruleset.equipment_slot (code) ON UPDATE CASCADE,
  item_code           text NOT NULL REFERENCES ruleset.item (code) ON UPDATE CASCADE,
  item_state          jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (character_id, equipment_slot_code)
);

CREATE TABLE player.hotbar_slot (
  character_id uuid NOT NULL REFERENCES player.game_character (id) ON DELETE CASCADE,
  bar_index    smallint NOT NULL DEFAULT 0,       -- varias barras (estilo WoW)
  slot_index   smallint NOT NULL,
  action_type  text NOT NULL CHECK (action_type IN ('item', 'skill', 'spell', 'emote', 'macro')),
  action_ref   text NOT NULL,                     -- code do item/skill/magia
  PRIMARY KEY (character_id, bar_index, slot_index)
);
COMMENT ON TABLE player.hotbar_slot IS 'Barra de acoes rapidas montada pelo jogador.';

-- Construcoes por chunk (16x16 tiles), igual ao save local do construtor
CREATE TABLE world.build_chunk (
  realm_id                smallint NOT NULL REFERENCES world.realm (id) ON DELETE CASCADE,
  chunk_x                 integer NOT NULL,
  chunk_y                 integer NOT NULL,
  blocks                  jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [[chave, bloco], ...]
  revision                integer NOT NULL DEFAULT 1,           -- concorrencia otimista no multiplayer
  updated_by_character_id uuid REFERENCES player.game_character (id) ON DELETE SET NULL,
  updated_at              timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (realm_id, chunk_x, chunk_y)
);
CREATE TRIGGER build_chunk_updated_at BEFORE UPDATE ON world.build_chunk
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Recursos do mundo alterados pelos jogadores (arvore cortada, toco, cogumelo colhido...).
-- O resto do mundo e procedural (gerado pela semente) e nao precisa ser salvo.
CREATE TABLE world.resource_node_state (
  realm_id   smallint NOT NULL REFERENCES world.realm (id) ON DELETE CASCADE,
  node_id    text NOT NULL,                       -- ex.: chunk_12_40_tree_3
  state      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (realm_id, node_id)
);
CREATE TRIGGER resource_node_state_updated_at BEFORE UPDATE ON world.resource_node_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================================
-- AUDIT - historico de rolagens (cada acao validada por dados)
-- =====================================================================

CREATE TABLE audit.dice_roll (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  realm_id        smallint REFERENCES world.realm (id) ON DELETE CASCADE,
  character_id    uuid REFERENCES player.game_character (id) ON DELETE CASCADE,
  rolled_at       timestamptz NOT NULL DEFAULT now(),
  action_code     text NOT NULL,                  -- ex.: chop_tree, skin_carcass, attack_melee, pick_lock
  dice_expression text NOT NULL,                  -- ex.: '1d20+4', '2d6+3'
  die_code        text NOT NULL REFERENCES ruleset.die (code) ON UPDATE CASCADE,
  results         smallint[] NOT NULL,            -- valor de cada dado
  modifier        integer NOT NULL DEFAULT 0,
  total           integer NOT NULL,
  difficulty      smallint,                       -- CD (null quando nao ha teste, ex.: dano)
  outcome_code    text REFERENCES ruleset.roll_outcome (code) ON UPDATE CASCADE,
  pericia_code    text REFERENCES ruleset.pericia (code) ON UPDATE CASCADE,
  context         jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX dice_roll_character_idx ON audit.dice_roll (character_id, rolled_at DESC);
COMMENT ON TABLE audit.dice_roll IS 'Toda rolagem de dado validada pelo servidor. Particionar por mes quando crescer.';
