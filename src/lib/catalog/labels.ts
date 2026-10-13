// Los tags de Shopify son identificadores con prefijo ("necesidad:antiedad").
// Este diccionario da el texto visible; ver .claude/01-estructura-tienda.md.

export const TAG_LABELS: Record<string, string> = {
  "necesidad:antiedad": "Antiedad",
  "necesidad:hidratacion": "Hidratación",
  "necesidad:acne-piel-grasa": "Acné y piel grasa",
  "necesidad:luminosidad-antimanchas": "Luminosidad y antimanchas",
  "necesidad:calmante": "Calmante",
  "necesidad:solar": "Protección solar",
  "necesidad:ojeras-bolsas": "Ojeras y bolsas",
  "necesidad:piernas-cansadas": "Piernas cansadas",
  "piel:mixta-grasa": "Piel mixta o grasa",
  "piel:madura": "Piel madura",
  "piel:sensible": "Piel sensible",
  "piel:seca-deshidratada": "Piel seca o deshidratada",
  "piel:todo-tipo": "Todo tipo de piel",
  "zona:rostro": "Rostro",
  "zona:ojos": "Contorno de ojos",
  "zona:cuerpo": "Cuerpo",
  "momento:dia": "Día",
  "momento:noche": "Noche",
  "momento:dia-noche": "Día y noche",
  "linea:matipur": "Línea Matipur",
  "linea:active": "Línea Active",
  "linea:essential": "Línea Essential",
  "linea:purifying": "Línea Purifying",
  "linea:special-c": "Línea Special C",
  "linea:vita-c": "Línea Vita C",
  "atributo:vegano": "Vegano",
};

/** Texto visible de un tag; si no está en el diccionario, se humaniza el slug. */
export function tagLabel(tag: string) {
  if (TAG_LABELS[tag]) return TAG_LABELS[tag];
  const value = tag.slice(tag.indexOf(":") + 1).replace(/-/g, " ");
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const VEGAN_TAG = "atributo:vegano";
