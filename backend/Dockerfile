FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy Prisma schema for generate command during install
COPY prisma ./prisma

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Generate Prisma client for production
RUN npx prisma generate

# Set environment
ENV NODE_ENV=production

# Railway will set PORT environment variable
EXPOSE $PORT

CMD ["npm", "run", "start:migrate"]
