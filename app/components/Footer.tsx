interface FooterProps {
  brandName: string;
  domain?: string;
}

const SOCIAL_LINKS = [
  {label: 'Instagram', href: 'https://instagram.com'},
  {label: 'TikTok', href: 'https://tiktok.com'},
  {label: 'Discord', href: 'https://discord.com'},
];

export function Footer({brandName, domain}: FooterProps) {
  return (
    <footer className="relative z-10 border-t border-slate-800/70 bg-carbon-900/80">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-[1.3fr,1fr]">
        <div className="space-y-6">
          <p className="pill text-electric-400">Thrivv Collective</p>
          <h3 className="max-w-xl font-display text-3xl font-semibold leading-tight text-slate-100 md:text-4xl">
            {brandName} is where luxury silhouettes collide with future-facing technology.
          </h3>
          <p className="max-w-lg text-sm text-slate-400">
            Crafted in limited drops. Engineered with precision fabrics and adaptive fits. Join the community shaping the next era of streetwear.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-6 text-sm text-slate-400 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Contact</p>
            <p>support@thrivv.studio</p>
            <p>Community Hotline: +1 (800) 555-THRV</p>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Headquarters</p>
            <p>44 Quantum Avenue<br />Toronto, ON</p>
            {domain ? <p className="text-xs text-slate-500">{domain}</p> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800/70 bg-carbon-900/80">
        <div className="section-shell flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brandName}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-electric-400">
              Privacy
            </a>
            <a href="/terms" className="hover:text-electric-400">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
