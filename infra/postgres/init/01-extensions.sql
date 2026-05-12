-- Extensões padrão usadas pelo CulturaZ.
-- Executado pelo entrypoint do Postgres apenas na primeira criação do volume.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- pg_trgm é útil para busca por similaridade em title/author (entrega 3+).
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
