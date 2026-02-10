# Build stage
FROM node:22-slim AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build client and server
RUN pnpm build

# Production stage
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install pnpm for production install
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server/production.mjs"]
