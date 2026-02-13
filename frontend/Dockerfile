# Stage 1: Build the application
FROM node:22-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_TASKS_API_URL
ARG VITE_STATS_API_URL
ENV VITE_TASKS_API_URL=$VITE_TASKS_API_URL
ENV VITE_STATS_API_URL=$VITE_STATS_API_URL

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
