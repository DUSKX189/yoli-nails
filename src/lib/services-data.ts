export type ServiceItem = {
  name: string;
  price: string;
  isHeading?: boolean;
  indent?: boolean;
};

export type ServiceCategory = {
  slug: "manos" | "pies" | "depilacion" | "pestanas";
  label: string;
  items: ServiceItem[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "manos",
    label: "Manos",
    items: [
      { name: "Manicura normal (Completa)", price: "18,00€" },
      { name: "Manicura semipermanente", price: "23,90€" },
      { name: "Manicura semipermanente + Base de refuerzo", price: "25,90€" },
      { name: "Limar y Pintar en Normal", price: "12,90€" },
      { name: "Limar y Pintar en Permanente", price: "16,90€" },
      { name: "Limar y Pintar con SP + Base de refuerzo", price: "18,90€" },
      { name: "Uñas acrílicas", price: "45€" },
      { name: "Relleno de Uñas Acrílicas", price: "35€" },
      { name: "Refuerzo de uña natural con Acrílico", price: "30€" },
      { name: "Reconstrucción de uñas mordidas + esmalte", price: "40€" },
      { name: "Reconstrucción de una uña", price: "4€" },
      { name: "Retirada de esmalte semipermanente", price: "7€" },
      { name: "Retirada de Acrílico + Base Fortalecedora", price: "14,90€" },
      { name: "Manicura completa con base niveladora", price: "30€" },
    ],
  },
  {
    slug: "pies",
    label: "Pies",
    items: [
      { name: "Pedicura completa (Spa)", price: "25€" },
      { name: "Limar y Esmaltar en pies", price: "15,90€" },
      { name: "Tratamiento de callos y durezas", price: "29,90€" },
      { name: "Reconstrucción de una uña", price: "4€" },
    ],
  },
  {
    slug: "depilacion",
    label: "Depilación",
    items: [
      { name: "Depilación de cara con hilo", price: "28,90€" },
      { name: "Depilación de cejas Hilo o Cera", price: "9,90€" },
      { name: "Labio Hilo o cera", price: "5,00€" },
      { name: "Patillas Hilo o cera", price: "7€" },
      { name: "Mentón Hilo o cera", price: "7€" },
      { name: "Tinte de cejas", price: "9,90€" },
      { name: "Diseño de Cejas con hilo o cera + tinte", price: "14,90€" },
      { name: "Depilación Ingle completa", price: "24,90€" },
      { name: "Depilación Brasileña", price: "24,90€" },
      { name: "Piernas Completas", price: "23,90€" },
      { name: "Medias piernas", price: "14,90€" },
      { name: "Axilas", price: "9,90€" },
      { name: "Brazos completos", price: "23,90€" },
      { name: "Medios brazos", price: "13,90€" },
    ],
  },
  {
    slug: "pestanas",
    label: "Pestañas",
    items: [
      { name: "Lifting de pestañas", price: "35€" },
      { name: "Lifting de pestañas + tinte", price: "39,90€" },
      { name: "Tinte de Pestañas", price: "15€" },
      { name: "Tinte de Cejas", price: "9,90€" },
      { name: "Depilar cejas + tinte", price: "19,90€" },
      { name: "Laminado de Cejas", price: "35€" },
      { name: "Laminado de Cejas + tinte", price: "38€" },
      { name: "Extensiones:", price: "", isHeading: true },
      { name: "Ipanema Gold (Volumen Natural)", price: "35€", indent: true },
      { name: "Ipanema Platinum (Volumen Medio)", price: "40€", indent: true },
      { name: "Volumen 3D", price: "45€", indent: true },
      { name: "Ipanema Zafiro (Volumen Russo)", price: "54,90€", indent: true },
      { name: "Mega Volumen", price: "65€", indent: true },
      { name: "Más 1 relleno", price: "90€", indent: true },
      { name: "Retirada de extensiones", price: "14,90€", indent: true },
      { name: "Diseño de cejas más tinte", price: "19,90€" },
    ],
  },
];
