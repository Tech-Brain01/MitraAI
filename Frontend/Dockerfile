# ==========================================
# MitraAI Frontend - Production Dockerfile
# ==========================================
# Multi-stage build with Nginx serving
# Optimized for production deployment
# ==========================================

# Stage 1: Build
FROM node:20-alpine AS builder

LABEL maintainer="MitraAI Team"
LABEL version="1.0.0"
LABEL description="MitraAI Frontend React Application"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:1.27-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (must be after copying from builder to ensure context is available)
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions for nginx user (user already exists in nginx:alpine image)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
