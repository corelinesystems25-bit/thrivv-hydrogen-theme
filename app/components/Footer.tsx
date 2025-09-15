import type {FooterQuery, MenuFragment} from 'storefrontapi.generated';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: {primaryDomain: {url: string}}}) {
  return (
    <footer className="relative bg-neutral-900 text-white overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20"></div>
      
      <div className="relative z-10 container-luxury section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="font-heading text-4xl font-bold gradient-text mb-6">
              Thrivv
            </h3>
            <p className="text-xl text-neutral-300 mb-6 leading-relaxed">
              Elevated Essentials. Street Certified.
            </p>
            <p className="text-neutral-400 mb-8">
              We're not just selling products. We're building a movement. 
              Every piece tells a story, every drop creates culture.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { name: 'Instagram', icon: '📷' },
                { name: 'Twitter', icon: '🐦' },
                { name: 'TikTok', icon: '🎵' },
                { name: 'YouTube', icon: '📺' },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-12 h-12 luxury-card flex items-center justify-center text-xl hover:scale-110 transition-transform"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-6 text-primary-400">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {['Shop', 'Collections', 'About', 'Blog', 'Contact'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-neutral-300 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Customer Care */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-6 text-accent-400">
              Customer Care
            </h4>
            <nav className="space-y-3">
              {['Size Guide', 'Shipping', 'Returns', 'FAQ', 'Support'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-neutral-300 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="luxury-card p-8 mb-16 text-center">
          <h4 className="font-heading text-2xl font-bold mb-4 gradient-text">
            Stay in the Loop
          </h4>
          <p className="text-neutral-300 mb-6">
            Get early access to drops, exclusive content, and culture updates
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="premium-input flex-1 text-neutral-900"
              required
            />
            <button
              type="submit"
              className="luxury-button"
            >
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Menu Links */}
        {menu && (
          <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
        )}
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Thrivv. All rights reserved. Built for the culture.
            </p>
            <div className="flex gap-6 text-sm text-neutral-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: MenuFragment;
  primaryDomainUrl: string;
}) {
  const publicStoreDomain = primaryDomainUrl.replace('https://', '').replace('http://', '');

  return (
    <nav className="mb-8" role="navigation">
      <div className="flex justify-center gap-8 flex-wrap">
        {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          const isExternal = !url.startsWith('/');
          return isExternal ? (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="text-neutral-300 hover:text-primary-400 transition-colors font-medium"
            >
              {item.title}
            </a>
          ) : (
            <a
              key={item.id}
              href={url}
              className="text-neutral-300 hover:text-primary-400 transition-colors font-medium"
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609435192',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609467960',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
} satisfies MenuFragment;

