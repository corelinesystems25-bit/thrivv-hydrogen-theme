export const CART_FRAGMENT = `#graphql
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 20) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            product {
              handle
              title
            }
          }
        }
      }
    }
  }
`;

export const CART_QUERY = `#graphql
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      ...CartDetails
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartDetails
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_LINES_ADD_MUTATION = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartDetails
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;
