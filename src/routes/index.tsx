import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { Clock3, Plus, Search, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { PantangHeader } from '#/components/pantang-layout'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet'
import { Textarea } from '#/components/ui/textarea'
import { getPantangPrimaryCtaStyle } from '#/lib/pantang-cta'
import type { PantangLanguage } from '#/features/recipes/pantang-design'
import { filterRecipes, splitLines } from '#/features/recipes/recipes.helpers'
import { createRecipe, getRecipes } from '#/features/recipes/recipes.functions'
import type {
  CreateRecipeInput,
  Recipe,
  RecipeBenefit,
  RecipeCategory,
  RecipeFilter,
  RecipeWeek,
} from '#/features/recipes/recipes.types'

const categories: Array<RecipeCategory | 'All'> = [
  'All',
  'Soup',
  'Comfort',
  'Seafood',
  'Herbal',
  'Protein',
  'Snack',
]
const benefits: Array<RecipeBenefit | 'All'> = [
  'All',
  'Warming',
  'Easy to digest',
  'Milk support',
  'Energy boosting',
  'Light',
]
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

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, filters),
    [recipes, filters],
  )

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
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
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
      await navigate({
        to: '/recipes/$recipeId',
        params: { recipeId: created.id },
      })
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save your new recipe.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[var(--pantang-bg)] text-[var(--pantang-ink)]">
      <PantangHeader
        active="home"
        language={language}
        onLanguageChange={setLanguage}
      />

      <main
        id="home"
        className="mx-auto max-w-[980px] px-4 pb-16 pt-5 sm:px-6 lg:px-8"
      >
        <section
          id="recipes"
          className="rounded-[2rem] border border-[var(--pantang-line)] bg-[var(--pantang-cream)] p-4 shadow-[0_24px_70px_oklch(0.205_0.018_55_/_8%)] sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">
              Menu
            </h1>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-full px-4 text-sm font-medium"
                onClick={() => setShowComposer(true)}
              >
                <Plus className="h-4 w-4" /> Add
              </Button>
              <Button
                asChild
                variant="secondary"
                className="h-9 rounded-full px-4 text-sm font-medium"
              >
                <Link to="/saved">Saved</Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--pantang-line)] pt-5">
            <label className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search menu</span>
              <input
                value={filters.query}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    query: event.target.value,
                  }))
                }
                placeholder="Search ginger, fish, kurma..."
                className="w-full rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-bg)] px-4 py-3 text-[var(--pantang-ink)] outline-none placeholder:text-[var(--pantang-muted)] focus:border-[var(--pantang-terra)]"
              />
            </label>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <FilterRow
                label="Week"
                items={weeks}
                activeItem={filters.week}
                onPick={(week) =>
                  setFilters((current) => ({ ...current, week }))
                }
              />
              <FilterRow
                label="Need"
                items={benefits}
                activeItem={filters.benefit}
                onPick={(benefit) =>
                  setFilters((current) => ({ ...current, benefit }))
                }
              />
              <FilterRow
                label="Type"
                items={categories}
                activeItem={filters.category}
                onPick={(category) =>
                  setFilters((current) => ({ ...current, category }))
                }
              />
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--pantang-line)] bg-[var(--pantang-bg)]">
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
            <div className="mt-4 border-t border-[var(--pantang-line)] py-5 text-sm text-[var(--pantang-soft)]">
              No matches.
            </div>
          ) : null}
        </section>

        <Sheet open={showComposer} onOpenChange={setShowComposer}>
          <SheetContent
            side="bottom"
            className="mx-auto h-[88vh] max-h-[88vh] w-full rounded-t-[1.75rem] border-[var(--pantang-line)] bg-[var(--pantang-bg)] p-0 sm:max-w-3xl"
          >
            <SheetHeader className="border-b border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-5 py-4 sm:px-6">
              <SheetTitle className="text-xl text-[var(--pantang-ink)]">
                Add family recipe
              </SheetTitle>
              <SheetDescription className="text-sm text-[var(--pantang-soft)]">
                Save a custom recipe and open it immediately on its own page.
              </SheetDescription>
            </SheetHeader>

            <form
              className="flex h-[calc(88vh-5.5rem)] flex-col"
              onSubmit={handleCreateRecipe}
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                <TextField
                  label="Recipe name"
                  value={form.title}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, title: value }))
                  }
                  placeholder="Example: Ginger sea bass broth"
                />
                <TextField
                  label="Short summary"
                  value={form.summary}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, summary: value }))
                  }
                  placeholder="Why is this good for recovery?"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectField
                    label="Category"
                    value={form.category}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        category: value as RecipeCategory,
                      }))
                    }
                    options={categories.filter(
                      (item): item is RecipeCategory => item !== 'All',
                    )}
                  />
                  <SelectField
                    label="Benefit"
                    value={form.benefit}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        benefit: value as RecipeBenefit,
                      }))
                    }
                    options={benefits.filter(
                      (item): item is RecipeBenefit => item !== 'All',
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <SelectField
                    label="Week"
                    value={form.week}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        week: value as RecipeWeek,
                      }))
                    }
                    options={weeks.filter(
                      (item): item is RecipeWeek => item !== 'All',
                    )}
                  />
                  <TextField
                    label="Time"
                    value={form.prepTime}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, prepTime: value }))
                    }
                    placeholder="25 min"
                  />
                  <TextField
                    label="Serves"
                    value={form.servings}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, servings: value }))
                    }
                    placeholder="2"
                  />
                </div>
                <TextareaField
                  label="Ingredients"
                  value={form.ingredients}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, ingredients: value }))
                  }
                  placeholder={`300g chicken\n2 inches ginger`}
                  rows={4}
                />
                <TextareaField
                  label="Steps"
                  value={form.steps}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, steps: value }))
                  }
                  placeholder={`Saute aromatics\nAdd broth`}
                  rows={4}
                />
                <TextareaField
                  label="Kitchen notes"
                  value={form.pantryTips}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, pantryTips: value }))
                  }
                  placeholder={`Use low heat`}
                  rows={3}
                />
                <TextField
                  label="Tags"
                  value={form.tags}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, tags: value }))
                  }
                  placeholder="ginger, soup, quick"
                />
                {formError ? (
                  <p className="text-sm text-red-700">{formError}</p>
                ) : null}
              </div>

              <SheetFooter className="border-t border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-5 py-4 sm:flex-row sm:px-6">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-full px-5 text-sm font-medium"
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-full px-5 text-sm font-semibold text-[var(--pantang-cream)] hover:bg-[var(--pantang-terra-deep)] disabled:cursor-not-allowed disabled:opacity-60"
                  style={getPantangPrimaryCtaStyle()}
                >
                  <Sparkles className="h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save recipe'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}

function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="grid gap-3 border-b border-[var(--pantang-line)] px-4 py-4 transition last:border-b-0 hover:bg-[color:oklch(0.565_0.14_43_/_7%)] md:grid-cols-[1.6fr_120px_140px_100px] md:items-center"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--pantang-line)] bg-[var(--pantang-deep)]`}
        >
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.imageAlt ?? recipe.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">
              Recipe
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-medium text-[var(--pantang-ink)]">
            {recipe.title}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--pantang-soft)]">
            {recipe.summary}
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--pantang-soft)] md:text-[var(--pantang-ink)]">
        {recipe.week}
      </p>
      <p className="text-sm text-[var(--pantang-soft)] md:text-[var(--pantang-ink)]">
        {recipe.benefit}
      </p>
      <p className="flex items-center gap-2 text-sm text-[var(--pantang-soft)] md:justify-end md:text-[var(--pantang-ink)]">
        <Clock3 className="h-4 w-4" /> {recipe.prepTime}
      </p>
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
      <p className="mb-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item}
            type="button"
            variant={activeItem === item ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPick(item)}
            className={`h-8 rounded-full px-3 text-sm ${activeItem === item ? 'bg-[var(--pantang-terra-deep)] text-[var(--pantang-cream)] hover:bg-[var(--pantang-ink)]' : 'bg-[var(--pantang-cream)] text-[var(--pantang-soft)] hover:bg-[var(--pantang-warm)]'}`}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full rounded-2xl border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-4 text-[var(--pantang-ink)]">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-2xl border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-4 text-[var(--pantang-ink)] placeholder:text-[var(--pantang-muted)]"
      />
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  rows: number
}) {
  return (
    <label className="space-y-2 text-sm text-[var(--pantang-soft)]">
      <span>{label}</span>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-2xl border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-4 py-3 text-[var(--pantang-ink)] placeholder:text-[var(--pantang-muted)]"
      />
    </label>
  )
}
