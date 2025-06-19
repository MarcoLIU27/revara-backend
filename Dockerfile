# Build stage
FROM node:18 AS builder
WORKDIR /app

# Copy package files & install deps
COPY package*.json ./
RUN npm ci

# Copy source files & build
COPY . .
RUN npm run build

# --- Production stage ---
FROM node:18 AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]
