FROM node:18 AS builder
WORKDIR /app

# Copy package files & install deps
COPY package*.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 6000
CMD ["node", "dist/index.js"]