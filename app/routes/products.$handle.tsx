import {useFetcher, useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {useMemo, useState} from 'react';
import {ProductMediaGallery} from '~/components/ProductMediaGallery';
import {SectionHeading} from '~/components/SectionHeading';
import {formatPrice} from '~/utils';

type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
};

type ProductResponse = {
  product: {
    id: string;
    title: string;
    descriptionHtml: string;
    vendor?: string | null;
    tags?: string[] | null;
    images: {
      nodes: Array<{
        id: string;
        url: string;
        altText?: string | null;
      }>;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    variants: {
      nodes: ProductVariant[];
    };
    metafield?: {
      value: string;
    } | null;
    seo?: {
      title?: string | null;
      description?: string | null;
    } | null;
  } | null;
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront, session} = context;

  if (!handle) {
    throw new Response('Not found', {status: 404});
  }

  const data = await storefront.query<ProductResponse>(PRODUCT_QUERY, {
    variables: {handle},
  });

  if (!data.product) {
    throw new Response('Not found', {status: 404});
  }

  const cartId = await session.get('cartId');

  return json({product: data.product, cartId});
}

export default function ProductHandle() {
  const {product, cartId} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [quantity, setQuantity] = useState(1);

  const initialOptions = useMemo(() => {
    const defaults = new Map<string, string>();
    const primaryVariant = product.variants.nodes[0];
    if (primaryVariant) {
      primaryVariant.selectedOptions.forEach((option) => {
        defaults.set(option.name, option.value);
      });
    } else {
      product.options.forEach((option) => {
        defaults.set(option.name, option.values[0]);
      });
    }
    return defaults;
  }, [product.options, product.variants.nodes]);

  const [selectedOptions, setSelectedOptions] = useState<Map<string, string>>(
    () => new Map(initialOptions),
  );

  const selectedVariant = useMemo(() => {
    return (
      product.variants.nodes.find((variant) =>
        variant.selectedOptions.every(
          (option) => selectedOptions.get(option.name) === option.value,
        ),
      ) ?? product.variants.nodes[0]
    );
  }, [product.variants.nodes, selectedOptions]);

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => new Map(prev).set(name, value));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    const formData = new FormData();
    formData.append('merchandiseId', selectedVariant.id);
    formData.append('quantity', String(quantity));
    if (cartId) {
      formData.append('cartId', cartId);
    }
    fetcher.submit(formData, {method: 'POST', action: '/cart'});
  };

  const addToCartMessage =
    fetcher.state === 'idle' && fetcher.data?.cart ? 'Added to cart' : null;

  return (
    <div className="space-y-16 pb-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[1.2fr,0.8fr]">
        <ProductMediaGallery images={product.images.nodes} />
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="pill w-fit bg-carbon-900/60 text-electric-400">{product.vendor ?? 'Thrivv Studio'}</p>
            <h1 className="font-display text-4xl text-slate-100">{product.title}</h1>
            <p className="text-sm text-slate-400">Hand constructed in limited quantities. Each piece ships with authenticity token and lifetime repairs.</p>
            <p className="text-lg text-electric-400">
              {formatPrice(Number(price.amount), price.currencyCode)}
            </p>
          </div>

          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.name} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{option.name}</p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isActive = selectedOptions.get(option.name) === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleOptionChange(option.name, value)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                          isActive
                            ? 'border-electric-500 bg-electric-500 text-carbon-950'
                            : 'border-slate-700/70 bg-slate-900/60 text-slate-200 hover:border-electric-500 hover:text-electric-400'
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label className="flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">
              Qty
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                }}
                className="w-16 border-none bg-transparent text-sm text-slate-100 focus:ring-0"
              />
            </label>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || fetcher.state !== 'idle'}
              className="btn-primary w-full sm:w-auto"
            >
              {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
            </button>
            {addToCartMessage ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-electric-400">{addToCartMessage}</p>
            ) : null}
          </div>

          <div className="rounded-4xl border border-slate-800/60 bg-slate-900/70 p-6 text-sm text-slate-300">
            <h2 className="font-display text-lg text-slate-100">Community proof</h2>
            <ul className="mt-3 space-y-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              <li>+4.9 / 5 rating from Thrivv Discord council</li>
              <li>75 members wore this during Neon Nights festival</li>
              <li>Backed by lifetime repair program</li>
            </ul>
          </div>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </div>
        </div>
      </div>

      <SectionHeading
        eyebrow="Drop essentials"
        title="Why the collective loves it"
        description="Multi-layered textiles, biometric authentication, and reflective mapping for nocturnal exploration."
      />
      <div className="section-shell grid gap-6 md:grid-cols-3">
        {[
          {
            title: 'Adaptive thermal regulation',
            description: 'Temperature responsive mesh lines the interior for climate shifting between commute and club.',
          },
          {
            title: 'Embedded identity chip',
            description: 'Tap the NFC panel to verify authenticity and unlock community-only experiences.',
          },
          {
            title: 'Aerodynamic drape',
            description: 'Sculpted panels and magnetic closures create movement while keeping a tailored profile.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
            <h3 className="font-display text-xl text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      vendor
      tags
      images(first: 6) {
        nodes {
          id
          url
          altText
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      options {
        name
        values
      }
      variants(first: 30) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
      seo {
        title
        description
      }
    }
  }
`;
