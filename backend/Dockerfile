FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy Prisma schema for generate command during install
COPY prisma ./prisma

# Install dependencies (this runs prisma generate via postinstall)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies and source files to reduce image size
RUN rm -rf src test node_modules && npm ci --only=production && npm cache clean --force

# Set environment
ENV NODE_ENV=production

# Railway will set PORT environment variable
EXPOSE $PORT

CMD ["node", "dist/main"]
