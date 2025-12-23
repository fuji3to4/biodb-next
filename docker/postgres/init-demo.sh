#!/bin/bash
set -e

# Create example database from env and load demo.sql
DB_EX="${BIODB_DB_NAME_EXAMPLE:-demo}"

echo "[init-demo] Preparing database: ${DB_EX}"

# Create database if not exists
EXISTS=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -t -c "SELECT 1 FROM pg_database WHERE datname='${DB_EX}'" | tr -d '[:space:]')
if [ "$EXISTS" != "1" ]; then
  echo "[init-demo] Creating database ${DB_EX}"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c "CREATE DATABASE \"${DB_EX}\""
else
  echo "[init-demo] Database ${DB_EX} already exists"
fi

echo "[init-demo] Loading schema/data into ${DB_EX}"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_EX" -f "/home/user/SQL/demo.sql"

echo "[init-demo] Completed"
