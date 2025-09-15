import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Collections | Thrivv - Elevated Essentials'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(COLLECTIONS_QUERY);

  return defer({collections});
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections relative">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 via-accent-500 to-luxury-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-luxury relative z-10 text-center">
          <h1 className="font-heading text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
            Collections
          </h1>
          <p className="text-xl md:text-2xl font-light animate-slide-up" style={{animationDelay: '0.2s'}}>
            Curated drops for the culture
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="section-padding">
        <div className="container-luxury">
          <Suspense fallback={<CollectionsLoading />}>
            <Await resolve={collections}>
              {({collections}) => (
                <CollectionsGrid collections={collections} />
              )}
            </Await>
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function CollectionsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({length: 6}).map((_, i) => (
        <div key={i} className="luxury-card animate-pulse">
          <div className="aspect-square bg-neutral-200 rounded-t-2xl"></div>
          <div className="p-6">
            <div className="h-6 bg-neutral-200 rounded mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: CollectionFragment[];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="group block luxury-card overflow-hidden animate-slide-up hover:scale-105 transition-all duration-500"
      key={collection.id}
      prefetch="intent"
      to={`/collections/${collection.handle}`}
      style={{animationDelay: `${index * 0.1}s`}}
    >
      {collection.image && (
        <div className="relative overflow-hidden aspect-square">
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(min-width: 45em) 400px, 100vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {/* Floating Badge */}
          <div className="absolute top-4 right-4 bg-luxury-gradient text-white px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide animate-float">
            New
          </div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h3 className="font-heading text-2xl font-bold mb-2 group-hover:gradient-text transition-all">
              {collection.title}
            </h3>
            {collection.description && (
              <p className="text-sm opacity-90 line-clamp-2 group-hover:opacity-100 transition-opacity">
                {collection.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 text-luxury-300 group-hover:text-white transition-colors">
              <span className="font-semibold uppercase tracking-wide text-sm">
                Explore Collection
              </span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Card Content */}
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2 group-hover:gradient-text transition-all">
          {collection.title}
        </h3>
        {collection.description && (
          <p className="text-neutral-600 line-clamp-3 group-hover:text-neutral-700 transition-colors">
            {collection.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-primary-600 font-semibold uppercase tracking-wide text-sm group-hover:text-primary-700 transition-colors">
            Shop Now
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            →
          </div>
        </div>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    description
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

