import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import { createPwaManifest } from '#/lib/mobile-app'
import appCss from '../styles.css?url'

const manifest = createPwaManifest()

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no' },
      { title: 'Pantang Food' },
      {
        name: 'description',
        content:
          'A bilingual pantang recipe app for Malaysian mothers, with an editorial warm-homepage design, dedicated recipe pages, installable PWA support, and Cloudflare D1-backed data.',
      },
      { name: 'theme-color', content: manifest.theme_color },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: manifest.short_name },
      { name: 'mobile-web-app-capable', content: 'yes' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument() {
  return (
    <html lang="ms">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-[var(--pantang-bg)] text-[var(--pantang-ink)] antialiased">
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
