-- 009_ground_item_quantidade.sql
-- Qualquer item pode ser largado no chao (nao so arma arremessada) e a pilha inteira vira UM item no chao.
-- Multiplayer: o servidor e quem manda. O jogo faz POST ao largar e DELETE ao pegar (so quem apagou a linha leva o item),
-- e consulta a lista de tempos em tempos para ver o que os outros largaram ou pegaram.
ALTER TABLE world.ground_item ADD COLUMN quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 1);
COMMENT ON COLUMN world.ground_item.quantity IS 'Tamanho da pilha largada (1 para arma).';
