import type { ProductOption, ProductVariant } from "@/lib/shopify/types";

/** Opción → valor elegido (null = sin elegir). */
export type Selection = Record<string, string | null>;

/** La talla no se preselecciona: así nadie compra la talla equivocada sin darse cuenta. */
export function isSizeOption(name: string) {
  return /^(talla|size)$/i.test(name.trim());
}

function matches(variant: ProductVariant, selection: Selection) {
  return variant.selectedOptions.every(
    ({ name, value }) => selection[name] == null || selection[name] === value
  );
}

/** Variante que corresponde a la selección, solo si todas las opciones están elegidas. */
export function findVariant<V extends ProductVariant>(variants: V[], selection: Selection) {
  if (Object.values(selection).some((v) => v == null)) return null;
  return variants.find((v) => matches(v, selection)) ?? null;
}

/** ¿Hay stock de este valor combinado con lo que ya está elegido en las demás opciones? */
export function isValueAvailable(
  variants: ProductVariant[],
  selection: Selection,
  option: string,
  value: string
) {
  const candidate = { ...selection, [option]: value };
  return variants.some((v) => v.availableForSale && matches(v, candidate));
}

/** Selección inicial: cada opción salvo la talla, con el primer valor que tenga stock. */
export function initialSelection(options: ProductOption[], variants: ProductVariant[]) {
  const selection: Selection = Object.fromEntries(options.map((o) => [o.name, null]));
  for (const option of options) {
    if (isSizeOption(option.name) && option.optionValues.length > 1) continue;
    const values = option.optionValues.map((v) => v.name);
    selection[option.name] =
      values.find((value) => isValueAvailable(variants, selection, option.name, value)) ??
      values[0] ??
      null;
  }
  return selection;
}
