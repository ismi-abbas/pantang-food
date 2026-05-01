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
    `rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-[#2B1D14] text-[#FBF7EE]' : 'text-[#5C4636] hover:bg-[#EDE3D2] hover:text-[#2B1D14]'}`

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8DCC4] bg-[rgba(245,239,230,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-5 py-4 sm:px-8 lg:px-14">
        <Link to="/" className="flex items-center gap-3">
          <span className="pantang-brand-mark" aria-hidden="true" />
          <span>
            <span className="block font-[var(--font-serif)] text-xl font-semibold tracking-[-0.01em] text-[#2B1D14]">Pantang</span>
            <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8A7560]">Confinement Kitchen · KL</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <a href="/#home" className={linkClass(active === 'home')}>Home</a>
          <a href="/#recipes" className={linkClass(active === 'recipes' || active === 'detail')}>Recipes</a>
          <a href="/#calendar" className={linkClass(false)}>Meal Plan</a>
          <a href="/#pantry" className={linkClass(false)}>Herbs & Tonics</a>
          <a href="/#stories" className={linkClass(false)}>About</a>
        </nav>

        {language && onLanguageChange ? (
          <div className="flex rounded-full border border-[#D9CBB3] bg-[#FBF7EE] p-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[#8A7560]">
            <button
              type="button"
              onClick={() => onLanguageChange('en')}
              className={`rounded-full px-3 py-1 ${language === 'en' ? 'bg-[#2B1D14] text-[#FBF7EE]' : ''}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange('bm')}
              className={`rounded-full px-3 py-1 ${language === 'bm' ? 'bg-[#2B1D14] text-[#FBF7EE]' : ''}`}
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
    <footer className="mx-auto mt-20 grid max-w-[1280px] gap-8 border-t border-[#D9CBB3] px-5 py-12 text-[#5C4636] sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:px-14">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="pantang-brand-mark" aria-hidden="true" />
          <span className="font-[var(--font-serif)] text-xl font-semibold text-[#2B1D14]">Pantang</span>
        </div>
        <p className="max-w-[34ch] text-sm leading-7 text-[#8A7560]">
          A bilingual confinement-kitchen archive built for Malaysian mothers, now adapted into the live app experience.
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

      <div className="flex flex-col gap-2 border-t border-[#E8DCC4] pt-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#8A7560] sm:col-span-2 lg:col-span-4 lg:flex-row lg:justify-between">
        <span>© 2026 Pantang Kitchen · Petaling Jaya, Malaysia</span>
        <span>Designed from the Pantang.html handoff · Built with TanStack Start + D1</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h3 className="mb-4 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] text-[#8A7560]">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="transition hover:text-[#7A4A2B]">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
