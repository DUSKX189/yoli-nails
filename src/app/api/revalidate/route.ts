import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/shopify/client";

// Destino de los webhooks de Shopify (products/create, products/update, products/delete,
// collections/update, inventory_levels/update). Invalida el catálogo cacheado para que
// los cambios se vean sin esperar a la revalidación por tiempo.

function isValidSignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const received = Buffer.from(signature, "base64");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const body = await request.text();
  if (!isValidSignature(body, request.headers.get("x-shopify-hmac-sha256"), secret)) {
    return Response.json({ error: "Firma no válida" }, { status: 401 });
  }

  revalidateTag(CACHE_TAGS.products, { expire: 0 });
  return Response.json({ revalidated: true, topic: request.headers.get("x-shopify-topic") });
}
