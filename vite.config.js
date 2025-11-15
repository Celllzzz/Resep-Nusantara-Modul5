// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// URL API Anda dari file .env
const API_BASE_URL = 'https://modlima.fuadfakhruz.id';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({ // <-- Objek konfigurasi PWA masuk ke dalam ()
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'LOGORN.png'],
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'Resep Nusantara',
        short_name: 'Resep Nusantara',
        description: 'Aplikasi Resep Makanan dan Minuman Khas Indonesia',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,

        // <-- MODIFIKASI: Tambahkan runtimeCaching di sini
        runtimeCaching: [
          {
            // Cache gambar dari URL eksternal (mis: Unsplash, MinIO)
            // Sesuaikan urlPattern jika Anda punya domain gambar spesifik
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst', // Ambil dari cache dulu, baru network
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100, // Simpan 100 gambar
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache respons yang sukses
              },
            },
          },
          {
            // Cache request API (GET)
            urlPattern: ({ url }) => url.href.startsWith(API_BASE_URL),
            method: 'GET', // Hanya cache request GET
            handler: 'NetworkFirst', // Ambil dari network dulu, fallback ke cache
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10, // Timeout network 10 detik
              expiration: {
                maxEntries: 50, // Simpan 50 request
                maxAgeSeconds: 24 * 60 * 60, // 1 hari
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache respons yang sukses
              },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })
  ],
})