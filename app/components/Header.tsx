import {Link, NavLink} from '@remix-run/react';

interface HeaderProps {
  brandName: string;
  tagline: string;
  cartQuantity: number;
}

const NAV_ITEMS = [
  {name: 'Home', to: '/'},
  {name: 'Lookbook', to: '/collections'},
  {name: 'About', to: '/about'},
];

export function Header({brandName, tagline, cartQuantity}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-carbon-950/70 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-4 text-left">
          <span className="pill text-[0.65rem] text-electric-400">Thrivv Labs</span>
          <div>
            <p className="font-display text-xl font-semibold tracking-wide text-slate-100">
              {brandName || 'Thrivv'}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {tagline}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              className={({isActive}) =>
                `text-sm font-medium uppercase tracking-[0.25em] transition-colors ${
                  isActive ? 'text-electric-400' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/collections" className="btn-secondary hidden sm:inline-flex">
            Shop the drop
          </Link>
          <Link
            to="/cart"
            prefetch="intent"
            className="relative inline-flex items-center gap-3 rounded-full border border-slate-700/70 bg-slate-900/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-electric-500 hover:text-electric-400"
          >
            Cart
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-electric-500 text-[0.7rem] font-semibold text-carbon-950">
              {cartQuantity}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
