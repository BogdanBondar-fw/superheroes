#!/bin/sh
set -e

echo "🔄 Starting application with database setup..."

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "🔄 Running database migrations..."
npx prisma migrate deploy || echo "⚠️ Migrations failed, continuing..."

echo "🚀 Starting application..."
exec node dist/src/main.js
