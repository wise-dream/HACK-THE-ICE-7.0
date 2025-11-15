// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import { resolve } from 'pathe'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  srcDir: 'src',

  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],

  dir: {
    pages: 'app/routes',
    layouts: 'app/layouts'
  },

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: [
      'favicon.ico',
      'icons/icon-192x192.png',
      'icons/icon-512x512.png'
    ],  
    manifest: {
      name: 'Опора',
      short_name: 'Опора',
      description: 'Сервис для поиска и управления льготами и скидками для льготников',
      theme_color: '#00A86B',
      background_color: '#F5F7FA',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
    },
    client: {
      installPrompt: true
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  ui: {
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.example.com'
    }
  }
})
