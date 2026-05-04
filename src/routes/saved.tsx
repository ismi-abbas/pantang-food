import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Heart, ShoppingBasket, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { PantangFooter, PantangHeader } from '#/components/pantang-layout'
import { buildShoppingList, parseStoredRecipeIds, selectRecipesByIds } from '#/features/recipes/recipes.helpers'
import { getRecipes } from '#/features/recipes/recipes.functions'
import type { Recipe } from '#/features/recipes/recipes.types'

const FAVORITES_KEY = 'pantang-food-start-favorites'

export const Route = createFileRoute('/saved')({
  loader: () => getRecipes(),
  component: SavedRecipesPage,
})

function SavedRecipesPage() {
  const recipes = Route.useLoaderData()
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    setSavedIds(parseStoredRecipeIds(window.localStorage.getItem(FAVORITES_KEY)))
  }, [])

  const savedRecipes = useMemo(() => selectRecipesByIds(recipes, savedIds), [recipes, savedIds])
  const shoppingList = useMemo(() => buildShoppingList(recipes, savedIds), [recipes, savedIds])
  const savedCount = savedRecipes.length
  const featuredRecipe = savedRecipes[0] ?? recipes[0]

  return (
    <div className="bg-[var(--pantang-bg)] text-[var(--pantang-ink)]">
      <PantangHeader active="saved" />

      <main className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8 lg:px-14">
        <div className="pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--pantang-muted)] transition hover:text-[var(--pantang-terra-deep)]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <section className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:py-12">
          <div className="rounded-[1.8rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-7 shadow-[0_16px_40px_rgba(43,29,20,0.06)] sm:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pantang-line-soft)] bg-[var(--pantang-warm)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
                <Heart className="h-3.5 w-3.5" /> Saved shelf
              </span>
              <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">
                {savedCount} recipes kept on this device
              </span>
            </div>
            <h1 className="mt-5 font-[var(--font-serif)] text-[clamp(2.4rem,5.3vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-[var(--pantang-ink)]">
              Recipes you will want to cook again.
            </h1>
            <p className="mt-5 max-w-[52ch] font-[var(--font-serif)] text-[clamp(1.02rem,1.7vw,1.2rem)] italic leading-8 text-[var(--pantang-soft)]">
              This shelf collects the recipes you have marked with the heart icon, then turns them into a practical shopping list for the next kitchen session.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-[var(--pantang-line)] px-5 py-3 text-sm font-medium text-[var(--pantang-ink)] transition hover:bg-[var(--pantang-warm)]"
              >
                Browse recipes
              </Link>
              <a
                href="#shopping-list"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--pantang-ink)] px-5 py-3 text-sm font-medium text-[var(--pantang-cream)] transition hover:bg-[var(--pantang-terra-deep)]"
              >
                <ShoppingBasket className="h-4 w-4" /> View shopping list
              </a>
            </div>
          </div>

          <div className={`recipe-glow recipe-glow-${featuredRecipe.heroColor} overflow-hidden rounded-[1.8rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-deep)]`}>
            <div className="flex items-center justify-between gap-4 p-6 pb-0">
              <span className="rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-cream)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-ink)]">
                {featuredRecipe.week} · {featuredRecipe.category}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(20,20,19,0.12)] px-3 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-ink)]">
                <Sparkles className="h-3.5 w-3.5" /> Local shelf
              </span>
            </div>
            <div className="overflow-hidden p-6 pt-4">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.35rem] border border-black/8">
                {featuredRecipe.imageUrl ? (
                  <img
                    src={featuredRecipe.imageUrl}
                    alt={featuredRecipe.imageAlt ?? featuredRecipe.title}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="pantang-placeholder flex h-full items-center justify-center p-6 text-center">
                    <div>
                      <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em] text-[var(--pantang-ink)]">Featured saved recipe</p>
                      <p className="mt-3 font-[var(--font-serif)] text-lg italic leading-8 text-[var(--pantang-soft)]">{featuredRecipe.title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 rounded-2xl bg-[rgba(255,255,255,0.24)] px-4 py-4 text-sm leading-7 text-[var(--pantang-ink)] backdrop-blur-sm">
                {featuredRecipe.summary}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="border-t border-[var(--pantang-line)] pt-5">
              <h2 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--pantang-muted)]">Saved recipes</h2>
              {savedRecipes.length > 0 ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {savedRecipes.map((recipe: Recipe) => (
                    <Link
                      key={recipe.id}
                      to="/recipes/$recipeId"
                      params={{ recipeId: recipe.id }}
                      className="group overflow-hidden rounded-[1.6rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(43,29,20,0.08)]"
                    >
                      <div className={`recipe-glow recipe-glow-${recipe.heroColor} aspect-[4/3] overflow-hidden bg-[var(--pantang-deep)]`}>
                        {recipe.imageUrl ? (
                          <img src={recipe.imageUrl} alt={recipe.imageAlt ?? recipe.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="pantang-placeholder flex h-full items-center justify-center p-6 text-center">
                            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-ink)]">{recipe.week}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex flex-wrap gap-2">
                          <Tag>{recipe.category}</Tag>
                          <Tag>{recipe.week}</Tag>
                        </div>
                        <h3 className="mt-4 font-[var(--font-serif)] text-2xl leading-tight text-[var(--pantang-ink)] group-hover:text-[var(--pantang-terra-deep)]">
                          {recipe.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--pantang-muted)]">{recipe.summary}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[1.5rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6 text-sm leading-7 text-[var(--pantang-muted)]">
                  No recipes are saved yet. Tap the heart on any recipe page to fill this shelf.
                </div>
              )}
            </div>
          </div>

          <aside id="shopping-list" className="rounded-[1.7rem] border border-[var(--pantang-line-soft)] bg-[var(--pantang-cream)] p-6">
            <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]">
              <ShoppingBasket className="h-4 w-4" /> Shopping list
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--pantang-muted)]">Ingredients combined from your saved shelf.</p>
            <div className="mt-4 space-y-2">
              {shoppingList.length > 0 ? (
                shoppingList.map((item) => (
                  <div key={item} className="rounded-2xl bg-[var(--pantang-warm)] px-4 py-3 text-sm text-[var(--pantang-ink)]">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--pantang-line-soft)] px-4 py-4 text-sm leading-7 text-[var(--pantang-muted)]">
                  Save a few recipes and the shopping list will appear here.
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      <PantangFooter />
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
