import {Link, useLoaderData} from '@remix-run/react';
import type {ActionFunctionArgs, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';
import {CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_QUERY} from '~/graphql/cart';
import type {CartWithLines} from '~/components/Layout';
import {formatPrice} from '~/utils';

export async function loader({context}: LoaderFunctionArgs) {
  const {session, storefront} = context;
  const cartId = await session.get('cartId');

  if (!cartId) {
    return json({cart: null});
  }

  const cart = await storefront
    .query<{cart: CartWithLines | null}>(CART_QUERY, {
      variables: {cartId},
    })
    .then((result) => result.cart);

  return json({cart});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, session} = context;
  const formData = await request.formData();
  const merchandiseId = formData.get('merchandiseId');
  const quantity = Number(formData.get('quantity') ?? 1);
  const cartIdForm = formData.get('cartId');

  if (!merchandiseId || typeof merchandiseId !== 'string') {
    return json({error: 'Missing merchandiseId'}, {status: 400});
  }

  const lines = [
    {
      merchandiseId,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    },
  ];

  let cartId = typeof cartIdForm === 'string' && cartIdForm.length > 0 ? cartIdForm : await session.get('cartId');

  let cartResult: CartWithLines | null = null;

  if (!cartId) {
    const response = await storefront.mutate<{cartCreate: {cart: CartWithLines | null; userErrors: Array<{message: string}>}}>(
      CART_CREATE_MUTATION,
      {
        variables: {
          input: {
            lines,
          },
        },
      },
    );

    const {cartCreate} = response;
    if (cartCreate?.cart) {
      cartResult = cartCreate.cart;
      session.set('cartId', cartCreate.cart.id);
      cartId = cartCreate.cart.id;
    } else {
      const message = cartCreate?.userErrors?.[0]?.message ?? 'Unable to create cart';
      return json({error: message}, {status: 400});
    }
  } else {
    const response = await storefront.mutate<{
      cartLinesAdd: {cart: CartWithLines | null; userErrors: Array<{message: string}>};
    }>(CART_LINES_ADD_MUTATION, {
      variables: {cartId, lines},
    });

    const {cartLinesAdd} = response;
    if (cartLinesAdd?.cart) {
      cartResult = cartLinesAdd.cart;
      session.set('cartId', cartLinesAdd.cart.id);
    } else {
      const message = cartLinesAdd?.userErrors?.[0]?.message ?? 'Unable to add item to cart';
      return json({error: message}, {status: 400});
    }
  }

  return json(
    {cart: cartResult},
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    },
  );
}

export default function CartRoute() {
  const {cart} = useLoaderData<typeof loader>();

  if (!cart) {
    return (
      <div className="section-shell space-y-6 pb-24 pt-16">
        <h1 className="font-display text-3xl text-slate-100">Your bag is empty</h1>
        <p className="text-sm text-slate-400">Explore the latest capsule to secure your look.</p>
        <Link to="/collections" className="btn-primary">
          Shop lookbook
        </Link>
      </div>
    );
  }

  return (
    <div className="section-shell space-y-10 pb-24 pt-16">
      <header className="space-y-3">
        <p className="pill w-fit bg-carbon-900/60 text-electric-400">Thrivv Cart</p>
        <h1 className="font-display text-4xl text-slate-100">Secured pieces</h1>
        <p className="text-sm text-slate-400">Checkout when you are ready. Items stay reserved for 15 minutes.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr,0.6fr]">
        <ul className="space-y-4">
          {cart.lines.nodes.map((line) => (
            <li key={line.id} className="flex gap-4 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-4">
              {line.merchandise.image ? (
                <img
                  src={line.merchandise.image.url}
                  alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                  className="h-32 w-32 rounded-3xl object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl text-slate-100">{line.merchandise.product.title}</h3>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{line.merchandise.title}</p>
                </div>
                <p className="text-sm text-electric-400">
                  {formatPrice(Number(line.cost.totalAmount.amount), line.cost.totalAmount.currencyCode)}
                </p>
                <p className="text-xs text-slate-500">Quantity: {line.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="space-y-4 rounded-4xl border border-slate-800/60 bg-slate-900/70 p-6">
          <h2 className="font-display text-xl text-slate-100">Order summary</h2>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Subtotal</span>
            <span>
              {formatPrice(
                Number(cart.cost.subtotalAmount.amount),
                cart.cost.subtotalAmount.currencyCode,
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Taxes and shipping calculated at checkout. Thrivv members earn reward points on every drop.
          </p>
          {cart.checkoutUrl ? (
            <a href={cart.checkoutUrl} className="btn-primary w-full text-center">
              Checkout
            </a>
          ) : null}
          <Link to="/collections" className="btn-secondary w-full text-center">
            Continue browsing
          </Link>
        </aside>
      </div>
    </div>
  );
}
