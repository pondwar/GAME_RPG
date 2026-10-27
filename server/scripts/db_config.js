// db_config.js - Le a conexao do .env (carregado com `node --env-file=.env`)
export function dbConfig(database = process.env.DB_NAME || 'suritto') {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database
  };
}
