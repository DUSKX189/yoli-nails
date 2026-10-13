# Yoli Nails - Web

Web de YOLI NAILS (Next.js 16, App Router) con tienda online headless sobre Shopify
(Storefront API). La documentación de la tienda está en [`.claude/`](.claude/00-LEEME.md).

## Desarrollo

```bash
cp .env.example .env   # y rellena SHOPIFY_STOREFRONT_PRIVATE_TOKEN
pnpm install
pnpm dev
```

Sin token la web funciona, pero la tienda muestra "Estamos preparando la tienda online".

## Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | build | URL pública: canónicas, Open Graph, sitemap |
| `SHOPIFY_STORE_DOMAIN` | runtime | `nqpafx-ad.myshopify.com` |
| `SHOPIFY_STOREFRONT_API_VERSION` | runtime | `2026-07` (por defecto) |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | runtime | Token privado del canal Headless. Solo servidor |
| `SHOPIFY_WEBHOOK_SECRET` | runtime | Firma de los webhooks hacia `/api/revalidate` |

## Estructura de la tienda

```
src/lib/shopify/      cliente GraphQL, queries, catálogo y carrito (solo servidor)
src/lib/catalog/      filtros por URL, etiquetas de tags, formato y saneado de HTML
src/app/actions/      Server Actions del carrito (cookie httpOnly con el cartId)
src/app/tienda/       catálogo con filtros, búsqueda y orden
src/app/producto/     ficha de producto
src/app/api/revalidate  webhook de Shopify → invalida la caché del catálogo
```

El catálogo se cachea 1 hora (etiqueta `products`); el webhook lo invalida al momento.
El carrito vive en Shopify y el pago se hace en su checkout (`cart.checkoutUrl`).

## Despliegue (VPS / Coolify)

`output: "standalone"`: la imagen Docker solo contiene `server.js` y lo mínimo para ejecutarlo.

```bash
docker compose up -d --build
```

En Shopify, crear webhooks (`products/create`, `products/update`, `products/delete`,
`collections/update`, `inventory_levels/update`) apuntando a `https://<dominio>/api/revalidate`.
