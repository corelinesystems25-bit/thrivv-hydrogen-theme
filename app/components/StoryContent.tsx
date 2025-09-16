interface StorySection {
  title: string;
  description: string;
  points: string[];
}

interface StoryContentProps {
  vision: StorySection;
  community: StorySection;
  initiatives: Array<{
    title: string;
    excerpt: string;
  }>;
}

export function StoryContent({vision, community, initiatives}: StoryContentProps) {
  return (
    <div className="section-shell space-y-16 pb-24">
      <article className="grid gap-12 rounded-4xl border border-slate-800/60 bg-slate-900/70 p-10 shadow-lg lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-5">
          <p className="pill bg-carbon-900/60 text-electric-400">Our Manifesto</p>
          <h2 className="font-display text-3xl text-slate-100 lg:text-4xl">{vision.title}</h2>
          <p className="text-sm text-slate-400">{vision.description}</p>
        </div>
        <ul className="space-y-4 text-sm text-slate-300">
          {vision.points.map((point) => (
            <li key={point} className="rounded-3xl border border-slate-800/70 bg-slate-900/60 p-4">
              {point}
            </li>
          ))}
        </ul>
      </article>

      <article className="grid gap-12 rounded-4xl border border-slate-800/60 bg-slate-900/60 p-10 shadow-lg lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-5">
          <p className="pill bg-carbon-900/60 text-amber-300">Community</p>
          <h2 className="font-display text-3xl text-slate-100 lg:text-4xl">{community.title}</h2>
          <p className="text-sm text-slate-400">{community.description}</p>
        </div>
        <ul className="grid gap-4 text-sm text-slate-300">
          {community.points.map((point) => (
            <li key={point} className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-4">
              {point}
            </li>
          ))}
        </ul>
      </article>

      <div className="space-y-6">
        <p className="pill bg-carbon-900/60 text-electric-400">Initiatives</p>
        <div className="grid gap-6 md:grid-cols-3">
          {initiatives.map((item) => (
            <div key={item.title} className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
              <h3 className="font-display text-xl text-slate-100">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-400">{item.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
