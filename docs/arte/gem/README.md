# Gem "Artista de Sprites de Suritto" (Gemini)

Pacote para criar no Gemini um agente que gera peças do jogo no estilo e no tamanho certos.
Tudo aqui é gerado por `tools/arte/make_gem_kit.py` (menos os .md e as cenas .jpg): rode de novo se o atlas mudar.

## Criar o Gem
1. No Gemini: **Explorar Gems → Novo Gem**.
2. **Nome:** Artista de Sprites de Suritto.
3. **Instruções:** cole todo o conteúdo de `INSTRUCOES_DO_GEM.md`.
4. **Conhecimento:** anexe os arquivos desta pasta:
   - `gabarito_piso.png`, `gabarito_parede.png`, `gabarito_movel_1.png`, `gabarito_movel_2.png`
   - `referencia_pecas.png`, `referencia_personagem.png`, `referencia_cena_interior.jpg`, `referencia_cena_vila.jpg`
   - `paleta.png` e `paleta.txt`
5. Salve. Use um modelo do Gemini que gere imagens.

## Usar
- Peça uma peça por vez e **anexe o gabarito no próprio pedido** (o Gem respeita melhor a imagem da conversa do que a dos arquivos de conhecimento). Ex.:
  > Piso de tábuas de carvalho envelhecido, com pregos de ferro e desgaste no meio. [anexa gabarito_piso.png]
- Gostou de uma peça? Mande ela de volta como referência para as próximas da mesma família ("mesma madeira desta cama").
- Salve cada imagem aprovada em `assets/_novas/` com o nome da **ficha** (ex.: `cama_casal_carvalho.png`) e um `.txt` com a ficha.

## Limites
- O Gem não é treinado com as imagens: ele relê instruções e arquivos a cada pedido. Por isso a consistência vem dos gabaritos e das referências anexadas.
- O gerador nem sempre acerta o ângulo exato ou a cor magenta pura; o importador do jogo corrige pequenas variações (fundo, escala, alinhamento), mas ângulo muito errado precisa ser refeito.
- A paleta saiu puxada para marrom porque madeira e couro dominam as peças atuais; para pedra e ferro, use os cinzas de `referencia_pecas.png`.
- Personagem e animações ficam por último: manter o mesmo boneco em vários quadros é o que a IA mais erra.

## Piloto sugerido
1. Piso de madeira (`gabarito_piso.png`)
2. Cama de casal (`gabarito_movel_2.png`)
3. Textura de telha cerâmica (losango do piso, para virar o material do telhado)

## Importar para o jogo
1. Salve a imagem aprovada em `assets/_novas/`.
2. Diga em `tools/arte/pecas.json` o que ela é (piso que substitui, ou móvel + rotação + células).
3. Rode `python tools/arte/importar_novas.py`. Ele tira o fundo magenta, acerta o piso para 2:1 (corta espessura), escala o móvel pela pegada no chão, calcula o ponto de encaixe e grava em `assets/arte/` + `manifest.json`.
4. Recarregue o jogo: onde houver arte nova ela substitui a antiga; o resto continua igual (`js/art_overrides.js`).

O importador avisa se o móvel passar da altura do muro (furaria o telhado).

Rotações de móvel: `rot 0` = eixo ↘ com a parte de trás no fundo; `rot 90` = eixo ↙ com a parte de trás no fundo; `rot 180`/`270` = a parte de trás perto da câmera (vista B). Rotação sem arte continua com o desenho por código.
