import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import type { ManifestOptions } from 'vite-plugin-pwa'

import { createPwaManifest } from './src/lib/mobile-app'

const pwaManifest = createPwaManifest() as unknown as Partial<ManifestOptions>

export default defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  plugins: [
    mode === 'test' ? null : devtools(),
    mode === 'test' ? null : cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    mode === 'test'
      ? null
      : VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          devOptions: {
            enabled: true,
          },
          includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png'],
          manifest: pwaManifest,
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico,webp}'],
            navigateFallback: '/',
          },
        }),
    tanstackStart(),
    viteReact(),
  ].filter(Boolean),
}))
