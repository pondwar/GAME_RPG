# Suritto: regras do projeto

Jogo de RPG isométrico no navegador, em JavaScript puro (canvas 2D, sem motor), com servidor Node e PostgreSQL em `server/`.
Regras do jogo: D&D 5e / Tormenta20, **tempo real** (nunca por turnos), interface estilo WoW.
O usuário não é programador. **Responda sempre em português do Brasil, em linguagem simples.**

## REGRA DE OURO: tudo que se move usa as 8 direções
Jogador, NPCs, animais, monstros, objetos e **toda ação** (andar, golpes, pular, sentar, comer, voar...) têm de existir nas **8 direções**: baixo, cima, esquerda, direita e as 4 diagonais. O jogo não é 2D comum: a meta é simular 3D com movimento fluido.
Desenha-se 5 vistas (frente, costas, lado, 3/4 frente, 3/4 costas, todas da esquerda) e o jogo **espelha** as 3 da direita. Vale para código, prompts, Kaggle e docs. Detalhes e checklist em `docs/REGRA_8_DIRECOES.md`.
Teste de golpe nas 8 direções do mouse (45° baixo-esq, 135° cima-esq, 225° cima-dir, 315° baixo-dir além das 4 principais).

## Segurança (nunca quebrar)
- A senha do banco e a `GEMINI_API_KEY` ficam só em `server/.env`. Nunca ler em voz alta, commitar ou repetir.
- Nunca sobrescrever os personagens "Aventureiro" e "Pondwar". Nunca fazer login pelo usuário; só clicar em personagem já existente.
- Nada de `git push --force`, `reset --hard` nem apagar pastas sem pedir.

## Como testar
- Servidor de teste na porta **3001** (o usuário usa a 3000). Para subir, usar um `.claude/launch.json` temporário e **apagar depois**.
- Antes de testar no jogo, desligar o salvamento: `game.saveSystem._resetting = true; game.saveSystem.save = () => true;`
- Fechar abas e servidores de teste ao terminar.
- Mudou algo visual ou de combate? Não entregue sem ver rodar. Se o painel do navegador estiver escondido, gere a prancha offline (`tools/arte/`) e diga claramente o que não foi visto ao vivo.
- **Golpes: validar sempre nas 8 direções do mouse**, vistas por quem olha a tela: 0° baixo, 90° esquerda, 180° cima, 270° direita e as diagonais 45° baixo-esq, 135° cima-esq, 225° cima-dir, 315° baixo-dir.

## Código
- Mexeu em JS? Suba o `?v=` do arquivo no `index.html`.
- Combate fica em `js/combate.js` (ficha das armas, rolagem d20, quadros do golpe); desenho do boneco em `js/game.js`; armas SRD em `js/armas.js`; raças e classes em `js/ruleset.js`.
- Toda mecânica passa pela rolagem de dados central. Não inventar regra fora da ficha D&D.
- Mudança pequena e direta. Não reescrever o que funciona.

## Arte (Gemini 3.8 Flash pelo navegador)
- **Movimento antes da arma:** arma nova começa pelo sprite do golpe com o boneco SEM arma; depois a arma; depois o encaixe na mão. Catálogo e prompts em `docs/arte/MOVIMENTOS_ARMAS.md`.
- Foco atual: **só a raça humana**, completa, antes das outras.
- Preferir **uma folha com todos os quadros** por pedido (economiza token); refazer só o quadro ruim.
- Pegar a imagem com "Copiar imagem", nunca "Baixar no tamanho original" (borra).
- Cabelo e barba em verde chroma `#00FF00`; fundo magenta `#FF00FF`; boneco com 76 px de altura no jogo.
- Prompts-padrão das folhas: `docs/arte/PROMPTS_FOLHAS.md`.

## Commits
- Só quando o usuário pedir. Autor: `git -c user.name="davidcampospca" -c user.email="david.campos@pca.com.br" commit`.
- Terminar a mensagem com a linha `Co-Authored-By` indicada pela sessão, e dar push.
- Arquivos soltos que **não** entram: `assets/_novas/_ref_andar.png`, `_ref_parado.png`, `comparar_diagonais.png`.
