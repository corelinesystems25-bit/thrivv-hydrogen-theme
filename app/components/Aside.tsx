/**
 * A luxury side bar component with Overlay and premium animations.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay animate-fade-in" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside className="animate-slide-down luxury-card border-l-4 border-primary-500">
        <header className="bg-gradient-to-r from-primary-500 via-accent-500 to-luxury-500 text-white p-6">
          <h3 className="font-heading text-2xl font-bold tracking-wide">{heading}</h3>
          <CloseAside />
        </header>
        <main className="bg-white/95 backdrop-blur-sm p-6">{children}</main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a 
      className="close text-white hover:text-neutral-200 absolute top-6 right-6 text-3xl font-bold" 
      href="#" 
      onChange={() => history.go(-1)}
    >
      &times;
    </a>
  );
}

