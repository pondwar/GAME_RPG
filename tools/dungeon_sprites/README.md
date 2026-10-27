# Dungeon sprites (65 peças, isométrico 2.5D)

Pastas `1x/`, `2x/` e `4x/` (mesma estrutura em cada uma):
- stone_walls (20) · brick_walls (11) · wood_walls (9) · doors (12) · gates (7) · arches (2) · ruins (4)

- 1x = resolução original, limpa (sem ruído de JPEG, sem fundo verde, paleta única de 96 cores)
- 2x / 4x = ampliação por vizinho mais próximo (pixels nítidos, sem borrar). Use 2x/4x se o seu jogo roda em resolução maior.
- Todos os PNG têm fundo transparente. Sombras no chão (arcos, porta aberta) são preto semitransparente.

Atlas (para engines): `atlas/dungeon_atlas_1x.png|json` e `atlas/dungeon_atlas_2x.png|json`.
O JSON tem frame (x,y,w,h), categoria e pivô sugerido (0.5, 1.0 = base central).

`sprites_index.json` lista nome, categoria e tamanho de cada peça. `contact_sheet.png` é uma prévia de todas.
