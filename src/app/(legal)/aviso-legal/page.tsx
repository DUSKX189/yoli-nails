import Link from "next/link";
import LegalPage, { Field, Section } from "@/components/legal/legal-page";
import { LEGAL } from "@/lib/legal";

export const metadata = { title: "Aviso legal" };

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal">
      <Section title="Titular de la web">
        <p>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI), estos son los datos del
          titular de {LEGAL.domain}:
        </p>
        <ul>
          <li>
            Titular: <Field value={LEGAL.holderName} label="nombre o razón social" />
          </li>
          <li>Nombre comercial: {LEGAL.tradeName}</li>
          <li>
            NIF: <Field value={LEGAL.taxId} label="NIF" />
          </li>
          <li>
            Domicilio: <Field value={LEGAL.registeredAddress} label="domicilio fiscal" />
          </li>
          <li>Establecimiento: {LEGAL.shopAddress}</li>
          <li>
            Correo electrónico: <Field value={LEGAL.email} label="correo de contacto" />
          </li>
          <li>Teléfono: {LEGAL.phone}</li>
          {LEGAL.commercialRegistry && <li>Registro Mercantil: {LEGAL.commercialRegistry}</li>}
        </ul>
      </Section>

      <Section title="Uso de la web">
        <p>
          Al navegar por esta web aceptas usarla de forma lícita y no dañar su
          funcionamiento ni los derechos de terceros. Las compras se rigen por
          nuestras <Link href="/condiciones-de-venta">Condiciones de venta</Link>.
        </p>
      </Section>

      <Section title="Propiedad intelectual">
        <p>
          Los textos, fotografías, logotipos y el diseño de esta web pertenecen a
          su titular o se usan con permiso de sus propietarios. Las marcas y fotos
          de los productos pertenecen a sus fabricantes. No está permitido
          copiarlos ni reutilizarlos sin autorización.
        </p>
      </Section>

      <Section title="Responsabilidad">
        <p>
          Revisamos con cuidado la información de la web, pero puede contener
          errores puntuales que corregiremos en cuanto los detectemos. No nos
          hacemos responsables del contenido de otras webs a las que enlacemos,
          como las plataformas de reserva de citas.
        </p>
      </Section>

      <Section title="Ley aplicable">
        <p>
          Este aviso legal se rige por la ley española. Si eres consumidor,
          puedes acudir a los tribunales de tu domicilio.
        </p>
      </Section>
    </LegalPage>
  );
}
