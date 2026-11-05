import Link from "next/link";
import LegalPage, { Field, Section } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Política de privacidad" };

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad">
      <Section title="Quién trata tus datos">
        <p>
          El responsable de tus datos es{" "}
          <Field value={LEGAL.holderName} label="nombre o razón social" />, con NIF{" "}
          <Field value={LEGAL.taxId} label="NIF" />, titular de {LEGAL.tradeName}. Puedes
          escribirnos a <Field value={LEGAL.email} label="correo de contacto" /> o
          llamarnos al {LEGAL.phone}.
        </p>
      </Section>

      <Section title="Qué datos usamos y para qué">
        <ul>
          <li>
            <strong>Pedidos:</strong> tu nombre, dirección, correo, teléfono y los
            datos del pedido, para prepararlo, enviarlo, cobrarlo y atender
            devoluciones o garantías. La base legal es el contrato de compra.
          </li>
          <li>
            <strong>Facturación y contabilidad:</strong> los datos del pedido, para
            cumplir nuestras obligaciones fiscales y contables. La base legal es
            una obligación legal.
          </li>
          <li>
            <strong>Consultas:</strong> los datos que nos des al escribirnos o
            llamarnos, para responderte. La base legal es tu consentimiento o la
            gestión de tu pedido.
          </li>
          <li>
            <strong>Novedades y ofertas:</strong> solo si marcas la casilla en la
            pantalla de pago. Puedes darte de baja cuando quieras desde cualquier
            correo. La base legal es tu consentimiento.
          </li>
        </ul>
        <p>
          Los datos de tu tarjeta no los vemos ni los guardamos: los gestiona
          directamente la plataforma de pago.
        </p>
      </Section>

      <Section title="Con quién los compartimos">
        <p>Solo con los proveedores que necesitamos para darte el servicio:</p>
        <ul>
          <li>
            <strong>Shopify</strong>, la plataforma de la tienda, del carrito y de
            la pantalla de pago, y las plataformas de pago que elijas al pagar.
          </li>
          <li>
            <strong>La empresa de transporte</strong> que entrega tu pedido.
          </li>
          <li>
            <strong>El proveedor del servidor</strong> donde se aloja esta web, en
            la Unión Europea.
          </li>
          <li>
            <strong>Las administraciones públicas</strong>, cuando la ley nos
            obligue.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores, como Shopify, pueden tratar datos fuera
          del Espacio Económico Europeo. En ese caso lo hacen con las garantías
          que exige la ley, como las cláusulas contractuales tipo de la Comisión
          Europea.
        </p>
      </Section>

      <Section title="Cuánto tiempo los guardamos">
        <p>
          Mientras dure la relación contigo y, después, durante los plazos que
          marca la ley: hasta 6 años para la documentación contable y los plazos
          de prescripción de posibles reclamaciones. Los datos para enviarte
          novedades, hasta que te des de baja.
        </p>
      </Section>

      <Section title="Tus derechos">
        <p>
          Puedes pedirnos acceder a tus datos, corregirlos, borrarlos, limitar su
          uso, oponerte a su tratamiento o recibirlos en un formato portable.
          Escríbenos a <Field value={LEGAL.email} label="correo de contacto" />.
        </p>
        <p>
          Si crees que no hemos tratado bien tus datos, puedes reclamar ante la
          Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            www.aepd.es
          </a>
          ).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Consulta nuestra <Link href="/cookies">Política de cookies</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
