import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Clock3, Heart, ListFilter, ShoppingBasket, UtensilsCrossed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PantangFooter, PantangHeader } from '#/components/pantang-layout'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
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

      <main className="mx-auto max-w-[1040px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-4 h-8 rounded-full px-2 text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)] hover:bg-[var(--pantang-warm)] hover:text-[var(--pantang-ink)]">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back to recipes
          </Link>
        </Button>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="border-b border-[var(--pantang-line)] pb-6">
            <div className={`overflow-hidden rounded-[1.4rem] border border-[var(--pantang-line)] bg-[var(--pantang-deep)]`}>
              <div className="flex items-center justify-between gap-4 p-4 pb-0">
                <Badge variant="outline" className="rounded-full border-[var(--pantang-line)] bg-white px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
                  {recipe.week} · {recipe.category}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => toggleFavorite(recipe.id)}
                  className={`rounded-2xl border ${isFavourite ? 'border-[var(--pantang-terra)] bg-[rgba(124,58,237,0.08)] text-[var(--pantang-terra-deep)]' : 'border-[var(--pantang-line)] bg-white text-[var(--pantang-muted)]'}`}
                  aria-label="Toggle favourite"
                >
                  <Heart className={`h-4.5 w-4.5 ${isFavourite ? 'fill-current' : ''}`} />
                </Button>
              </div>
              <div className="p-4 pt-3">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.2rem] border border-[var(--pantang-line)] bg-[var(--pantang-warm)]">
                  {recipe.imageUrl ? (
                    <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <div>
                        <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Recipe photograph</p>
                        <p className="mt-3 text-lg leading-8 text-[var(--pantang-soft)]">{recipe.title} served warm for a gentle recovery meal.</p>
                      </div>
                    </div>
                  )}
                </div>
                {recipe.sourceName ? (
                  <p className="mt-3 text-right font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
                    Photo inspiration from {recipe.sourceName}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-full border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[var(--pantang-muted)]">{recipe.category}</Badge>
              <Badge variant="outline" className="rounded-full border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[var(--pantang-muted)]">{recipe.week}</Badge>
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[var(--pantang-muted)]">#{tag}</Badge>
              ))}
            </div>
            <h1 className="mt-5 text-[clamp(2.4rem,5.3vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--pantang-ink)]">
              {recipe.title}
            </h1>
            <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-8 text-[var(--pantang-soft)]">{recipe.summary}</p>
            <div className="grid gap-3 border-t border-[var(--pantang-line)] pt-6 sm:grid-cols-2 xl:grid-cols-4">
              <MetaStat label="Time" value={recipe.prepTime} icon={<Clock3 className="h-4 w-4" />} />
              <MetaStat label="Yield" value={recipe.servings} icon={<UtensilsCrossed className="h-4 w-4" />} />
              <MetaStat label="Benefit" value={recipe.benefit} icon={<ListFilter className="h-4 w-4" />} />
              <MetaStat label="Saved with" value={`${favorites.length + 1} recipes`} icon={<ShoppingBasket className="h-4 w-4" />} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="border-t border-[var(--pantang-line)] pt-8">
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Ingredients · Bahan-bahan</p>
              <ul className="mt-4 space-y-3">
                {recipe.ingredients.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-[var(--pantang-line)] py-3 text-sm leading-7 text-[var(--pantang-ink)] last:border-b-0">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--pantang-terra)]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--pantang-line)] pt-8">
              <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]">
                <ShoppingBasket className="h-4 w-4" /> Shopping list
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--pantang-muted)]">This combines the current recipe with your saved favourites.</p>
              <div className="mt-4 space-y-2">
                {shoppingList.map((item: string) => (
                  <div key={item} className="border-t border-[var(--pantang-line)] py-3 text-sm text-[var(--pantang-ink)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="border-t border-[var(--pantang-line)] pt-8">
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Method · Cara memasak</p>
              <div className="mt-4 space-y-1">
                {recipe.steps.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-[var(--pantang-line)] py-5 sm:grid-cols-[56px_1fr] last:border-b-0">
                    <div className="text-4xl leading-none text-[var(--pantang-terra-deep)]">{String(index + 1).padStart(2, '0')}</div>
                    <div>
                      <p className="text-[1rem] leading-8 text-[var(--pantang-ink)]">{item}</p>
                      {recipe.pantryTips[index] ? (
                        <div className="mt-3 border-t border-[var(--pantang-line)] pt-3 text-sm leading-7 text-[var(--pantang-soft)]">
                          {recipe.pantryTips[index]}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-2 border-t border-[var(--pantang-line)] pt-8">
              <section className="border-t border-[var(--pantang-line)] pt-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Kitchen notes</h2>
                <div className="mt-4 space-y-2">
                  {recipe.pantryTips.map((tip: string) => (
                    <div key={tip} className="border-t border-[var(--pantang-line)] pt-3 text-sm leading-7 text-[var(--pantang-soft)]">{tip}</div>
                  ))}
                </div>
              </section>

              <section className="border-t border-[var(--pantang-line)] pt-8">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">{wisdom.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--pantang-soft)]">{wisdom.body}</p>
              </section>
            </div>

            <div className="grid gap-6 xl:grid-cols-2 border-t border-[var(--pantang-line)] pt-8">
              <section className="border-t border-[var(--pantang-line)] pt-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Open another recipe</h2>
                <div className="mt-4 space-y-3">
                  {relatedRecipes.map((item: Recipe) => (
                    <Link
                      key={item.id}
                      to="/recipes/$recipeId"
                      params={{ recipeId: item.id }}
                      className="block border-t border-[var(--pantang-line)] py-4 transition hover:text-[var(--pantang-terra-deep)]"
                    >
                      <p className="font-medium text-[var(--pantang-ink)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--pantang-muted)]">
                        {item.week} · {item.benefit}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="border-t border-[var(--pantang-line)] pt-8">
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Other favourites</h2>
                <div className="mt-4 space-y-3">
                  {favouriteRecipes.length > 0 ? favouriteRecipes.map((item: Recipe) => (
                    <Link
                      key={item.id}
                      to="/recipes/$recipeId"
                      params={{ recipeId: item.id }}
                      className="block border-t border-[var(--pantang-line)] py-4 transition hover:text-[var(--pantang-terra-deep)]"
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

function MetaStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border-t border-[var(--pantang-line)] pt-4">
      <div className="flex items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl text-[var(--pantang-ink)]">{value}</div>
    </div>
  )
}
