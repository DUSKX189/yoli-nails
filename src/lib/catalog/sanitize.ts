// descriptionHtml llega con restos de pegado (<meta charset>, <div class="rte-content">,
// clases ajenas...). Se deja solo una lista cerrada de etiquetas de texto y se quitan
// todos los atributos. El origen es el admin de la propia tienda; esto limpia el
// marcado, no pretende ser un sanitizador genérico para HTML de terceros.

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "h2", "h3", "h4",
]);

export function sanitizeDescription(html: string) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|template)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name: string) => {
      const lower = name.toLowerCase();
      if (!ALLOWED_TAGS.has(lower)) return "";
      if (lower === "br") return "<br>";
      return tag.startsWith("</") ? `</${lower}>` : `<${lower}>`;
    })
    .replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, "")
    .trim();
}
