#!/bin/sh
set -e

echo "Aplicando migraciones de la base de datos..."
npx prisma migrate deploy

exec "$@"
