FROM node:20-alpine
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Prisma client generation (needs schema)
COPY prisma ./prisma
RUN npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

# Use start script (plain start or start:migrate if you want migrations)
CMD ["node","dist/main.js"]
