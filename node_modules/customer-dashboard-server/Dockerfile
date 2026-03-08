# ── Build Stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Production Stage ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Nur Production-Dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Non-root User für Sicherheit
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
