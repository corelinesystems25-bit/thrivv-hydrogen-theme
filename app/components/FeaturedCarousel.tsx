import {Link} from '@remix-run/react';
import {formatPrice} from '~/utils';

type CarouselProduct = {
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
};

type CarouselCollection = {
  title: string;
  description?: string | null;
  products?: {
    nodes: CarouselProduct[];
  };
};

interface FeaturedCarouselProps {
  collection: CarouselCollection | null;
}

export function FeaturedCarousel({collection}: FeaturedCarouselProps) {
  if (!collection) {
    return null;
  }

  const products = collection.products?.nodes ?? [];

  return (
    <section className="relative z-10 pb-24">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-electric-400/70">Featured Capsule</p>
            <h2 className="font-display text-3xl font-semibold text-slate-100 md:text-4xl">
              {collection.title}
            </h2>
            {collection.description ? (
              <p className="mt-3 max-w-2xl text-sm text-slate-400">{collection.description}</p>
            ) : null}
          </div>
          <Link to="/collections" className="btn-secondary self-start">
            View Lookbook
          </Link>
        </div>
      </div>
      <div className="section-shell overflow-x-auto pb-4">
        <div className="flex min-w-full gap-6 overflow-x-auto pb-6 pr-6 sm:pr-10" style={{scrollSnapType: 'x mandatory'}}>
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              prefetch="intent"
              style={{scrollSnapAlign: 'center'}}
              className="group relative w-[280px] shrink-0 rounded-4xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-neon sm:w-[320px]"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={product.featuredImage?.url ?? 'https://cdn.shopify.com/static/sample-images/clothes.jpg'}
                  alt={product.featuredImage?.altText ?? product.title}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carbon-900 via-transparent to-transparent p-4">
                  <p className="font-display text-lg text-slate-100">{product.title}</p>
                  {product.priceRange ? (
                    <p className="text-sm text-electric-400">
                      {formatPrice(
                        Number(product.priceRange.minVariantPrice.amount),
                        product.priceRange.minVariantPrice.currencyCode,
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                <span>Tap for details</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
