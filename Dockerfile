# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# Dependencias (capa cacheada mientras no cambie el lockfile)
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build. Las variables NEXT_PUBLIC_* se incrustan aquí, en tiempo de build.
# Las de Shopify también hacen falta para prerenderizar el catálogo y las fajas:
# solo existen en esta etapa y no pasan a la imagen final.
FROM base AS builder
ARG NEXT_PUBLIC_APP_URL
ARG SHOPIFY_STORE_DOMAIN
ARG SHOPIFY_STOREFRONT_API_VERSION
ARG SHOPIFY_STOREFRONT_PRIVATE_TOKEN
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV SHOPIFY_STORE_DOMAIN=$SHOPIFY_STORE_DOMAIN
ENV SHOPIFY_STOREFRONT_API_VERSION=$SHOPIFY_STOREFRONT_API_VERSION
ENV SHOPIFY_STOREFRONT_PRIVATE_TOKEN=$SHOPIFY_STOREFRONT_PRIVATE_TOKEN
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runtime: solo la salida standalone, sin node_modules completos ni pnpm.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
