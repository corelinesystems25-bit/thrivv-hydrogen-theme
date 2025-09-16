interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function SectionHeading({eyebrow, title, description, actions}: SectionHeadingProps) {
  return (
    <div className="section-shell mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-electric-400/70">{eyebrow}</p>
        ) : null}
        <h2 className="font-display text-3xl font-semibold text-slate-100 sm:text-4xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
