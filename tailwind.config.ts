import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        forest: '#0F1B14',
        bark: '#1F2A22',
        moss: '#5C7A5E',
        linen: '#F5F1E8',
        paper: '#FAF7F0',
        bronze: '#B87333',
        copper: '#C19A6B',
        ink: '#0A0F0C',
        mist: '#D8D4C8',
        border: '#D8D4C8',
        input: '#D8D4C8',
        ring: '#0F1B14',
        background: '#FAF7F0',
        foreground: '#0A0F0C',
        muted: { DEFAULT: '#F5F1E8', foreground: '#5C7A5E' },
        accent: { DEFAULT: '#B87333', foreground: '#F5F1E8' },
        destructive: { DEFAULT: '#b3261e', foreground: '#fff' },
        popover: { DEFAULT: '#FAF7F0', foreground: '#0A0F0C' },
        card: { DEFAULT: '#FAF7F0', foreground: '#0A0F0C' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'kenburns': {
          '0%, 100%': { transform: 'scale(1) translate(0,0)' },
          '50%': { transform: 'scale(1.06) translate(-0.5%, -0.5%)' },
        },
        'line-grow': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'kenburns': 'kenburns 24s ease-in-out infinite',
        'line-grow': 'line-grow 1s ease-out forwards',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'marquee': 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
