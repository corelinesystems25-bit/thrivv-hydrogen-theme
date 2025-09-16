import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type {LinksFunction} from '@remix-run/node';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import {Seo, ShopifySalesChannel, useShopifyCookies} from '@shopify/hydrogen';
import {Layout} from '~/components/Layout';
import tailwind from '~/styles/tailwind.css?url';
import {CART_QUERY} from '~/graphql/cart';
import type {CartWithLines, ShopBasics} from '~/components/Layout';

export const links: LinksFunction = () => [
  {rel: 'preconnect', href: 'https://cdn.shopify.com'},
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
  {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@500;600&display=swap',
  },
  {rel: 'stylesheet', href: tailwind},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, session, env} = context;
  const cartId = await session.get('cartId');

  const shopPromise = storefront.query<ShopBasics>(SHOP_QUERY);
  const cartPromise = cartId
    ? storefront
        .query<{cart: CartWithLines | null}>(CART_QUERY, {
          variables: {cartId},
        })
        .then((result) => result.cart)
    : Promise.resolve(null);

  return defer({
    shop: shopPromise,
    cart: cartPromise,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN ?? '',
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  useShopifyCookies();

  return (
    <html lang="en" className="bg-carbon-950">
      <head>
        <Meta />
        <Links />
        <Seo />
        <ShopifySalesChannel />
      </head>
      <body className="bg-carbon-950 text-slate-100">
        <Layout cart={data.cart} shop={data.shop}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const SHOP_QUERY = `#graphql
  query RootShopInfo {
    shop {
      name
      description
      primaryDomain {
        url
      }
    }
  }
`;
