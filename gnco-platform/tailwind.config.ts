import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#080C14',
        'bg-surface': '#0D1520',
        'bg-elevated': '#131D2E',
        'bg-border': '#1E2D42',
        'accent-gold': '#C9A84C',
        'accent-gold-light': '#E8C97A',
        'accent-blue': '#3B82F6',
        'accent-green': '#10B981',
        'accent-red': '#EF4444',
        'accent-amber': '#F59E0B',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8FA3BF',
        'text-tertiary': '#4A6080',
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,168,76,0.3)',
        'gold-lg': '0 0 24px rgba(201,168,76,0.15)',
        surface: '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'count-up': 'countUp 1.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
