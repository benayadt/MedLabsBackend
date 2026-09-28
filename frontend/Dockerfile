# Multi-stage build for Next.js frontend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Copy package files for runtime dependencies
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "run", "start"]
