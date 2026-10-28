# Suritto — servidor e banco de dados

Banco: **PostgreSQL 18** (local). O servidor (`server.js`) entrega o jogo em http://localhost:3000 e grava no banco
o mundo construído (`world.build_chunk`), as vilas (`world.settlement`), as árvores alteradas e o personagem (`player.*`).
Sem o servidor (ex.: abrindo pelo python), o jogo volta a salvar só no navegador.

## Jogar
Clique em `iniciar_jogo.bat` (ou `npm start` dentro de `server/`). A primeira vez que um navegador abre com o servidor,
as construções que só existiam nele (localStorage) são juntadas ao mundo do banco.

## Importar um arquivo do 💾 Exportar
```bash
npm run db:import -- "C:\caminho\suritto_castelo_vilarejo_123.json"
```
Junta ao mundo sem apagar nada.

## Primeira vez
```bash
cd server
npm install
cp .env.example .env      # preencha DB_PASS (o .env não vai para o Git)
npm run db:setup          # cria o banco "suritto" e aplica as migrações
```

## Migrações
- Ficam em `db/migrations/NNN_nome.sql` e rodam em ordem, cada uma numa transação.
- As já aplicadas ficam registradas em `public.schema_migration`. `npm run db:migrate` aplica só as novas.
- **Nunca edite uma migração já aplicada.** Para mudar algo, crie a próxima (`003_...sql`).

## Schemas
| Schema | Conteúdo |
|---|---|
| `account` | contas (`user_account`) e atalhos de teclado (`keybinding`) |
| `ruleset` | regras do jogo: atributos, dados, raças, classes, perícias, skills, itens |
| `player` | personagem, atributos, skills, perícias, mochila, equipamento, hotbar |
| `world` | realms (servidores), construções por chunk, recursos alterados, relógio |
| `audit` | `dice_roll`: toda rolagem de dado validada |

## Código
| Arquivo | Papel |
|---|---|
| `server.js` | HTTP: arquivos do jogo + rotas `/api/*` (só escuta em 127.0.0.1; nunca entrega `server/` nem arquivos ocultos) |
| `src/db.js` | pool do PostgreSQL, transação, id do realm |
| `src/world_repo.js` | chunks de construção, vilas, recursos do mundo |
| `src/character_repo.js` | snapshot do personagem <-> tabelas `player.*` |
| `scripts/import_blocks.js` | importa o JSON do Exportar |

Rotas: `GET /api/health`, `GET|PUT /api/world/chunks`, `POST /api/world/chunks/merge`, `GET /api/world/settlements`,
`PUT /api/world/settlements/:code`, `GET|PUT /api/characters/:nome`. Sem login ainda: realm `local`, conta `dev`.

Os `code` das tabelas `ruleset` são os mesmos ids usados no JS (`woodcutting`, `sobrevivencia`, `wolf_pelt`...).
O formato do save do jogo (`SaveSystem.buildSnapshot`) espelha as tabelas de `player` e `world`.
