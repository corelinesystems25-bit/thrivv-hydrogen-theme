type MediaImage = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

interface ProductMediaGalleryProps {
  images: MediaImage[];
}

export function ProductMediaGallery({images}: ProductMediaGalleryProps) {
  if (!images.length) return null;

  const [primary, ...rest] = images;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="overflow-hidden rounded-4xl border border-slate-800/60 bg-slate-900/60">
        <img
          src={primary.url}
          alt={primary.altText ?? 'Product photograph'}
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="grid gap-6">
        {rest.slice(0, 4).map((image) => (
          <div key={image.id} className="overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/60">
            <img
              src={image.url}
              alt={image.altText ?? 'Product photograph detail'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
