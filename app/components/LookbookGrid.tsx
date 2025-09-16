import {Link} from '@remix-run/react';
import {formatPrice} from '~/utils';

type LookbookProduct = {
  id: string;
  handle: string;
  title: string;
  vendor?: string | null;
  tags?: string[] | null;
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

interface LookbookGridProps {
  products: LookbookProduct[];
}

export function LookbookGrid({products}: LookbookGridProps) {
  return (
    <section className="section-shell pb-28">
      <div className="grid gap-10 md:grid-cols-2">
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            prefetch="intent"
            className={`group relative overflow-hidden rounded-4xl border border-slate-800/60 bg-slate-900/70 shadow-lg transition duration-500 hover:-translate-y-1 hover:shadow-neon ${
              index % 3 === 0 ? 'md:row-span-2' : ''
            }`}
          >
            <img
              src={product.featuredImage?.url ?? 'https://cdn.shopify.com/static/sample-images/clothes.jpg'}
              alt={product.featuredImage?.altText ?? product.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent p-8">
              <p className="pill mb-4 w-fit bg-carbon-900/60 text-electric-400">
                {product.vendor ?? 'Thrivv Studio'}
              </p>
              <h3 className="font-display text-2xl text-slate-100">{product.title}</h3>
              {product.priceRange ? (
                <p className="mt-2 text-sm text-electric-400">
                  {formatPrice(
                    Number(product.priceRange.minVariantPrice.amount),
                    product.priceRange.minVariantPrice.currencyCode,
                  )}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">
                {(product.tags ?? ['Limited', 'Techwear']).slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-700/70 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
