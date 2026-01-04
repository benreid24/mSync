# Multi-stage build for mSync application

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json ./

# Copy all package.json files first for better caching
COPY apps/api/package.json apps/api/tsconfig.json ./apps/api/
COPY apps/web/package.json apps/web/tsconfig.json apps/web/vite.config.ts ./apps/web/
COPY packages/msync-api-types/package.json packages/msync-api-types/tsconfig.json ./packages/msync-api-types/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY apps/api/src ./apps/api/src
COPY apps/web/src ./apps/web/src
COPY apps/web/index.html ./apps/web/
COPY packages/msync-api-types/src ./packages/msync-api-types/src

# Build all packages
RUN pnpm build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install yt-dlp and ffmpeg
RUN apk add --no-cache yt-dlp ffmpeg

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for production install
COPY apps/api/package.json ./apps/api/
COPY packages/msync-api-types/package.json ./packages/msync-api-types/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/packages/msync-api-types/dist ./packages/msync-api-types/dist

# Create data and music directories
RUN mkdir -p /app/data /app/music

# Environment variables with defaults
ENV NODE_ENV=production \
    PORT=3000 \
    DATA_PATH=/app/data \
    MUSIC_PATH=/app/music \
    YTDLP_PATH=/usr/bin/yt-dlp \
    FFMPEG_PATH=/usr/bin/ffmpeg

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Run the application
CMD ["node", "apps/api/dist/index.js"]
