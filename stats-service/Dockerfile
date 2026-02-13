# Stage 1: Base (dependencies)
FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Development (target: dev)
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# Stage 3: Builder (generates dist)
FROM base AS builder
COPY . .
RUN npm run build

# Stage 4: Production (minimal image)
FROM node:alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
ENV PORT=3002
ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "dist/server.js"]
