FROM node:20-alpine
WORKDIR /app

# Copy package manifests and prisma schema first (postinstall runs prisma generate)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Copy the rest of the source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production

# Railway assigns dynamic port via PORT env var, don't hardcode expose
CMD ["npm", "run", "start:prod"]
