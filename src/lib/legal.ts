// Datos del titular de la tienda para las páginas legales.
// Los valores en `null` están pendientes: la web muestra «[Pendiente: …]» en su lugar.
// Rellénalos aquí (y solo aquí) cuando Yoli los confirme.

export type LegalField = string | null;

export const LEGAL = {
  /** Nombre comercial. */
  tradeName: "YOLI NAILS",
  /** Nombre y apellidos (autónoma) o razón social (SL). */
  holderName: null as LegalField,
  /** NIF o CIF. */
  taxId: null as LegalField,
  /** Domicilio fiscal o social. */
  registeredAddress: null as LegalField,
  /** Solo si es una sociedad: datos de inscripción en el Registro Mercantil. */
  commercialRegistry: null as LegalField,
  /** Correo de contacto para clientes y para ejercer derechos de privacidad. */
  email: "gestionwebyolinails@gmail.com" as LegalField,
  phone: "+34 664 11 20 92",
  shopAddress: "Calle de Núñez de Balboa, 95, 28006 Madrid",
  /** Dirección a la que se envían las devoluciones. */
  returnsAddress: null as LegalField,
  domain: "yoli-nails.com",
  /** Zonas de envío. Por confirmar si se incluyen Canarias, Ceuta y Melilla. */
  shippingArea: null as LegalField,
  shippingPrice: "6,99 €",
  freeShippingFrom: "55 €",
  deliveryTime: "de 3 a 5 días hábiles",
  lastUpdated: "5 de noviembre de 2026",
};

export const LEGAL_LINKS = [
  { href: "/aviso-legal", label: "Aviso legal" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/condiciones-de-venta", label: "Condiciones de venta" },
  { href: "/envios-y-devoluciones", label: "Envíos y devoluciones" },
] as const;
