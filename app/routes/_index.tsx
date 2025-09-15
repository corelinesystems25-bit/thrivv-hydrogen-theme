import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Thrivv | Elevated Essentials. Street Certified.'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({
    featuredCollection: collections.nodes[0],
    recommendedProducts,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <CultureSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-luxury-gradient animate-gradient"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full floating-element"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-white/5 rounded-full floating-element" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/15 rounded-full floating-element" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 text-center text-white px-6 animate-fade-in">
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-wider mb-6">
          Thrivv
        </h1>
        <p className="text-xl md:text-3xl font-light mb-4 animate-slide-up" style={{animationDelay: '0.5s'}}>
          Elevated Essentials
        </p>
        <p className="text-lg md:text-2xl font-script mb-12 animate-slide-up" style={{animationDelay: '1s'}}>
          Street Certified
        </p>
        <Link
          to="/collections"
          className="luxury-button text-lg md:text-xl animate-scale-in"
          style={{animationDelay: '1.5s'}}
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;

  const image = collection?.image;
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <h2 className="text-center mb-16 gradient-text animate-slide-up">Featured Collection</h2>
        <Link
          className="block group"
          key={collection.id}
          prefetch="intent"
          to={`/collections/${collection.handle}`}
        >
          {image && (
            <div className="relative overflow-hidden rounded-4xl mb-8 luxury-card">
              <Image
                alt={image.altText || collection.title}
                aspectRatio="16/9"
                data={image}
                loading="eager"
                sizes="(min-width: 45em) 80vw, 100vw"
                className="group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl md:text-4xl font-heading font-bold">{collection.title}</h3>
              </div>
            </div>
          )}
        </Link>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <section className="section-padding bg-white/50">
      <div className="container-luxury">
        <h2 className="text-center mb-16 gradient-text animate-slide-up">Featured Drops</h2>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <Await resolve={products}>
            {({products}) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.nodes.map((product, index) => (
                  <Link
                    key={product.id}
                    className="group block luxury-card p-0 overflow-hidden animate-slide-up"
                    prefetch="intent"
                    to={`/products/${product.handle}`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {product.featuredImage && (
                      <div className="relative overflow-hidden">
                        <Image
                          alt={product.featuredImage.altText || product.title}
                          aspectRatio="1/1"
                          data={product.featuredImage}
                          loading="lazy"
                          sizes="(min-width: 45em) 400px, 100vw"
                          className="group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h4>
                      <div className="text-neutral-600 font-mono">
                        <Money data={product.priceRange.minVariantPrice} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function CultureSection() {
  return (
    <section className="section-padding bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Culture
              <span className="block text-primary-400 font-script text-3xl md:text-5xl">
                Meets Commerce
              </span>
            </h2>
            <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
              We're not just selling products. We're building a movement. 
              Every piece tells a story, every drop creates culture.
            </p>
            <Link
              to="/blogs"
              className="luxury-button"
            >
              Read Our Story
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="luxury-card p-6 text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">10K+</div>
              <div className="text-neutral-300">Community Members</div>
            </div>
            <div className="luxury-card p-6 text-center">
              <div className="text-3xl font-bold text-accent-400 mb-2">50+</div>
              <div className="text-neutral-300">Exclusive Drops</div>
            </div>
            <div className="luxury-card p-6 text-center">
              <div className="text-3xl font-bold text-luxury-400 mb-2">100%</div>
              <div className="text-neutral-300">Authentic</div>
            </div>
            <div className="luxury-card p-6 text-center">
              <div className="text-3xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-neutral-300">Culture</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-500 via-accent-500 to-luxury-500 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container-luxury relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-heading font-bold mb-4 animate-slide-up">
          Join the Thrivv Movement
        </h2>
        <p className="text-xl md:text-2xl mb-12 font-light animate-slide-up" style={{animationDelay: '0.2s'}}>
          Weekly drops, culture & insider deals
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-scale-in" style={{animationDelay: '0.4s'}}>
          <input
            type="email"
            placeholder="Enter your email"
            className="premium-input flex-1 text-neutral-900 placeholder-neutral-500"
            required
          />
          <button
            type="submit"
            className="luxury-button bg-white text-neutral-900 hover:bg-neutral-100"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

