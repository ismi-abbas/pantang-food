import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Clock3, Heart, ListFilter, ShoppingBasket, UtensilsCrossed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PantangFooter, PantangHeader } from '#/components/pantang-layout'
import { buildRecipeWisdom } from '#/features/recipes/pantang-design'
import { buildShoppingList } from '#/features/recipes/recipes.helpers'
import { getRecipeById, getRecipes } from '#/features/recipes/recipes.functions'
import type { Recipe } from '#/features/recipes/recipes.types'

const FAVORITES_KEY = 'pantang-food-start-favorites'

export const Route = createFileRoute('/recipes/$recipeId')({
  loader: async ({ params }) => {
    const [recipe, recipes] = await Promise.all([
      getRecipeById({ data: params.recipeId }),
      getRecipes(),
    ])

    if (!recipe) {
      throw notFound()
    }

    return { recipe, recipes }
  },
  component: RecipeDetailPage,
})

function RecipeDetailPage() {
  const { recipe, recipes } = Route.useLoaderData()
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = window.localStorage.getItem(FAVORITES_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        setFavorites(parsed.filter((item): item is string => typeof item === 'string'))
      }
    } catch {
      // ignore invalid local storage
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const relatedRecipes = useMemo(
    () => recipes.filter((item: Recipe) => item.id !== recipe.id).slice(0, 4),
    [recipe.id, recipes],
  )
  const favouriteRecipes = useMemo(
    () => recipes.filter((item: Recipe) => favorites.includes(item.id) && item.id !== recipe.id).slice(0, 4),
    [favorites, recipe.id, recipes],
  )
  const shoppingList = useMemo(() => buildShoppingList(recipes, [recipe.id, ...favorites]), [favorites, recipe.id, recipes])
  const isFavourite = favorites.includes(recipe.id)
  const wisdom = buildRecipeWisdom(recipe)

  function toggleFavorite(recipeId: string) {
    setFavorites((current) =>
      current.includes(recipeId) ? current.filter((item) => item !== recipeId) : [...current, recipeId],
    )
  }

  return (
    <div className="bg-[var(--pantang-bg)] text-[var(--pantang-ink)]">
      <PantangHeader active="detail" />

      <main className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:px-14">
        <div className="pt-8">
          <Link to="/" className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--pantang-muted)] transition hover:text-[var(--pantang-terra-deep)]">
            <ArrowLeft className="h-4 w-4" /> Back to recipes
          </Link>
        </div>

        <section className="grid gap-8 py-8 lg:grid-cols-2 lg:items-stretch lg:py-12">
          <div className={`recipe-glow recipe-glow-${recipe.heroColor} overflow-hidden rounded-[1.8rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-deep)]`}>
            <div className="mb-4 flex items-center justify-between gap-4 p-6 pb-0">
              <span className="rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-ink)]">
                {recipe.week} · {recipe.category}
              </span>
              <button
                type="button"
                onClick={() => toggleFavorite(recipe.id)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${isFavourite ? 'border-[var(--pantang-ink)] bg-[var(--pantang-ink)] text-[var(--pantang-cream)]' : 'border-black/10 bg-white/20 text-[var(--pantang-ink)]'}`}
                aria-label="Toggle favourite"
              >
                <Heart className={`h-5 w-5 ${isFavourite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="overflow-hidden px-6 pb-6 pt-4">
              <div className="aspect-square overflow-hidden rounded-[1.35rem] border border-black/8">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="pantang-placeholder h-full p-6 text-center">
                    <div>
                      <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--pantang-ink)]">Recipe photograph</p>
                      <p className="mt-3 font-[var(--font-serif)] text-lg italic leading-8 text-[var(--pantang-soft)]">
                        {recipe.title} served family-style, warm and ready for a gentle recovery meal.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {recipe.sourceName ? (
                <p className="mt-3 text-right font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-soft)]">
                  Photo inspiration from {recipe.sourceName}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <Tag>{recipe.category}</Tag>
                <Tag>{recipe.week}</Tag>
                {recipe.tags.map((tag) => (
                  <Tag key={tag}>#{tag}</Tag>
                ))}
              </div>
              <h1 className="font-[var(--font-serif)] text-[clamp(2.4rem,5.5vw,4.6rem)] leading-[1.01] tracking-[-0.03em] text-[var(--pantang-ink)]">{recipe.title}</h1>
              <p className="mt-5 max-w-[58ch] font-[var(--font-serif)] text-[clamp(1.05rem,1.8vw,1.3rem)] italic leading-8 text-[var(--pantang-soft)]">
                {recipe.summary}
              </p>
            </div>

            <div className="grid overflow-hidden rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-cream)] sm:grid-cols-2 xl:grid-cols-4">
              <MetaStat label="Time" value={recipe.prepTime} icon={<Clock3 className="h-4 w-4" />} />
              <MetaStat label="Yield" value={recipe.servings} icon={<UtensilsCrossed className="h-4 w-4" />} />
              <MetaStat label="Benefit" value={recipe.benefit} icon={<ListFilter className="h-4 w-4" />} />
              <MetaStat label="Saved with" value={`${favorites.length + 1} recipes`} icon={<ShoppingBasket className="h-4 w-4" />} />
            </div>
          </div>
        </section>

        <section className="grid gap-10 pb-12 lg:grid-cols-[1fr_1.45fr] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <div className="border-t border-[var(--pantang-line)] pt-5">
              <h2 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--pantang-muted)]">Ingredients · Bahan-bahan</h2>
              <ul className="mt-4 space-y-3">
                {recipe.ingredients.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-dashed border-[var(--pantang-line-soft)] py-3 text-sm leading-7 text-[var(--pantang-ink)]">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--pantang-terra)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-5">
              <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]"><ShoppingBasket className="h-4 w-4" /> Shopping list</div>
              <p className="mt-3 text-sm leading-7 text-[var(--pantang-muted)]">This combines the current recipe with your saved favourites.</p>
              <div className="mt-4 space-y-2">
                {shoppingList.map((item: string) => (
                  <div key={item} className="rounded-2xl bg-[var(--pantang-warm)] px-4 py-3 text-sm text-[var(--pantang-ink)]">{item}</div>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div className="border-t border-[var(--pantang-line)] pt-5">
              <h2 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--pantang-muted)]">Method · Cara memasak</h2>
              <div className="mt-4 space-y-1">
                {recipe.steps.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-[var(--pantang-line-soft)] py-5 sm:grid-cols-[64px_1fr]">
                    <div className="font-[var(--font-serif)] text-4xl leading-none text-[var(--pantang-terra-deep)]">{String(index + 1).padStart(2, '0')}</div>
                    <div>
                      <p className="font-[var(--font-serif)] text-lg leading-8 text-[var(--pantang-ink)]">{item}</p>
                      {recipe.pantryTips[index] ? (
                        <div className="mt-3 rounded-md border-l-2 border-[var(--pantang-terra)] bg-[var(--pantang-warm)] px-4 py-3 text-sm leading-7 text-[var(--pantang-soft)]">
                          {recipe.pantryTips[index]}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
              <h3 className="font-[var(--font-serif)] text-2xl italic text-[var(--pantang-ink)]">{wisdom.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--pantang-soft)]">{wisdom.body}</p>
            </div>

            <div className="mt-8 rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
              <h2 className="font-[var(--font-serif)] text-2xl text-[var(--pantang-ink)]">Kitchen notes</h2>
              <div className="mt-4 space-y-2">
                {recipe.pantryTips.map((tip: string) => (
                  <div key={tip} className="rounded-2xl bg-[var(--pantang-warm)] px-4 py-3 text-sm leading-7 text-[var(--pantang-soft)]">{tip}</div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              <section className="rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
                <h2 className="font-[var(--font-serif)] text-2xl text-[var(--pantang-ink)]">Open another recipe</h2>
                <div className="mt-4 space-y-3">
                  {relatedRecipes.map((item: Recipe) => (
                    <Link
                      key={item.id}
                      to="/recipes/$recipeId"
                      params={{ recipeId: item.id }}
                      className="block rounded-2xl bg-[var(--pantang-warm)] px-4 py-4 transition hover:bg-[var(--pantang-deep)]"
                    >
                      <p className="font-medium text-[var(--pantang-ink)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--pantang-muted)]">{item.week} · {item.benefit}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
                <h2 className="font-[var(--font-serif)] text-2xl text-[var(--pantang-ink)]">Other favourites</h2>
                <div className="mt-4 space-y-3">
                  {favouriteRecipes.length > 0 ? favouriteRecipes.map((item: Recipe) => (
                    <Link
                      key={item.id}
                      to="/recipes/$recipeId"
                      params={{ recipeId: item.id }}
                      className="block rounded-2xl bg-[var(--pantang-warm)] px-4 py-4 transition hover:bg-[var(--pantang-deep)]"
                    >
                      <p className="font-medium text-[var(--pantang-ink)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--pantang-muted)]">{item.benefit}</p>
                    </Link>
                  )) : <p className="text-sm leading-7 text-[var(--pantang-muted)]">Save a few recipes and your favourites will appear here.</p>}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <PantangFooter />
    </div>
  )
}

function MetaStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="border-b border-[var(--pantang-line-soft)] px-4 py-4 last:border-b-0 sm:border-r sm:last:border-r-0 xl:border-b-0">
      <div className="flex items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 font-[var(--font-serif)] text-2xl text-[var(--pantang-ink)]">{value}</div>
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
