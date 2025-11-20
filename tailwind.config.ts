import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{vue,js,ts}',
    './src/app/routes/**/*.{vue,js,ts}',
    './src/pages/**/*.{vue,js,ts}',
    './src/widgets/**/*.{vue,js,ts}',
    './src/features/**/*.{vue,js,ts}',
    './src/entities/**/*.{vue,js,ts}',
    './src/shared/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#020617',
          elevated: '#0b1220',
        },
        brand: {
          primary: '#21A038',
          soft: '#9FE870',
          accent: '#38bdf8',
        },
        text: {
          main: '#F9FAFB',
          muted: '#9CA3AF',
          inverse: '#020617',
        },
        danger: '#ef4444',
        warning: '#f97316',
        success: '#22c55e',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: []
}

export default config
