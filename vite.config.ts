import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

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
    tanstackStart(),
    viteReact(),
  ].filter(Boolean),
}))
