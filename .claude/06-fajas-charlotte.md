# 06 — Fajas Charlotte

Fecha: 14 de octubre de 2026. Fuente: respuestas reales de la Storefront API salvo donde se indica **[PENDIENTE]**.

## Decisiones

- Tienda separada de la cosmética en `/fajas-charlotte` (listado) y `/fajas-charlotte/[handle]` (ficha). `/tienda` sigue siendo solo cosmética.
- Misma identidad visual que la tienda actual.
- Carrito y checkout **compartidos** con la cosmética.
- Sin filtros ni paginación: son 5 productos.
- Discriminador: `productType = "Faja"`. `getProducts()` excluye ese tipo (`FAJA_PRODUCT_TYPE` en `src/lib/shopify/products.ts`).

## Shopify [VERIFICADO]

- Colección automática `fajas-charlotte` ("Fajas Charlotte"), regla *Tipo de producto = Faja*, publicada en Headless. Sin descripción ni imagen.
- 5 productos: `c-1-peggy` (90 €), `c-2-leire` (45 €), `c-3-sofia` (45 €), `c-4-brida` (38 €), `c-5-alessia` (38 €). Todos `vendor = Charlotte`, Color (Beige/Black) × Talla (XS–3XL), stock en S–XL.
- Opciones: `Talla` (XS, S, M, L, XL, 2XL, 3XL) y `Color` (Beige, Black). La opción Talla va primero, así que el título de variante es `"M / Beige"`. **No asumir el orden**: leer siempre `selectedOptions` por nombre.
- 14 variantes; stock real en S–XL, a 0 en XS, 2XL y 3XL.

### Metacampos de producto

| Clave | Tipo | Estado |
|---|---|---|
| `custom.guia_de_tallas` | `metaobject_reference` → `guia_de_tallas` | OK (ojo: no es `guia_tallas`) |
| `custom.cuidados` | `multi_line_text_field` | OK |
| `custom.composicion` | — | **[PENDIENTE]** llega `null`: vacío, otra clave o sin acceso Storefront |

### Metaobjeto `guia_de_tallas`

Entrada `guia-fajas-charlotte`. Campos: `nombre`, `filas` (`list.metaobject_reference` → `fila_de_talla`, en orden XS→3XL), `como_medir` e `imagen` (vacíos; la API omite los campos vacíos).

### Metaobjeto `fila_de_talla`

Todos `single_line_text_field`. Valores en cm, sin unidad, con guion largo (–) y coma decimal. La API devuelve los campos en orden alfabético de clave.

| Clave | Ejemplo (M) |
|---|---|
| `talla` | `M` (coincide con el valor de la opción Talla; es la clave de unión) |
| `cintura` | `72–78` |
| `cadera` | `90–98` |
| `busto_superior` | `86–92` |
| `bajo_pecho` | `80–98` |
| `largo_manga_3_4` | `36,5` |
| `largo_manga_larga` | `47,5` |

Las medidas son las del proveedor en cm, tal cual (decisión del cliente). Hay rangos solapados entre tallas (busto superior S, bajo pecho M).

## Frontend

- Datos: `getFajas()` (colección `fajas-charlotte`, orden de la colección) y `getFaja(handle)` (devuelve null si el producto no es una faja) en `src/lib/shopify/products.ts`; la guía se aplana a `SizeGuide` con filas `SizeGuideRow`.
- Rutas: `productHref()` (`src/lib/catalog/routes.ts`) decide `/producto/…` o `/fajas-charlotte/…`. `/producto/<faja>` redirige con 308 a su ficha.
- Ficha: `FajaPurchase` (cliente) lleva la galería, el selector y el botón. La talla no se preselecciona; el resto de opciones toman el primer valor con stock. Las variantes se buscan por `selectedOptions`. La galería solo salta a la foto de la variante si las variantes tienen fotos distintas.
- Listado: `FajaCard` (ref. y nombre separados del título "C-1 Peggy", segunda foto al pasar el ratón, muestras de color y rango de tallas con stock). Flex centrado: la última fila incompleta queda en el centro (5 = 3 + 2). `getFajas()` trae `images(first: 2)`, `options` y las variantes mínimas para eso.
- Cantidad: `QuantitySelector` junto al botón; el tope es `quantityAvailable` de la variante (o 99, el mismo límite que las Server Actions) y vuelve a 1 al cambiar de variante.
- `SizeGuideTable` oculta las columnas sin datos (modelos sin manga).
- El carrito muestra el título de la variante (salvo `Default Title`) y enlaza a la ficha correcta (`productType` añadido al fragmento del carrito).
- Navegación: "Cuidado Facial" (`/tienda`, misma URL) y "Fajas Charlotte". El menú horizontal aparece desde `lg`; por debajo, hamburguesa.

## Pendientes

0. `c-5-alessia` sin guía de tallas asignada; `c-1-peggy` sin muestras de color; la colección se ordena de la más nueva a la más antigua (cambiar a A-Z o manual en Shopify).

1. Composición y cuidados: **descartados por ahora** (no hay datos); el frontend no los pide.
2. `custom.cuidados` existe pero contiene usos ("Post-quirúrgico, post-parto y uso diario."), no instrucciones de lavado.
3. Color sin vincular a la categoría (`swatch: null`) y valor en inglés (`Black`).
4. Todas las variantes con la misma imagen (aún no hay fotos por color); el frontend ya las usa en cuanto existan.
5. Sin SKU ni `altText`.
6. Editar un metaobjeto no dispara los webhooks de producto: valorar suscribir `metaobjects/update` a `/api/revalidate`.
7. Desplegar: la web provisional aún no excluye las fajas de `/tienda`.
8. Sin imagen ni descripción en la colección; el hero usa `public/images/hero-fajas.jpg` (de la demo `yn-web`).
