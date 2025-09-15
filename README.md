# Thrivv - Premium Street Culture Shopify Hydrogen Theme

A luxury streetwear-inspired Shopify Hydrogen theme designed for brands that live at the intersection of culture and commerce.

## Features

- **Luxury Street Aesthetic**: Bold gradients, premium animations, and culture-forward design
- **Premium Animations**: Floating elements, gradient animations, and smooth transitions
- **Mobile-First**: Responsive design optimized for all devices
- **Performance**: Built with Shopify Hydrogen for blazing-fast performance
- **Customizable**: Extensive customization options for colors, fonts, and layouts
- **Culture-Focused**: Designed specifically for streetwear, lifestyle, and culture brands
- **SEO Optimized**: Built-in SEO best practices and performance optimization

## Design Philosophy

Thrivv represents the fusion of street culture and luxury commerce. Every element is designed to:
- Celebrate authenticity and culture
- Provide a premium shopping experience
- Build community and movement
- Showcase products as cultural statements

## Tech Stack

- **Shopify Hydrogen**: React-based framework for headless commerce
- **Remix**: Full-stack web framework
- **Tailwind CSS**: Utility-first CSS framework with custom luxury extensions
- **TypeScript**: Type-safe development
- **Framer Motion**: Advanced animations and interactions
- **Lucide React**: Premium icon library

## Color Palette

- **Primary**: Pink gradient (#ec4899 to #db2777)
- **Accent**: Orange gradient (#f97316 to #ea580c)
- **Luxury**: Gold gradient (#eab308 to #ca8a04)
- **Neutral**: Sophisticated grays for balance

## Typography

- **Headings**: Montserrat (Bold, modern sans-serif)
- **Body**: Inter (Clean, readable sans-serif)
- **Script**: Dancing Script (Elegant script for accents)
- **Mono**: JetBrains Mono (Technical elements)

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your Shopify store
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

```
NODE_ENV="development"
SESSION_SECRET="your-session-secret"
PUBLIC_STOREFRONT_API_TOKEN="your-storefront-api-token"
PRIVATE_STOREFRONT_API_TOKEN="your-private-storefront-api-token"
PUBLIC_STORE_DOMAIN="your-shop-name.myshopify.com"
PUBLIC_STOREFRONT_ID="your-storefront-id"
```

## Deployment

### Shopify Oxygen (Recommended)

1. Connect your GitHub repository to Shopify Oxygen
2. Configure environment variables in Oxygen dashboard
3. Deploy automatically on push to main branch

### Alternative Platforms

- Vercel
- Netlify
- Railway
- Render

## Customization

### Brand Colors

Update the luxury color palette in `tailwind.config.js`:

```js
colors: {
  primary: {
    // Your brand's primary colors
  },
  accent: {
    // Your brand's accent colors
  },
  luxury: {
    // Your brand's luxury accent
  }
}
```

### Animations

Customize animations in `tailwind.config.js`:

```js
animation: {
  'custom-float': 'customFloat 6s ease-in-out infinite',
  // Add your custom animations
}
```

### Typography

Update fonts in `app/styles/app.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont');
```

## Components

### Luxury Components
- `luxury-card`: Premium card with glass morphism
- `luxury-button`: Gradient button with glow effects
- `gradient-text`: Multi-color gradient text
- `glass-effect`: Backdrop blur and transparency

### Layout Components
- `Header`: Sticky navigation with glass effect
- `Footer`: Rich footer with social links and newsletter
- `Layout`: Main layout with floating background elements
- `Aside`: Premium sidebar for cart and mobile menu

## Performance

- Optimized images with Shopify's CDN
- Lazy loading for below-the-fold content
- Minimal JavaScript bundle
- CSS-only animations where possible
- Progressive enhancement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a proprietary theme. For customization requests or support, please contact the development team.

## License

This theme is proprietary software. All rights reserved.

---

**Built for the culture. Designed for success.**

