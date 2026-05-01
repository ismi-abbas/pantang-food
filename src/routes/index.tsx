import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clock3, Flame, Plus, Search, Sparkles, Stars } from 'lucide-react'
import { useMemo, useState } from 'react'

import { PantangFooter, PantangHeader } from '#/components/pantang-layout'
import { getCookpadInspirations } from '#/features/recipes/pantang-cookpad'
import type { PantangLanguage } from '#/features/recipes/pantang-design'
import {
  buildPantangCalendar,
  buildPantangFeaturedRecipes,
  getPantangHeroCopy,
  getPantangPantryStaples,
  getPantangStories,
} from '#/features/recipes/pantang-design'
import { buildRecoveryTimeline, filterRecipes, getTopPantryItems, splitLines } from '#/features/recipes/recipes.helpers'
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
  const recoveryTimeline = useMemo(() => buildRecoveryTimeline(recipes), [recipes])
  const pantryHighlights = useMemo(() => getTopPantryItems(recipes, 6), [recipes])
  const pantryStaples = useMemo(() => getPantangPantryStaples(), [])
  const calendar = useMemo(() => buildPantangCalendar(), [])
  const stories = useMemo(() => getPantangStories(), [])
  const cookpadInspirations = useMemo(() => getCookpadInspirations(6), [])
  const copy = getPantangHeroCopy(language)
  const heroRecipe = featuredRecipes[0] || recipes[0]

  async function handleCreateRecipe(event: React.FormEvent<HTMLFormElement>) {
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

      <main id="home" className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:px-14">
        <section className="grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:py-20">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)] font-[var(--font-mono)]">
              <span>{copy.eyebrow}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pantang-terra)]" />
              <span>Updated from the design handoff</span>
            </div>
            <h1 className="font-[var(--font-serif)] text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.03em] text-[var(--pantang-ink)]">
              {copy.headline}
              <br />
              <em className="text-[var(--pantang-terra-deep)] not-italic">{copy.accent}</em>
              <br />
              food.
            </h1>
            <p className="mt-7 max-w-[56ch] font-[var(--font-serif)] text-[clamp(1.05rem,1.7vw,1.35rem)] italic leading-8 text-[var(--pantang-soft)]">
              {copy.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#recipes" className="inline-flex items-center gap-2 rounded-full bg-[var(--pantang-ink)] px-6 py-3 text-sm font-medium text-[var(--pantang-cream)] transition hover:bg-[var(--pantang-terra-deep)]">
                {copy.ctaPrimary} <span aria-hidden="true">→</span>
              </a>
              <a href="#calendar" className="inline-flex items-center rounded-full border border-[var(--pantang-line)] px-6 py-3 text-sm font-medium text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-warm)]">
                {copy.ctaSecondary}
              </a>
            </div>
            <blockquote className="mt-10 max-w-[44ch] border-l-2 border-[var(--pantang-terra)] pl-5">
              <p className="font-[var(--font-serif)] text-lg italic leading-8 text-[var(--pantang-ink)]">“{copy.quote}”</p>
              <footer className="mt-3 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--pantang-muted)]">— {copy.quoteByline}</footer>
            </blockquote>
          </div>

          <div className={`recipe-glow recipe-glow-${heroRecipe.heroColor} relative overflow-hidden rounded-[1.75rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-deep)] p-6 shadow-[0_24px_60px_rgba(43,29,20,0.18)]`}>
            <span className="absolute left-5 top-5 rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-ink)]">
              No. 01 · {heroRecipe.title}
            </span>
            <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-black/5 bg-[rgba(255,255,255,0.15)]">
              {heroRecipe.imageUrl ? (
                <img
                  src={heroRecipe.imageUrl}
                  alt={heroRecipe.imageAlt ?? heroRecipe.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="pantang-placeholder h-full rounded-[1.1rem] border border-black/8 p-6 text-center">
                  <div>
                    <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--pantang-ink)]">Hero photograph</p>
                    <p className="mt-3 font-[var(--font-serif)] text-base italic leading-7 text-[var(--pantang-soft)]">
                      {`${heroRecipe.title} · ${heroRecipe.summary}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute bottom-5 right-5 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--pantang-ink)] p-4 text-center font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-cream)]">
              Made
              <br />
              with
              <br />
              care
            </div>
          </div>
        </section>

        <section id="calendar" className="border-y border-[var(--pantang-line-soft)] py-8">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
            <div className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--pantang-muted)]">
              The Pantang Calendar
              <br />
              44 days · 4 phases
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-cream)]">
              <div className="grid gap-px bg-[var(--pantang-line-soft)] md:grid-cols-4">
                {calendar.map((phase, index) => (
                  <button
                    key={phase.num}
                    type="button"
                    onClick={() => setActivePhase(index)}
                    className={`bg-[var(--pantang-cream)] px-4 py-4 text-left transition hover:bg-[var(--pantang-warm)] ${activePhase === index ? 'bg-[var(--pantang-ink)] text-[var(--pantang-cream)] hover:bg-[var(--pantang-ink)]' : ''}`}
                  >
                    <p className={`font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] ${activePhase === index ? 'text-[rgba(251,247,238,0.72)]' : 'text-[var(--pantang-muted)]'}`}>
                      Phase {phase.num}
                    </p>
                    <p className="mt-1 font-[var(--font-serif)] text-lg">{phase.name}</p>
                    <p className={`mt-1 text-sm ${activePhase === index ? 'text-[rgba(251,247,238,0.8)]' : 'text-[var(--pantang-muted)]'}`}>
                      {phase.bm} · {phase.days}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Most cooked this month</p>
              <h2 className="mt-3 font-[var(--font-serif)] text-[clamp(2rem,3.5vw,2.8rem)] leading-tight tracking-[-0.02em] text-[var(--pantang-ink)]">
                Begin where the mothers begin —
                <br />
                the first warm dishes for recovery.
              </h2>
            </div>
            <a href="#recipes" className="inline-flex items-center gap-2 rounded-full border border-[var(--pantang-line)] px-5 py-3 text-sm font-medium text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-warm)]">
              All recipes <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
            {featuredRecipes.map((recipe, index) => (
              <FeatureCard key={recipe.id} recipe={recipe} large={index === 0} />
            ))}
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Cookpad inspirations</p>
              <h2 className="mt-3 font-[var(--font-serif)] text-[clamp(2rem,3.5vw,2.8rem)] leading-tight tracking-[-0.02em] text-[var(--pantang-ink)]">
                Real pantang food photography
                <br />
                scraped from the ibu pantang search.
              </h2>
              <p className="mt-4 max-w-[56ch] text-sm leading-7 text-[var(--pantang-soft)]">
                These references come from the Cookpad Malaysia ibu pantang search results you linked, and now help the app feel more grounded in real home-cooked meals.
              </p>
            </div>
            <a
              href="https://cookpad.com/my/search/ibu%20pantang"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--pantang-line)] px-5 py-3 text-sm font-medium text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-warm)]"
            >
              Open Cookpad source <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cookpadInspirations.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-[1.6rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(43,29,20,0.14)]"
              >
                <img src={item.imageUrl} alt={item.imageAlt} className="h-56 w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-5">
                  <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Scraped from {item.sourceName}</p>
                  <h3 className="mt-2 font-[var(--font-serif)] text-2xl leading-tight text-[var(--pantang-ink)]">{item.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="pantry" className="rounded-[1.8rem] bg-[var(--pantang-ink)] px-6 py-8 text-[var(--pantang-cream)] lg:px-10 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[rgba(251,247,238,0.7)]">The pantry</p>
              <h2 className="mt-4 font-[var(--font-serif)] text-[clamp(2rem,3.5vw,2.8rem)] leading-tight tracking-[-0.02em]">Six ingredients do most of the work.</h2>
              <p className="mt-5 max-w-[46ch] font-[var(--font-serif)] text-lg italic leading-8 text-[rgba(251,247,238,0.8)]">
                Almost every dish leans on a small set of warming, blood-building, qi-restoring staples. Stock these once; cook for forty-four days.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {pantryHighlights.map((item) => (
                  <div key={item.ingredient} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <span className="truncate pr-3">{item.ingredient}</span>
                    <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--pantang-terra)]">×{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-3">
              {pantryStaples.map((item) => (
                <div key={item.name} className="bg-[var(--pantang-ink)] px-5 py-5">
                  <p className="font-[var(--font-serif)] text-xl">{item.name}</p>
                  <p className="mt-2 text-sm italic text-[rgba(251,247,238,0.58)]">{item.subtitle}</p>
                  <p className="mt-4 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-terra)]">{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="py-14 lg:py-20">
          <div className="mb-8">
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">From the kitchen table</p>
            <h2 className="mt-3 font-[var(--font-serif)] text-[clamp(2rem,3.5vw,2.8rem)] leading-tight tracking-[-0.02em] text-[var(--pantang-ink)]">
              Notes from mothers
              <br />
              who cooked through it.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {stories.map((story) => (
              <article key={story.name} className="flex rounded-[1.6rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
                <div className="flex min-h-full flex-col">
                  <p className="font-[var(--font-serif)] text-lg leading-8 text-[var(--pantang-ink)]">“{story.quote}”</p>
                  <div className="mt-auto flex items-center gap-3 pt-6">
                    <span className="h-10 w-10 rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-deep)]" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-medium text-[var(--pantang-ink)]">{story.name}</span>
                      <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--pantang-muted)]">{story.where}</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="recipes" className="py-8 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
            <div>
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">The full archive · {recipes.length} recipes growing</p>
              <h2 className="mt-3 font-[var(--font-serif)] text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] tracking-[-0.03em] text-[var(--pantang-ink)]">
                Cook your way
                <br />
                through <em className="text-[var(--pantang-terra-deep)] not-italic">forty-four days</em>.
              </h2>
              <p className="mt-5 max-w-[58ch] font-[var(--font-serif)] text-lg italic leading-8 text-[var(--pantang-soft)]">
                Filter by phase, category, or how long you have. Every recipe opens on its own page, just like the Pantang design intended.
              </p>
            </div>
            <div className="space-y-4 rounded-[1.5rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]"><Search className="h-4 w-4" /> Quick filter</div>
              <input
                value={filters.query}
                onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                placeholder="Search ginger, fish, kurma..."
                className="w-full rounded-2xl border border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] outline-none placeholder:text-[var(--pantang-muted)] focus:border-[var(--pantang-terra)]"
              />
              <FilterRow label="Week" items={weeks} activeItem={filters.week} onPick={(week) => setFilters((current) => ({ ...current, week }))} />
              <FilterRow label="Need" items={benefits} activeItem={filters.benefit} onPick={(benefit) => setFilters((current) => ({ ...current, benefit }))} />
              <FilterRow label="Type" items={categories} activeItem={filters.category} onPick={(category) => setFilters((current) => ({ ...current, category }))} />
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecipes.map((recipe) => (
              <ArchiveCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="mt-6 rounded-[1.6rem] border border-dashed border-[var(--pantang-line)] bg-[var(--pantang-cream)] p-6 text-center text-sm text-[var(--pantang-soft)]">
              No recipe matches yet. Try a broader filter.
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 py-12 md:grid-cols-2 lg:grid-cols-4">
          {recoveryTimeline.map((item) => (
            <div key={item.week} className="rounded-[1.5rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-5">
              <p className="text-sm text-[var(--pantang-soft)]">{item.week}</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--pantang-ink)]">{item.total}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--pantang-muted)]">{item.featuredTitles[0] ?? 'No featured pick yet'}</p>
            </div>
          ))}
          <div className="rounded-[1.5rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-5">
            <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]"><Flame className="h-4 w-4" /> Archive staples</div>
            <div className="mt-4 space-y-2">
              {pantryHighlights.slice(0, 3).map((item) => (
                <div key={item.ingredient} className="flex items-center justify-between rounded-2xl bg-[var(--pantang-warm)] px-4 py-3 text-sm text-[var(--pantang-ink)]">
                  <span className="truncate pr-3">{item.ingredient}</span>
                  <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--pantang-terra-deep)]">×{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="compose" className="rounded-[1.8rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-5 lg:p-6">
          <button
            type="button"
            onClick={() => setShowComposer((current) => !current)}
            className="flex w-full items-center justify-between rounded-[1.3rem] bg-[var(--pantang-warm)] px-5 py-4 text-left"
          >
            <div>
              <p className="text-sm font-medium text-[var(--pantang-ink)]">Add family recipe</p>
              <p className="mt-1 text-sm text-[var(--pantang-muted)]">Save a custom recipe and open it immediately on its own editorial detail page.</p>
            </div>
            <Plus className={`h-5 w-5 text-[var(--pantang-terra-deep)] transition ${showComposer ? 'rotate-45' : ''}`} />
          </button>

          {showComposer ? (
            <form className="mt-5 grid gap-4" onSubmit={handleCreateRecipe}>
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--pantang-ink)] px-5 py-3 text-sm font-semibold text-[var(--pantang-cream)] transition hover:bg-[var(--pantang-terra-deep)] disabled:cursor-not-allowed disabled:opacity-60"
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

function FeatureCard({ recipe, large }: { recipe: Recipe; large: boolean }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className={`overflow-hidden rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(43,29,20,0.16)] ${large ? 'md:row-span-2' : ''}`}
    >
      <div className={`recipe-glow recipe-glow-${recipe.heroColor} ${large ? 'md:aspect-[4/5]' : 'aspect-[4/3]'}`}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="pantang-placeholder h-full rounded-[1.2rem] border border-black/8 p-5 text-center">
            <div>
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--pantang-ink)]">{recipe.title}</p>
              <p className="mt-3 font-[var(--font-serif)] text-sm italic leading-6 text-[var(--pantang-soft)]">{recipe.summary}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Tag>{recipe.category}</Tag>
          <Tag>{recipe.week}</Tag>
        </div>
        <h3 className="font-[var(--font-serif)] text-2xl leading-tight text-[var(--pantang-ink)]">{recipe.title}</h3>
        <div className="mt-4 flex items-center justify-between font-[var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--pantang-muted)]">
          <span>{recipe.prepTime}</span>
          <span>{recipe.benefit}</span>
        </div>
      </div>
    </Link>
  )
}

function ArchiveCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block overflow-hidden rounded-[1.6rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(43,29,20,0.14)]"
    >
      <div className={`recipe-glow recipe-glow-${recipe.heroColor} aspect-[4/3]`}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="pantang-placeholder h-full rounded-[1.2rem] border border-black/8 p-5 text-center">
            <div>
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--pantang-ink)]">{recipe.week}</p>
              <p className="mt-3 font-[var(--font-serif)] text-base italic leading-7 text-[var(--pantang-soft)]">{recipe.title}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">{recipe.category}</p>
            <h3 className="mt-2 font-[var(--font-serif)] text-2xl leading-tight text-[var(--pantang-ink)]">{recipe.title}</h3>
          </div>
          <Stars className="mt-1 h-4 w-4 text-[var(--pantang-terra)]" />
        </div>
        <p className="mt-3 text-sm leading-7 text-[var(--pantang-soft)]">{recipe.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--pantang-soft)]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pantang-warm)] px-3 py-1"><Clock3 className="h-3.5 w-3.5" /> {recipe.prepTime}</span>
          <span className="rounded-full bg-[var(--pantang-warm)] px-3 py-1">{recipe.benefit}</span>
        </div>
      </div>
    </Link>
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
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className={`rounded-full border px-3 py-2 text-sm transition ${activeItem === item ? 'border-[var(--pantang-ink)] bg-[var(--pantang-ink)] text-[var(--pantang-cream)]' : 'border-[var(--pantang-line)] bg-white text-[var(--pantang-soft)] hover:border-[var(--pantang-ink)] hover:text-[var(--pantang-ink)]'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--pantang-line-soft)] bg-[var(--pantang-warm)] px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] text-[var(--pantang-soft)]">
      {children}
    </span>
  )
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] outline-none transition focus:border-[var(--pantang-terra)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] outline-none transition placeholder:text-[var(--pantang-muted)] focus:border-[var(--pantang-terra)]"
      />
    </label>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; rows: number }) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-[var(--pantang-line)] bg-white px-4 py-3 text-[var(--pantang-ink)] outline-none transition placeholder:text-[var(--pantang-muted)] focus:border-[var(--pantang-terra)]"
      />
    </label>
  )
}
