import {Link} from '@remix-run/react';

interface HeroProps {
  headline: string;
  subheadline: string;
  description: string;
  primaryCta: {label: string; to: string};
  secondaryCta: {label: string; to: string};
  dropTagline?: string;
  stats?: Array<{label: string; value: string; description?: string}>;
  children?: React.ReactNode;
}

export function Hero({
  headline,
  subheadline,
  description,
  primaryCta,
  secondaryCta,
  dropTagline,
  stats,
  children,
}: HeroProps) {
  return (
    <section className="relative z-10 overflow-hidden pt-16 sm:pt-24">
      <div className="section-shell grid items-center gap-14 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-8">
          {dropTagline ? <p className="pill text-electric-400">{dropTagline}</p> : null}
          <div className="space-y-4">
            <p className="font-display text-sm uppercase tracking-[0.4em] text-electric-400/80">{subheadline}</p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-slate-100 sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="max-w-2xl text-base text-slate-400 sm:text-lg">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to={primaryCta.to} className="btn-primary">
              {primaryCta.label}
            </Link>
            <Link to={secondaryCta.to} className="btn-secondary">
              {secondaryCta.label}
            </Link>
          </div>
          {stats && stats.length > 0 ? (
            <dl className="grid gap-6 text-sm text-slate-300 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="card-panel bg-slate-900/70 p-6">
                  <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</dt>
                  <dd className="font-display text-2xl text-electric-400">{stat.value}</dd>
                  {stat.description ? <p className="mt-2 text-xs text-slate-400">{stat.description}</p> : null}
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="relative">
          <div className="gradient-border">
            <div className="relative rounded-4xl border border-slate-800/60 bg-slate-900/60 p-10 shadow-halo">
              <div className="absolute inset-0 overflow-hidden rounded-4xl">
                <div className="absolute right-[-20%] top-[-10%] h-48 w-48 rounded-full bg-electric-500/20 blur-[120px]" />
                <div className="absolute left-[-10%] bottom-[-15%] h-52 w-52 rounded-full bg-amber-400/20 blur-[120px]" />
              </div>
              <div className="relative space-y-6">
                <p className="font-display text-lg uppercase tracking-[0.4em] text-slate-300">
                  Capsule 07 · Carbon Sync
                </p>
                <p className="text-sm text-slate-400">
                  Adaptive outerwear fused with biometric tech. Responsive fabrics, stealth silhouettes, and luminous trims engineered for night movement.
                </p>
                {children}
                <div className="grid gap-4 text-xs text-slate-500">
                  <p>• Reactive thermo mesh lining</p>
                  <p>• Quantum-stitched reinforcement</p>
                  <p>• Near Field Access token embedded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
