import { Link } from '@tanstack/react-router'

import type { PantangLanguage } from '#/features/recipes/pantang-design'

export function PantangHeader({
  active,
  language,
  onLanguageChange,
}: {
  active: 'home' | 'recipes' | 'detail'
  language?: PantangLanguage
  onLanguageChange?: (language: PantangLanguage) => void
}) {
  const linkClass = (isActive: boolean) =>
    `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-[var(--pantang-ink)] text-[var(--pantang-cream)] shadow-[0_0_0_1px_rgba(20,20,19,0.05)]' : 'text-[var(--pantang-soft)] hover:bg-[var(--pantang-warm)] hover:text-[var(--pantang-ink)]'}`

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--pantang-line)] bg-[rgba(245,244,237,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-5 px-5 py-4 sm:px-8 lg:px-14">
        <Link to="/" className="flex items-center gap-3">
          <span className="pantang-brand-mark" aria-hidden="true" />
          <span className="leading-tight">
            <span className="block font-[var(--font-serif)] text-xl font-semibold tracking-[-0.01em] text-[var(--pantang-ink)]">Pantang</span>
            <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--pantang-muted)]">Editorial confinement kitchen</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <a href="/#home" className={linkClass(active === 'home')}>Home</a>
          <a href="/#recipes" className={linkClass(active === 'recipes' || active === 'detail')}>Recipes</a>
          <a href="/#calendar" className={linkClass(false)}>Plan</a>
          <a href="/#pantry" className={linkClass(false)}>Pantry</a>
          <a href="/#stories" className={linkClass(false)}>Stories</a>
        </nav>

        {language && onLanguageChange ? (
          <div className="flex rounded-full border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`rounded-full px-3 py-1 transition ${language === 'en' ? 'bg-[var(--pantang-ink)] text-[var(--pantang-cream)]' : 'hover:text-[var(--pantang-ink)]'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('bm')}
              className={`rounded-full px-3 py-1 transition ${language === 'bm' ? 'bg-[var(--pantang-ink)] text-[var(--pantang-cream)]' : 'hover:text-[var(--pantang-ink)]'}`}
            >
              BM
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export function PantangFooter() {
  return (
    <footer className="mx-auto mt-20 grid max-w-[1280px] gap-8 border-t border-[var(--pantang-line)] px-5 py-12 text-[var(--pantang-soft)] sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.25fr_repeat(3,1fr)] lg:px-14">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="pantang-brand-mark" aria-hidden="true" />
          <span className="font-[var(--font-serif)] text-xl font-semibold text-[var(--pantang-ink)]">Pantang</span>
        </div>
        <p className="max-w-[34ch] text-sm leading-7 text-[var(--pantang-muted)]">
          A bilingual confinement-kitchen archive for Malaysian mothers, designed to feel more like a warm publication than a utility app.
        </p>
      </div>

      <FooterColumn title="Cook" links={[
        ['All recipes', '/#recipes'],
        ['44-day plan', '/#calendar'],
        ['Herbs & tonics', '/#pantry'],
      ]} />
      <FooterColumn title="Read" links={[
        ['Why pantang', '/#home'],
        ['Mother stories', '/#stories'],
        ['Kitchen notes', '/#recipes'],
      ]} />
      <FooterColumn title="Share" links={[
        ['Submit a recipe', '/#compose'],
        ['Browse D1 recipes', '/#recipes'],
        ['Install the app', '/'],
      ]} />

      <div className="flex flex-col gap-2 border-t border-[var(--pantang-line-soft)] pt-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--pantang-muted)] sm:col-span-2 lg:col-span-4 lg:flex-row lg:justify-between">
        <span>© 2026 Pantang Kitchen · Petaling Jaya, Malaysia</span>
        <span>Impeccable editorial skill, not website mimicry · Built with TanStack Start + D1</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="mb-4 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--pantang-muted)]">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition hover:text-[var(--pantang-terra-deep)]">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
