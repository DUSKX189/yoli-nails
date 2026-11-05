import LegalPage, { Section } from "@/components/legal/legal-page";

export const metadata = { title: "Política de cookies" };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies">
      <Section title="Qué son las cookies">
        <p>
          Son pequeños archivos que una web guarda en tu navegador para recordar
          información entre una visita y otra.
        </p>
      </Section>

      <Section title="Cookies que usa esta web">
        <p>
          Esta web <strong>no usa cookies de publicidad ni de analítica</strong>.
          Solo usa una cookie técnica, necesaria para que funcione la tienda:
        </p>
        <ul>
          <li>
            <strong>cartId</strong> (propia): recuerda tu carrito mientras compras.
            Dura 30 días y se borra cuando el carrito caduca o se paga. Al ser
            imprescindible para el servicio que pides, no necesita tu
            consentimiento.
          </li>
        </ul>
      </Section>

      <Section title="Cookies de otras empresas">
        <ul>
          <li>
            <strong>Pantalla de pago (Shopify):</strong> cuando pulsas «pagar»,
            pasas a la pantalla de pago de Shopify, que usa sus propias cookies
            para procesar el pedido de forma segura. Puedes consultarlas en la{" "}
            <a
              href="https://www.shopify.com/es/legal/cookies"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de cookies de Shopify
            </a>
            .
          </li>
          <li>
            <strong>Mapa de Google:</strong> el mapa de la página de Contacto solo
            se carga si pulsas «Ver mapa». En ese momento Google puede guardar sus
            propias cookies. Puedes consultarlas en la{" "}
            <a
              href="https://policies.google.com/technologies/cookies?hl=es"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de cookies de Google
            </a>
            .
          </li>
        </ul>
      </Section>

      <Section title="Cómo borrar o bloquear las cookies">
        <p>
          Puedes borrar o bloquear las cookies desde la configuración de tu
          navegador. Si bloqueas la cookie del carrito, no podrás comprar en la
          tienda.
        </p>
      </Section>
    </LegalPage>
  );
}
