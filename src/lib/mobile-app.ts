export function createPwaManifest() {
  return {
    name: 'Pantang Food',
    short_name: 'PantangFood',
    description: 'A mobile-friendly pantang recipe companion for Malay moms.',
    theme_color: '#120f0c',
    background_color: '#120f0c',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/',
    scope: '/',
    icons: [
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  } as const
}

export function buildBottomNavItems(currentPath: string) {
  return [
    { label: 'Browse', href: '/', active: currentPath === '/' },
    { label: 'Recipe', href: currentPath.startsWith('/recipes/') ? currentPath : '/recipes/sup-ayam-halia', active: currentPath.startsWith('/recipes/') },
    { label: 'Install', href: '#install', active: false },
  ]
}
