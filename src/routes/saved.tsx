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

      <main className="mx-auto max-w-[1160px] px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)] transition hover:text-[var(--pantang-ink)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
                <Heart className="h-3.5 w-3.5" /> Saved shelf
              </span>
              <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)]">
                {savedCount} recipes on this device
              </span>
            </div>
            <h1 className="mt-5 max-w-[14ch] text-[clamp(2.4rem,5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--pantang-ink)]">
              Recipes you want to cook again.
            </h1>
            <p className="mt-5 max-w-[54ch] text-[1.05rem] leading-8 text-[var(--pantang-soft)]">
              This shelf keeps the recipes you have marked with the heart icon and turns them into a practical shopping list for the next kitchen session.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-5 py-3 text-sm font-medium text-[var(--pantang-ink)] transition hover:bg-white"
              >
                Browse recipes
              </Link>
              <a
                href="#shopping-list"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--pantang-ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--pantang-terra-deep)]"
              >
                <ShoppingBasket className="h-4 w-4" /> View shopping list
              </a>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Featured</p>
                <h2 className="mt-2 text-xl font-semibold text-[var(--pantang-ink)]">Local shelf preview</h2>
              </div>
              <Sparkles className="h-5 w-5 text-[var(--pantang-terra)]" />
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--pantang-line)] bg-white p-4">
              <p className="text-sm font-medium text-[var(--pantang-ink)]">
                {featuredRecipe.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--pantang-soft)]">{featuredRecipe.summary}</p>
              <p className="mt-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">
                {featuredRecipe.week} · {featuredRecipe.category} · {featuredRecipe.prepTime}
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-[var(--pantang-line)] bg-white p-4">
              <p className="text-sm font-medium text-[var(--pantang-ink)]">Shelf note</p>
              <p className="mt-2 text-sm leading-6 text-[var(--pantang-soft)]">
                Keep a few warm soups, a ginger drink, and one quick protein dish ready to repeat.
              </p>
            </div>
          </aside>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-[var(--pantang-line)] pb-4">
              <div>
                <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--pantang-muted)]">Saved recipes</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--pantang-ink)]">Your private collection</h2>
              </div>
            </div>

            {savedRecipes.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-[var(--pantang-line)] bg-white">
                {savedRecipes.map((recipe: Recipe) => (
                  <RecipeRow key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--pantang-line)] bg-[var(--pantang-warm)] p-6 text-sm leading-7 text-[var(--pantang-soft)]">
                No recipes are saved yet. Tap the heart on any recipe page to fill this shelf.
              </div>
            )}
          </div>

          <aside id="shopping-list" className="rounded-[1.75rem] border border-[var(--pantang-line)] bg-white p-6">
            <div className="flex items-center gap-2 text-sm text-[var(--pantang-soft)]">
              <ShoppingBasket className="h-4 w-4" /> Shopping list
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--pantang-muted)]">Ingredients combined from your saved shelf.</p>
            <div className="mt-4 space-y-2">
              {shoppingList.length > 0 ? (
                shoppingList.map((item) => (
                  <div key={item} className="rounded-2xl border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-4 py-3 text-sm text-[var(--pantang-ink)]">
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--pantang-line)] px-4 py-4 text-sm leading-7 text-[var(--pantang-muted)]">
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

function RecipeRow({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="grid gap-3 border-b border-[var(--pantang-line)] px-4 py-4 transition last:border-b-0 hover:bg-[rgba(124,58,237,0.04)] md:grid-cols-[1.6fr_0.7fr] md:items-center"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-[var(--pantang-line)] bg-[var(--pantang-deep)]">
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
      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--pantang-muted)] md:justify-end">
        <span className="rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1">{recipe.week}</span>
        <span className="rounded-full border border-[var(--pantang-line)] bg-[var(--pantang-warm)] px-3 py-1">{recipe.benefit}</span>
      </div>
    </Link>
  )
}
