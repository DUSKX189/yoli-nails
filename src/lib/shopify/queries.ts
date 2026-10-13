// Queries de la Storefront API (versión fijada en SHOPIFY_STOREFRONT_API_VERSION).
// Documentación y hallazgos en .claude/02-storefront-api.md y .claude/05-carrito.md.

const IMAGE_FIELDS = /* GraphQL */ `url altText width height`;

const PRODUCT_SUMMARY_FRAGMENT = /* GraphQL */ `
  fragment ProductSummaryFields on Product {
    id
    handle
    title
    vendor
    productType
    tags
    availableForSale
    featuredImage { ${IMAGE_FIELDS} }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
  }
`;

export const PRODUCTS_LIST_QUERY = /* GraphQL */ `
  query ProductsList($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: TITLE) {
      pageInfo { hasNextPage endCursor }
      nodes { ...ProductSummaryFields }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
`;

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductSummaryFields
      description
      descriptionHtml
      seo { title description }
      images(first: 10) { nodes { ${IMAGE_FIELDS} } }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          selectedOptions { name value }
        }
      }
      ingredientes: metafield(namespace: "custom", key: "lista_de_ingredientes") { value }
      uso: metafield(namespace: "custom", key: "indicaciones_de_uso") { value }
    }
  }
  ${PRODUCT_SUMMARY_FRAGMENT}
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount currencyCode }
            image { ${IMAGE_FIELDS} }
            product { handle title vendor }
          }
        }
      }
    }
  }
`;

const CART_PAYLOAD = /* GraphQL */ `
  cart { ...CartFields }
  userErrors { field message code }
  warnings { code message target }
`;

export const GET_CART_QUERY = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
  ${CART_FRAGMENT}
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) { ${CART_PAYLOAD} }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) { ${CART_PAYLOAD} }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_UPDATE_MUTATION = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { ${CART_PAYLOAD} }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_REMOVE_MUTATION = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { ${CART_PAYLOAD} }
  }
  ${CART_FRAGMENT}
`;
