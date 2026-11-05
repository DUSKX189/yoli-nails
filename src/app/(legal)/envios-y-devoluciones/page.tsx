import LegalPage, { Field, Section } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Envíos y devoluciones" };

export default function EnviosDevolucionesPage() {
  return (
    <LegalPage title="Envíos y devoluciones">
      <Section title="Envíos">
        <ul>
          <li>
            Dónde enviamos: <Field value={LEGAL.shippingArea} label="zonas de envío" />.
          </li>
          <li>
            Precio: {LEGAL.shippingPrice} por pedido.{" "}
            <strong>Envío gratis en pedidos a partir de {LEGAL.freeShippingFrom}.</strong>
          </li>
          <li>
            Plazo: {LEGAL.deliveryTime} desde que se confirma el pedido. Los fines
            de semana y festivos no cuentan.
          </li>
          <li>
            Cuando enviemos tu pedido te llegará un correo con el número de
            seguimiento.
          </li>
        </ul>
        <p>
          Si tu pedido no llega a tiempo o llega dañado, escríbenos a{" "}
          <Field value={LEGAL.email} label="correo de contacto" />.
        </p>
      </Section>

      <Section title="Derecho de devolución (desistimiento)">
        <p>
          Tienes <strong>14 días naturales</strong> desde que recibes tu pedido
          para devolverlo sin dar explicaciones. Para hacerlo, escríbenos a{" "}
          <Field value={LEGAL.email} label="correo de contacto" /> con tu número de
          pedido y te indicaremos los pasos.
        </p>
        <p>
          Envía los productos a:{" "}
          <Field value={LEGAL.returnsAddress} label="dirección de devoluciones" />. Los
          gastos del envío de vuelta corren a tu cargo, salvo que el producto sea
          defectuoso o no sea el que pediste.
        </p>
      </Section>

      <Section title="Productos que no se pueden devolver">
        <p>
          Por motivos de salud e higiene, no se aceptan devoluciones de
          cosméticos ni de fajas y prendas moldeadoras que se hayan abierto,
          desprecintado o usado. Los productos deben devolverse sin usar, con su
          precinto y en su embalaje original.
        </p>
      </Section>

      <Section title="Reembolso">
        <p>
          Te devolveremos el importe de los productos y los gastos de envío
          estándar del pedido en un máximo de 14 días desde que nos comuniques la
          devolución, con el mismo método de pago que usaste. Podemos esperar a
          recibir el producto, o a que nos envíes el justificante de envío, antes
          de hacer el reembolso.
        </p>
      </Section>

      <Section title="Productos defectuosos o equivocados y garantía">
        <p>
          Si tu pedido llega dañado, tiene un defecto o no es lo que pediste,
          escríbenos con fotos del producto y te lo cambiamos o te devolvemos el
          dinero, sin coste para ti. Todos los productos tienen la garantía legal
          de 3 años.
        </p>
      </Section>
    </LegalPage>
  );
}
