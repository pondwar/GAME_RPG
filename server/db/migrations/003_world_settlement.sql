-- 003_world_settlement.sql - Vilas e cidades do mundo (geradas a partir de js/town_plans.js)
-- As pecas da vila ficam em world.build_chunk como qualquer construcao (com "town" no bloco);
-- aqui fica o registro da vila e a assinatura da planta usada para monta-la (mudou a planta -> remonta).

CREATE TABLE world.settlement (
  realm_id   smallint NOT NULL REFERENCES world.realm (id) ON DELETE CASCADE,
  code       text NOT NULL,                       -- id em js/town_plans.js (ex.: vila_inicial)
  name       text NOT NULL,                       -- nome exibido (gerado pela macro-regiao ou fixo)
  region_code text,                               -- macro-regiao (js/regions.js)
  center_x   double precision NOT NULL,
  center_y   double precision NOT NULL,
  signature  text NOT NULL,                       -- assinatura da planta montada
  built_at   timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (realm_id, code)
);
CREATE TRIGGER settlement_updated_at BEFORE UPDATE ON world.settlement
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
COMMENT ON TABLE world.settlement IS 'Vilas/cidades montadas no realm. Base para o spawn por macro-regiao no multiplayer.';

-- Conta de desenvolvimento (sem login ainda): dono dos personagens criados no localhost
INSERT INTO account.user_account (username, status) VALUES ('dev', 'active');
