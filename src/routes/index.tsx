import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clock3, Flame, Plus, Search, Sparkles, Stars } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { PantangFooter, PantangHeader } from '#/components/pantang-layout'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { getPantangPrimaryCtaStyle } from '#/lib/pantang-cta'
import { getCookpadInspirations } from '#/features/recipes/pantang-cookpad'
import type { PantangLanguage } from '#/features/recipes/pantang-design'
import {
  buildPantangCalendar,
  buildPantangFeaturedRecipes,
  getPantangHeroCopy,
  getPantangPantryStaples,
  getPantangStories,
} from '#/features/recipes/pantang-design'
import { filterRecipes, getTopPantryItems, splitLines } from '#/features/recipes/recipes.helpers'
import { createRecipe, getRecipes } from '#/features/recipes/recipes.functions'
import type { CreateRecipeInput, Recipe, RecipeBenefit, RecipeCategory, RecipeFilter, RecipeWeek } from '#/features/recipes/recipes.types'

const categories: Array<RecipeCategory | 'All'> = ['All', 'Soup', 'Comfort', 'Seafood', 'Herbal', 'Protein', 'Snack']
const benefits: Array<RecipeBenefit | 'All'> = ['All', 'Warming', 'Easy to digest', 'Milk support', 'Energy boosting', 'Light']
const weeks: Array<RecipeWeek | 'All'> = ['All', 'Week 1', 'Week 2', 'Week 3+']

export const Route = createFileRoute('/')({
  loader: () => getRecipes(),
  component: Home,
})

function Home() {
  const initialRecipes = Route.useLoaderData()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState(initialRecipes)
  const [language, setLanguage] = useState<PantangLanguage>('en')
  const [activePhase, setActivePhase] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [filters, setFilters] = useState<RecipeFilter>({
    query: '',
    category: 'All',
    benefit: 'All',
    week: 'All',
  })
  const [form, setForm] = useState({
    title: '',
    summary: '',
    category: 'Soup' as RecipeCategory,
    benefit: 'Warming' as RecipeBenefit,
    week: 'Week 1' as RecipeWeek,
    prepTime: '25 minit',
    servings: '2 orang',
    ingredients: '',
    steps: '',
    pantryTips: '',
    tags: '',
  })

  const filteredRecipes = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
  const featuredRecipes = useMemo(() => buildPantangFeaturedRecipes(recipes, 5), [recipes])
  const recoveryTimeline = useMemo(() => buildPantangCalendar(), [])
  const pantryHighlights = useMemo(() => getTopPantryItems(recipes, 6), [recipes])
  const pantryStaples = useMemo(() => getPantangPantryStaples(), [])
  const stories = useMemo(() => getPantangStories(), [])
  const cookpadInspirations = useMemo(() => getCookpadInspirations(3), [])
  const copy = getPantangHeroCopy(language)
  const heroRecipe = featuredRecipes[0] || recipes[0]

  async function handleCreateRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError('')

    const payload: CreateRecipeInput = {
      title: form.title,
      summary: form.summary,
      category: form.category,
      benefit: form.benefit,
      week: form.week,
      prepTime: form.prepTime,
      servings: form.servings,
      ingredients: splitLines(form.ingredients),
      steps: splitLines(form.steps),
      pantryTips: splitLines(form.pantryTips),
      tags: form.tags.split(',').map((item) => item.trim()).filter(Boolean),
    }

    try {
      const created = await createRecipe({ data: payload })
      setRecipes((current) => [created, ...current])
      setForm({
        title: '',
        summary: '',
        category: 'Soup',
        benefit: 'Warming',
        week: 'Week 1',
        prepTime: '25 minit',
        servings: '2 orang',
        ingredients: '',
        steps: '',
        pantryTips: '',
        tags: '',
      })
      setShowComposer(false)
      await navigate({ to: '/recipes/$recipeId', params: { recipeId: created.id } })
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save your new recipe.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[var(--pantang-bg)] text-[var(--pantang-ink)]">
      <PantangHeader active="home" language={language} onLanguageChange={setLanguage} />

      <main id="home" className="mx-auto max-w-[1040px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)] font-[var(--font-mono)]">
              <span>{copy.eyebrow}</span>
              <span className="h-1 w-1 rounded-full bg-[var(--pantang-terra)]" />
              <span>Clean workspace, not a loud content feed</span>
            </div>

            <h1 className="mt-4 max-w-[12ch] text-[clamp(2.5rem,5.8vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--pantang-ink)]">
              Pantang recipes, arranged like a workspace.
            </h1>

            <p className="mt-4 max-w-[58ch] text-[clamp(1rem,1.35vw,1.15rem)] leading-8 text-[var(--pantang-soft)]">
              A clean bilingual archive for Malaysian mothers — browse by week, save favourites, and keep the kitchen plan close at hand.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild className="h-10 rounded-full px-5 text-sm font-medium" style={getPantangPrimaryCtaStyle()}>
                <a href="#recipes">
                  Open recipes <span aria-hidden="true">→</span>
                </a>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-full px-5 text-sm font-medium">
                <a href="#composer">
                  <Plus className="h-4 w-4" /> Add a recipe
                </a>
              </Button>
              <Button asChild variant="secondary" className="h-10 rounded-full px-5 text-sm font-medium">
                <Link to="/saved">Saved shelf</Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>44 days</Pill>
              <Pill>Bilingual</Pill>
              <Pill>{recipes.length} recipes</Pill>
              <Pill>Mobile-first</Pill>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Page summary</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--pantang-ink)]">A quiet pantry workspace</h2>
              </div>
              <Stars className="h-5 w-5 text-[var(--pantang-terra)]" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-[var(--pantang-line)] bg-white p-4">
                <p className="text-sm font-medium text-[var(--pantang-ink)]">Featured recipe</p>
                <Link to="/recipes/$recipeId" params={{ recipeId: heroRecipe.id }} className="mt-2 block text-sm leading-6 text-[var(--pantang-soft)] transition hover:text-[var(--pantang-terra-deep)]">
                  {heroRecipe.title} · {heroRecipe.prepTime}
                </Link>
              </div>

              <div className="rounded-2xl border border-[var(--pantang-line)] bg-white p-4">
                <p className="text-sm font-medium text-[var(--pantang-ink)]">Quick facts</p>
                <div className="mt-3 grid gap-2 text-sm text-[var(--pantang-soft)]">
                  <div className="flex items-center justify-between">
                    <span>Phases</span>
                    <span className="font-medium text-[var(--pantang-ink)]">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recovery span</span>
                    <span className="font-medium text-[var(--pantang-ink)]">44 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Languages</span>
                    <span className="font-medium text-[var(--pantang-ink)]">EN / BM</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--pantang-line)] bg-white p-4">
                <p className="text-sm font-medium text-[var(--pantang-ink)]">Design language</p>
                <p className="mt-2 text-sm leading-6 text-[var(--pantang-soft)]">
                  Minimal, neutral, database-like surfaces with a single purple accent and calm spacing.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section id="calendar" className="mt-8 rounded-[1.5rem] border border-[var(--pantang-line)] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Plan</p>
              <h2 className="mt-2 text-[clamp(1.7rem,3vw,2.6rem)] font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">
                The 44-day recovery plan
              </h2>
            </div>
            <p className="max-w-[44ch] text-sm leading-6 text-[var(--pantang-soft)]">
              Tap a phase to see how the kitchen rhythm shifts from recovery to warming meals and milk-supporting dishes.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {recoveryTimeline.map((phase, index) => (
              <button
                key={phase.num}
                type="button"
                onClick={() => setActivePhase(index)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  activePhase === index
                    ? 'border-[var(--pantang-terra)] bg-[rgba(124,58,237,0.06)]'
                    : 'border-[var(--pantang-line)] bg-[var(--pantang-warm)] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Phase {phase.num}</p>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] text-[var(--pantang-muted)]">{phase.days}</span>
                </div>
                <p className="mt-3 text-lg font-semibold text-[var(--pantang-ink)]">{phase.name}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--pantang-soft)]">
                  {phase.bm} · {phase.days}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section id="recipes" className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="rounded-[1.5rem] border border-[var(--pantang-line)] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Database</p>
                <h2 className="mt-2 text-[clamp(1.7rem,3vw,2.6rem)] font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">
                  Cook through the archive
                </h2>
              </div>
              <p className="text-sm text-[var(--pantang-soft)]">{filteredRecipes.length} visible recipes</p>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-4">
              <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]">
                <Search className="h-4 w-4" /> Quick filter
              </div>
              <input
                value={filters.query}
                onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                placeholder="Search ginger, fish, kurma..."
                className="mt-3 w-full rounded-2xl border border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] outline-none placeholder:text-[var(--pantang-muted)] focus:border-[var(--pantang-terra)]"
              />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <FilterRow label="Week" items={weeks} activeItem={filters.week} onPick={(week) => setFilters((current) => ({ ...current, week }))} />
                <FilterRow label="Need" items={benefits} activeItem={filters.benefit} onPick={(benefit) => setFilters((current) => ({ ...current, benefit }))} />
                <FilterRow label="Type" items={categories} activeItem={filters.category} onPick={(category) => setFilters((current) => ({ ...current, category }))} />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[var(--pantang-line)]">
              <div className="hidden grid-cols-[1.6fr_120px_140px_100px] gap-3 border-b border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)] md:grid">
                <span>Recipe</span>
                <span>Week</span>
                <span>Benefit</span>
                <span>Time</span>
              </div>
              <div>
                {filteredRecipes.map((recipe) => (
                  <RecipeRow key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-5 text-sm text-[var(--pantang-soft)]">
                No recipe matches yet. Try a broader filter.
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Pantry</p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--pantang-ink)]">Ingredients that show up again</h3>
                </div>
                <Flame className="h-5 w-5 text-[var(--pantang-terra)]" />
              </div>
              <div className="mt-4 space-y-2">
                {pantryHighlights.slice(0, 5).map((item) => (
                  <div key={item.ingredient} className="flex items-center justify-between rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-4 py-3 text-sm text-[var(--pantang-ink)]">
                    <span className="truncate pr-3">{item.ingredient}</span>
                    <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--pantang-muted)]">×{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-6">
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Staples</p>
              <div className="mt-4 space-y-3">
                {pantryStaples.slice(0, 4).map((item) => (
                  <div key={item.name} className="rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-4 py-3">
                    <p className="text-sm font-medium text-[var(--pantang-ink)]">{item.name}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--pantang-soft)]">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[1.5rem] border border-[var(--pantang-line)] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">References</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Cookpad sources</h2>
              </div>
              <a
                href="https://cookpad.com/my/search/ibu%20pantang"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[var(--pantang-line)] px-4 py-2 text-sm text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-warm)]"
              >
                Open source
              </a>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {cookpadInspirations.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="overflow-hidden rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-warm)] transition hover:-translate-y-0.5 hover:bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--pantang-deep)]">
                    <img src={item.imageUrl} alt={item.imageAlt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4">
                    <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">{item.sourceName}</p>
                    <h3 className="mt-2 text-base font-medium leading-6 text-[var(--pantang-ink)]">{item.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div id="stories" className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-6 sm:p-8">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Notes</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Mother stories, kept short</h2>
            <div className="mt-5 space-y-3">
              {stories.map((story) => (
                <blockquote key={story.name} className="rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-4">
                  <p className="text-sm leading-7 text-[var(--pantang-ink)]">“{story.quote}”</p>
                  <footer className="mt-3 text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">
                    {story.name} · {story.where}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="composer" className="mt-12 rounded-[1.75rem] border border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-5 sm:p-6">
          <button
            type="button"
            onClick={() => setShowComposer((current) => !current)}
            className="flex w-full items-center justify-between rounded-[1.3rem] border border-[var(--pantang-line)] bg-white px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-medium text-[var(--pantang-ink)]">Add family recipe</p>
              <p className="mt-1 text-sm text-[var(--pantang-soft)]">Save a custom recipe and open it immediately on its own page.</p>
            </div>
            <Plus className={`h-5 w-5 text-[var(--pantang-terra)] transition ${showComposer ? 'rotate-45' : ''}`} />
          </button>

          {showComposer ? (
            <form className="mt-5 grid gap-4 rounded-[1.3rem] border border-[var(--pantang-line)] bg-white p-5 sm:p-6" onSubmit={handleCreateRecipe}>
              <TextField label="Recipe name" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} placeholder="Example: Ginger sea bass broth" />
              <TextField label="Short summary" value={form.summary} onChange={(value) => setForm((current) => ({ ...current, summary: value }))} placeholder="Why is this good for recovery?" />
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField label="Category" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value as RecipeCategory }))} options={categories.filter((item): item is RecipeCategory => item !== 'All')} />
                <SelectField label="Benefit" value={form.benefit} onChange={(value) => setForm((current) => ({ ...current, benefit: value as RecipeBenefit }))} options={benefits.filter((item): item is RecipeBenefit => item !== 'All')} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField label="Week" value={form.week} onChange={(value) => setForm((current) => ({ ...current, week: value as RecipeWeek }))} options={weeks.filter((item): item is RecipeWeek => item !== 'All')} />
                <TextField label="Time" value={form.prepTime} onChange={(value) => setForm((current) => ({ ...current, prepTime: value }))} placeholder="25 min" />
                <TextField label="Serves" value={form.servings} onChange={(value) => setForm((current) => ({ ...current, servings: value }))} placeholder="2" />
              </div>
              <TextareaField label="Ingredients" value={form.ingredients} onChange={(value) => setForm((current) => ({ ...current, ingredients: value }))} placeholder={`300g chicken\n2 inches ginger`} rows={4} />
              <TextareaField label="Steps" value={form.steps} onChange={(value) => setForm((current) => ({ ...current, steps: value }))} placeholder={`Saute aromatics\nAdd broth`} rows={4} />
              <TextareaField label="Kitchen notes" value={form.pantryTips} onChange={(value) => setForm((current) => ({ ...current, pantryTips: value }))} placeholder={`Use low heat`} rows={3} />
              <TextField label="Tags" value={form.tags} onChange={(value) => setForm((current) => ({ ...current, tags: value }))} placeholder="ginger, soup, quick" />
              {formError ? <p className="text-sm text-red-700">{formError}</p> : null}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--pantang-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--pantang-terra-deep)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save recipe'}
              </button>
            </form>
          ) : null}
        </section>
      </main>

      <PantangFooter />
    </div>
  )
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="grid gap-3 border-b border-[var(--pantang-line)] px-4 py-4 transition last:border-b-0 hover:bg-[rgba(124,58,237,0.04)] md:grid-cols-[1.6fr_120px_140px_100px] md:items-center"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className={`h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--pantang-line)] bg-[var(--pantang-deep)]`}>
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">Recipe</div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-[var(--pantang-ink)]">{recipe.title}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--pantang-soft)]">{recipe.summary}</p>
        </div>
      </div>
      <p className="text-sm text-[var(--pantang-soft)] md:text-[var(--pantang-ink)]">{recipe.week}</p>
      <p className="text-sm text-[var(--pantang-soft)] md:text-[var(--pantang-ink)]">{recipe.benefit}</p>
      <p className="flex items-center gap-2 text-sm text-[var(--pantang-soft)] md:justify-end md:text-[var(--pantang-ink)]">
        <Clock3 className="h-4 w-4" /> {recipe.prepTime}
      </p>
    </Link>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <Badge variant="outline" className="rounded-full border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--pantang-muted)]">
      {children}
    </Badge>
  )
}

function FilterRow<T extends string>({
  label,
  items,
  activeItem,
  onPick,
}: {
  label: string
  items: T[]
  activeItem: T
  onPick: (item: T) => void
}) {
  return (
    <div>
      <p className="mb-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item}
            type="button"
            variant={activeItem === item ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPick(item)}
            className={`h-8 rounded-full px-3 text-sm ${activeItem === item ? 'bg-[var(--pantang-terra)] text-white hover:bg-[var(--pantang-terra-deep)]' : 'bg-white text-[var(--pantang-soft)] hover:bg-[var(--pantang-warm)]'}`}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full rounded-2xl border-[var(--pantang-line)] bg-white px-4 text-[var(--pantang-ink)]">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>{option}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-2xl border-[var(--pantang-line)] bg-white px-4 text-[var(--pantang-ink)] placeholder:text-[var(--pantang-muted)]"
      />
    </label>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; rows: number }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-2xl border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] placeholder:text-[var(--pantang-muted)]"
      />
    </label>
  )
}
