import { Link, useLocation } from '@tanstack/react-router'
import { BookOpenText, Download, Home, WifiOff } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { buildBottomNavItems } from '#/lib/mobile-app'

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  }
}

export function MobileAppShell({
  title,
  subtitle,
  children,
  topAction,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  topAction?: React.ReactNode
}) {
  const location = useLocation()
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches)
    setIsOffline(!window.navigator.onLine)

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    function handleInstalled() {
      setInstallPrompt(null)
      setIsInstalled(true)
    }

    function handleOffline() {
      setIsOffline(true)
    }

    function handleOnline() {
      setIsOffline(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      )
      window.removeEventListener('appinstalled', handleInstalled)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const navItems = useMemo(
    () => buildBottomNavItems(location.pathname),
    [location.pathname],
  )

  async function handleInstall() {
    if (!installPrompt) return

    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <div className="mobile-shell-wrap mx-auto min-h-screen w-full max-w-[430px] px-3 pb-28 pt-3 sm:px-4">
      <div className="mobile-shell overflow-hidden rounded-[2rem] border border-[var(--pantang-line)] bg-[var(--pantang-cream)] shadow-[0_30px_80px_oklch(0.205_0.018_55_/_18%)]">
        <header className="sticky top-0 z-20 border-b border-[var(--pantang-line)] bg-[color:oklch(0.985_0.012_80_/_90%)] px-4 pb-4 pt-4 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--pantang-muted)]">
                Pantang Food
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--pantang-ink)]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm leading-6 text-[var(--pantang-soft)]">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {topAction ? <div className="shrink-0">{topAction}</div> : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {isOffline ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 text-xs text-orange-100">
                <WifiOff className="h-3.5 w-3.5" /> Offline mode
              </div>
            ) : null}
            {isInstalled ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                Installed app ready
              </div>
            ) : null}
            {!isInstalled && installPrompt ? (
              <button
                id="install"
                type="button"
                onClick={handleInstall}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1 text-xs text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-deep)]"
              >
                <Download className="h-3.5 w-3.5" /> Install app
              </button>
            ) : null}
          </div>
        </header>

        <div className="px-4 py-4">{children}</div>
      </div>

      <nav className="mobile-bottom-nav fixed bottom-3 left-1/2 z-30 flex w-[calc(100%-1.5rem)] max-w-[404px] -translate-x-1/2 items-center justify-between rounded-[1.6rem] border border-[var(--pantang-line)] bg-[color:oklch(0.985_0.012_80_/_92%)] px-3 py-2 shadow-[0_18px_60px_oklch(0.205_0.018_55_/_18%)] backdrop-blur-md sm:w-[calc(100%-2rem)]">
        {navItems.map((item) => {
          if (item.label === 'Install') {
            return (
              <button
                key={item.label}
                type="button"
                onClick={handleInstall}
                disabled={!installPrompt}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition ${
                  installPrompt
                    ? 'text-[var(--pantang-soft)] hover:bg-[var(--pantang-warm)]'
                    : 'cursor-not-allowed text-[var(--pantang-muted)]'
                }`}
              >
                <Download className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            )
          }

          const Icon = item.label === 'Browse' ? Home : BookOpenText

          return (
            <Link
              key={item.label}
              to={item.href as '/' | '/recipes/$recipeId'}
              params={
                item.href.startsWith('/recipes/')
                  ? {
                      recipeId: item.href.split('/').at(-1) ?? 'sup-ayam-halia',
                    }
                  : undefined
              }
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] transition ${
                item.active
                  ? 'bg-[var(--pantang-terra)] text-[var(--pantang-cream)]'
                  : 'text-[var(--pantang-soft)] hover:bg-[var(--pantang-warm)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
