// pwa-assets.config.js
import {
    defineConfig,
    minimal2023Preset as preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
    headLinkOptions: {
        preset: '2023',
    },
    preset,
    // Ganti 'public/favicon.ico' dengan file PNG resolusi tinggi
    // 'public/pwa-512x512.png' adalah pilihan yang bagus
    images: ['public/pwa-512x512.png'],
})