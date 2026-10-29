-- 004_world_fauna.sql - Ecossistema por regiao (js/fauna.js): flora e populacoes de cada regiao do mundo.
-- O mundo e dividido em regioes de 1536 px (rx, ry = floor(x / 1536), floor(y / 1536)).
-- state (jsonb), para nao precisar de migracao a cada especie nova:
--   { "plants": { "grass": 0.55, "berries": 0.3, "mushrooms": 0.1 },   -- quantidade de cada recurso (0..capacidade do bioma)
--     "pop":    { "deer": 4.2, "wolf": 3.1, "rabbit": 6 ... },          -- animais da regiao (em numeros)
--     "hunger": { "wolf": 0.4 ... } }                                    -- fome media de cada especie (0..1)
-- Os animais perto de um jogador existem como entidades no navegador e entram na contagem da regiao onde estao ao salvar.

CREATE TABLE world.fauna_region (
  realm_id   smallint NOT NULL REFERENCES world.realm (id) ON DELETE CASCADE,
  rx         integer NOT NULL,
  ry         integer NOT NULL,
  state      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (realm_id, rx, ry)
);
CREATE TRIGGER fauna_region_updated_at BEFORE UPDATE ON world.fauna_region
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
COMMENT ON TABLE world.fauna_region IS 'Ecossistema por regiao de 1536 px: flora (plants), populacoes (pop) e fome (hunger) por especie. Ver js/fauna.js.';
