import Link from "next/link";
import LegalPage, { Field, Section } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Condiciones de venta" };

export default function CondicionesPage() {
  return (
    <LegalPage title="Condiciones de venta">
      <Section title="Quiénes somos">
        <p>
          La tienda online de {LEGAL.domain} la gestiona{" "}
          <Field value={LEGAL.holderName} label="nombre o razón social" />, con NIF{" "}
          <Field value={LEGAL.taxId} label="NIF" /> y domicilio en{" "}
          <Field value={LEGAL.registeredAddress} label="domicilio fiscal" />. Contacto:{" "}
          <Field value={LEGAL.email} label="correo de contacto" /> · {LEGAL.phone}.
        </p>
      </Section>

      <Section title="Precios">
        <p>
          Los precios están en euros e incluyen el IVA. Los gastos de envío se
          muestran antes de pagar. Consulta la{" "}
          <Link href="/envios-y-devoluciones">política de envíos y devoluciones</Link>.
        </p>
      </Section>

      <Section title="Cómo se hace un pedido">
        <ul>
          <li>Añade los productos al carrito y pulsa «Finalizar compra».</li>
          <li>Rellena tus datos de envío y elige cómo pagar.</li>
          <li>Revisa el pedido antes de confirmarlo.</li>
          <li>
            Al terminar, recibirás un correo con la confirmación del pedido. En
            ese momento la compra queda cerrada.
          </li>
        </ul>
        <p>
          Si un producto se agota o hay un error evidente en el precio, te
          avisaremos y podrás cancelar el pedido con el reembolso completo.
        </p>
      </Section>

      <Section title="Pago">
        <p>
          Puedes pagar con los métodos que aparecen en la pantalla de pago. El
          pago lo procesa una plataforma segura y nosotros no vemos ni guardamos
          los datos de tu tarjeta.
        </p>
      </Section>

      <Section title="Envío, devoluciones y garantía">
        <p>
          Tienes 14 días para devolver tu pedido y todos los productos tienen la
          garantía legal de 3 años. Encontrarás todos los detalles en la{" "}
          <Link href="/envios-y-devoluciones">política de envíos y devoluciones</Link>.
        </p>
      </Section>

      <Section title="Reclamaciones">
        <p>
          Si tienes cualquier problema con tu pedido, escríbenos a{" "}
          <Field value={LEGAL.email} label="correo de contacto" /> y te
          responderemos lo antes posible. También puedes pedirnos las hojas de
          reclamaciones.
        </p>
      </Section>

      <Section title="Ley aplicable">
        <p>
          Estas condiciones se rigen por la ley española. Si eres consumidor,
          puedes acudir a los tribunales de tu domicilio.
        </p>
      </Section>
    </LegalPage>
  );
}
