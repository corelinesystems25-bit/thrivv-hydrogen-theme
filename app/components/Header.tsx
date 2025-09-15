import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  HeaderQuery,
  MenuFragment,
} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';

type HeaderProps = {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: boolean;
  publicStoreDomain: string;
};

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, publicStoreDomain}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="glass-effect sticky top-0 z-40 py-6 px-6 md:px-8">
      <div className="container-luxury flex justify-between items-center">
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          <h1 className="font-heading text-3xl md:text-4xl font-bold gradient-text uppercase tracking-wider">
            Thrivv
          </h1>
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      <div className="flex gap-8 font-medium uppercase tracking-wide">
        <NavLink
          className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold relative group"
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
        <NavLink
          className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold relative group"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/collections"
        >
          Shop
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
        <NavLink
          className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold relative group"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/blogs"
        >
          Blog
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
        <NavLink
          className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold relative group"
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/policies"
        >
          About
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold relative group"
              end={item.url.includes('myshopify.com')}
              key={item.id}
              onClick={closeAside}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300"></span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-6" role="navigation">
      <NavLink 
        prefetch="intent" 
        to="/account" 
        style={activeLinkStyle}
        className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold"
      >
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function SearchToggle() {
  return (
    <a 
      href="#search-aside" 
      className="text-neutral-700 hover:text-primary-600 transition-all duration-300 font-semibold"
    >
      Search
    </a>
  );
}

function CartToggle({cart}: {cart: HeaderProps['cart']}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBadge({count}: {count: number}) {
  return (
    <a
      href="#cart-aside"
      className="luxury-button relative inline-flex items-center animate-glow"
    >
      Cart
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-luxury-500 text-neutral-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          {count}
        </span>
      )}
    </a>
  );
}

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isActive ? '#ec4899' : isPending ? '#a3a3a3' : undefined,
  };
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
} satisfies MenuFragment;

