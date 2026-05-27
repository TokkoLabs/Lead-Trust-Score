# Dockerfile — Lead Trust Copilot (Next.js 14, Pages Router)
# Build context: root of the repo (run with: docker build -f docker/Dockerfile -t lead-trust-copilot .)

# ──────────────────────────────────────────────
# Stage 1: builder
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY pages/ ./pages/
COPY product/ ./product/
COPY styles/ ./styles/
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY next.config.js ./

# ANTHROPIC_API_KEY is a server-side runtime variable — it must NOT be baked
# into the image. next build does not need it; next start reads it at runtime.
ENV NODE_ENV=production

# Ensure public/ exists (Next.js requires it; may be absent in this repo)
RUN mkdir -p public

RUN npm run build

# ──────────────────────────────────────────────
# Stage 2: runner (lean production image)
# ──────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only what next start needs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Data files are read at runtime by API routes (not embedded in .next build)
COPY --from=builder /app/product/backend/data ./product/backend/data

EXPOSE 3000

# ANTHROPIC_API_KEY is injected at runtime via env_file / -e flag
CMD ["npm", "start"]
