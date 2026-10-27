# Suritto — servidor e banco de dados

Banco: **PostgreSQL 18** (local). Por enquanto o jogo salva no navegador (`js/save_system.js`);
o banco já tem o modelo pronto para quando o servidor multiplayer existir.

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

Os `code` das tabelas `ruleset` são os mesmos ids usados no JS (`woodcutting`, `sobrevivencia`, `wolf_pelt`...).
O formato do save do jogo (`SaveSystem.buildSnapshot`) espelha as tabelas de `player` e `world`.
