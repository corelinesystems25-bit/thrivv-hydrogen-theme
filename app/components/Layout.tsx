import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      handle: string;
      title: string;
    };
    image?: {
      url: string;
      altText?: string | null;
    } | null;
  };
};

export type CartWithLines = {
  id: string;
  checkoutUrl?: string | null;
  totalQuantity: number;
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    nodes: CartLine[];
  };
};

export type ShopBasics = {
  shop: {
    name: string;
    description?: string | null;
    primaryDomain?: {
      url: string;
    } | null;
  };
};

interface LayoutProps {
  cart: Promise<CartWithLines | null>;
  shop: Promise<ShopBasics>;
  children: React.ReactNode;
}

export function Layout({cart, shop, children}: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-carbon-950">
      <VisualChrome />
      <Suspense fallback={<HeaderFallback />}>
        <Await resolve={Promise.all([shop, cart])}>
          {([shopData, cartData]) => (
            <Header
              brandName={shopData.shop.name}
              tagline={shopData.shop.description ?? 'Luxury streetwear engineered for tomorrow.'}
              cartQuantity={cartData?.totalQuantity ?? 0}
            />
          )}
        </Await>
      </Suspense>

      <main className="relative z-10">{children}</main>

      <Suspense fallback={<FooterFallback />}>
        <Await resolve={shop}>
          {(shopData) => <Footer brandName={shopData.shop.name} domain={shopData.shop.primaryDomain?.url} />}
        </Await>
      </Suspense>
    </div>
  );
}

function VisualChrome() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-x-0 top-[-30%] h-[480px] bg-hero-grid blur-3xl" />
      <div className="absolute left-[10%] top-[45%] h-56 w-56 rounded-full bg-electric-500/20 blur-[150px]" />
      <div className="absolute right-[5%] top-[65%] h-64 w-64 rounded-full bg-amber-400/20 blur-[160px]" />
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-electric-300/10 blur-[180px]" />
    </div>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-carbon-950/60 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between">
        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-800" />
        <div className="flex gap-4">
          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-800" />
          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-800" />
        </div>
      </div>
    </header>
  );
}

function FooterFallback() {
  return (
    <footer className="border-t border-slate-800/60 bg-carbon-900/80">
      <div className="section-shell py-12">
        <div className="h-4 w-32 animate-pulse rounded-full bg-slate-800" />
      </div>
    </footer>
  );
}
