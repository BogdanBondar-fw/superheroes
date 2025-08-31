#!/bin/sh
set -e

echo "🔄 Starting application..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..." # Show only first 50 chars for security

echo "🔄 Generating Prisma client..."
npx prisma generate

echo "🔄 Testing database connection..."
if echo "SELECT 1;" | npx prisma db execute --stdin >/dev/null 2>&1; then
  echo "✅ Database connection works"
  echo "🔄 Running migrations..."
  npx prisma migrate deploy || echo "⚠️ Migrations failed, continuing..."
else
  echo "⚠️ Database connection failed, starting app anyway..."
fi

echo "🚀 Starting application..."
exec node dist/src/main.js
