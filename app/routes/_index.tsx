import {Await, Link, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {CountdownTimer} from '~/components/CountdownTimer';
import {FeaturedCarousel} from '~/components/FeaturedCarousel';
import {Hero} from '~/components/Hero';
import {SectionHeading} from '~/components/SectionHeading';
import {formatPrice} from '~/utils';

type FeaturedCollectionResult = {
  collection: {
    title: string;
    description?: string | null;
    products: {
      nodes: Array<{
        id: string;
        handle: string;
        title: string;
        featuredImage?: {
          url: string;
          altText?: string | null;
        } | null;
        priceRange?: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  } | null;
};

type EditorialProductsResult = {
  products: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      featuredImage?: {
        url: string;
        altText?: string | null;
      } | null;
      priceRange?: {
        minVariantPrice: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, env} = context;
  const featuredHandle = env.FEATURED_COLLECTION_HANDLE || 'frontpage';
  const dropDate = env.NEXT_DROP_DATE || new Date(Date.now() + 1209600000).toISOString();

  const featuredCollectionPromise = storefront
    .query<FeaturedCollectionResult>(FEATURED_COLLECTION_QUERY, {
      variables: {handle: featuredHandle},
    })
    .then((data) => data.collection);

  const editorialProductsPromise = storefront
    .query<EditorialProductsResult>(EDITORIAL_PRODUCTS_QUERY, {
      variables: {first: 6},
    })
    .then((data) => data.products.nodes);

  return defer({
    dropDate,
    featuredCollection: featuredCollectionPromise,
    editorialProducts: editorialProductsPromise,
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="space-y-24 pb-32">
      <Hero
        headline="Carbon Sync Capsule"
        subheadline="FW24 Drop"
        description="Thrivv re-engineers luxury streetwear with quantum-layered textiles, luminous circuitry, and silhouettes tuned for city velocity. Each release is limited and hand-signed by the collective."
        primaryCta={{label: 'Explore the drop', to: '/collections'}}
        secondaryCta={{label: 'Learn the story', to: '/about'}}
        dropTagline="Drop 07 releasing soon"
        stats={[
          {label: 'Fabric Lab', value: 'BioSync™'},
          {label: 'Edition', value: '200'},
          {label: 'Members', value: '12K+'},
        ]}
      >
        <CountdownTimer target={data.dropDate} label="Next drop in" />
      </Hero>

      <Suspense fallback={<CarouselSkeleton />}>
        <Await resolve={data.featuredCollection}>
          {(collection) => <FeaturedCarousel collection={collection} />}
        </Await>
      </Suspense>

      <Suspense fallback={<DropPreviewSkeleton />}>
        <Await resolve={data.editorialProducts}>
          {(products) => <DropPreview products={products} />}
        </Await>
      </Suspense>
    </div>
  );
}

function DropPreview({
  products,
}: {
  products: Array<{
    id: string;
    handle: string;
    title: string;
    featuredImage?: {url: string; altText?: string | null} | null;
    priceRange?: {minVariantPrice: {amount: string; currencyCode: string}};
  }>;
}) {
  if (!products.length) return null;

  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow="Drop Preview"
        title="Next up from Thrivv"
        description="A curated edit of silhouettes arriving with the upcoming capsule. Engineered with reflective piped seams, biometric pockets, and adaptive layering."
      />
      <div className="section-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            prefetch="intent"
            className="group overflow-hidden rounded-4xl border border-slate-800/70 bg-slate-900/70 shadow-lg transition hover:-translate-y-1 hover:shadow-neon"
          >
            <div className="overflow-hidden">
              <img
                src={product.featuredImage?.url ?? 'https://cdn.shopify.com/static/sample-images/shoes.jpg'}
                alt={product.featuredImage?.altText ?? product.title}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="space-y-3 p-6">
              <p className="pill w-fit bg-carbon-900/60 text-electric-400">Prototype</p>
              <h3 className="font-display text-xl text-slate-100">{product.title}</h3>
              {product.priceRange ? (
                <p className="text-sm text-electric-400">
                  {formatPrice(
                    Number(product.priceRange.minVariantPrice.amount),
                    product.priceRange.minVariantPrice.currencyCode,
                  )}
                </p>
              ) : null}
              <p className="text-xs text-slate-400">
                Ultralight hydrophobic shell with reinforced seams and NFC-enabled authenticity chip.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CarouselSkeleton() {
  return (
    <section className="section-shell pb-24">
      <div className="mb-8 space-y-4">
        <div className="h-4 w-36 animate-pulse rounded-full bg-slate-800/60" />
        <div className="h-10 w-72 animate-pulse rounded-full bg-slate-800/60" />
        <div className="h-3 w-full max-w-xl animate-pulse rounded-full bg-slate-800/50" />
      </div>
      <div className="flex gap-6 overflow-hidden">
        {Array.from({length: 3}).map((_, index) => (
          <div key={index} className="h-96 w-[280px] animate-pulse rounded-4xl bg-slate-900/60" />
        ))}
      </div>
    </section>
  );
}

function DropPreviewSkeleton() {
  return (
    <section className="section-shell pb-24">
      <div className="mb-8 h-10 w-56 animate-pulse rounded-full bg-slate-800/60" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({length: 3}).map((_, index) => (
          <div key={index} className="h-[420px] animate-pulse rounded-4xl bg-slate-900/60" />
        ))}
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  query FeaturedCollection($handle: String!) {
    collection(handle: $handle) {
      title
      description
      products(first: 8) {
        nodes {
          id
          handle
          title
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const EDITORIAL_PRODUCTS_QUERY = `#graphql
  query EditorialProducts($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
