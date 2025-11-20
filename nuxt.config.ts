import { defineNuxtConfig } from 'nuxt/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  srcDir: 'src',

  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/icon',
    '@vite-pwa/nuxt'
  ],

  icon: {
    serverBundle: {
      collections: ['mdi']
    },
    clientBundle: {
      scan: true,
      sizeLimitKb: 128
    },
    fallbackToApi: false
  },

  css: [
    '~/app/styles/main.css'
  ],

  dir: {
    pages: 'app/routes',
    layouts: 'app/layouts'
  },

  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'icons/icon-192x192.png',
          'icons/icon-512x512.png'
        ],
        manifest: {
          name: 'Опора',
          short_name: 'Опора',
          description: 'Сервис для поиска и управления льготами',
          theme_color: '#21A038',
          background_color: '#020617',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
        },
        devOptions: {
          enabled: false
        }
      })
    ]
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.example.com'
    }
  }
})
