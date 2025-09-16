/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        carbon: {
          950: '#040507',
          900: '#06080f',
          800: '#0b1021',
          700: '#141a2c',
          600: '#1f273d',
        },
        electric: {
          300: '#75f7dd',
          400: '#3fe9d0',
          500: '#22d1c4',
        },
        amber: {
          300: '#f7b955',
          400: '#f9a826',
        },
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        neon: '0 20px 45px -15px rgba(34, 209, 196, 0.45)',
        halo: '0 0 60px rgba(117, 247, 221, 0.15)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(34, 209, 196, 0.15), transparent 55%), radial-gradient(circle at 80% 0%, rgba(249, 168, 38, 0.15), transparent 40%), radial-gradient(circle at 50% 100%, rgba(63, 233, 208, 0.1), transparent 45%)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      animation: {
        pulseSlow: 'pulseSlow 12s linear infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': {opacity: 0.25},
          '50%': {opacity: 0.6},
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
