import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart.discountCodes.filter((code) => code.applicable).length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({
  layout,
  cart,
}: {
  layout: CartMainProps['layout'];
  cart: CartApiQueryFragment | null;
}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <ul className="space-y-6">
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </ul>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li key={id} className="cart-line animate-slide-up">
      {image && (
        <div className="rounded-2xl overflow-hidden shadow-premium">
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={120}
            loading="lazy"
            width={120}
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              window.location.href = lineItemUrl;
            }
          }}
          className="hover:text-primary-600 transition-colors group"
        >
          <p className="font-heading font-bold text-lg text-neutral-900 group-hover:gradient-text">
            {product.title}
          </p>
        </Link>
        <CartLinePrice line={line} as="span" />
        <ul className="text-sm text-neutral-600 mt-2 space-y-1">
          {selectedOptions.map((option) => (
            <li key={option.name} className="flex gap-2">
              <span className="font-medium">{option.name}:</span>
              <span>{option.value}</span>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-8">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="luxury-button w-full text-center text-lg animate-glow"
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4 className="font-heading text-xl font-bold mb-6 gradient-text">Order Summary</h4>
      <dl className="cart-subtotal">
        <dt className="text-neutral-600 font-medium">Subtotal</dt>
        <dd className="font-bold text-xl">
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        type="submit"
        className="text-red-500 hover:text-red-600 text-sm font-semibold transition-colors uppercase tracking-wide"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantiy">
      <div className="flex items-center gap-4 mt-4">
        <span className="text-sm font-medium text-neutral-600 uppercase tracking-wide">
          Qty: {quantity}
        </span>
        <div className="flex items-center gap-3">
          <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
            <button
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              name="decrease-quantity"
              value={prevQuantity}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
            >
              <span>−</span>
            </button>
          </CartLineUpdateButton>
          
          <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
            <button
              aria-label="Increase quantity"
              name="increase-quantity"
              value={nextQuantity}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white flex items-center justify-center transition-all font-bold"
            >
              <span>+</span>
            </button>
          </CartLineUpdateButton>
        </div>
        <CartLineRemoveButton lineIds={[lineId]} />
      </div>
    </div>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div className="text-xl font-bold gradient-text mt-2">
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden} className="text-center py-12">
      <div className="text-neutral-500 mb-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-4xl">
          🛍️
        </div>
        <p className="text-xl font-heading font-semibold mb-2">Your cart is empty</p>
        <p className="text-neutral-400">Time to add some culture to your collection</p>
      </div>
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
        className="luxury-button inline-block"
      >
        Start Shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mt-6">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-6">
        <div>
          <dt className="text-sm font-medium text-neutral-600 uppercase tracking-wide">Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code className="bg-gradient-to-r from-luxury-100 to-luxury-200 text-luxury-800 px-3 py-2 rounded-lg text-sm font-mono">
                {codes?.join(', ')}
              </code>
              <button className="text-red-500 hover:text-red-600 text-sm font-semibold ml-3 uppercase tracking-wide">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="space-y-3">
          <input 
            type="text" 
            name="discountCode" 
            placeholder="Discount code" 
            className="premium-input"
          />
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-900 px-4 py-3 rounded-2xl font-semibold transition-all uppercase tracking-wide"
          >
            Apply Code
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

