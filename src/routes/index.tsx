import { createFileRoute } from '@tanstack/react-router'
        import { Heart, ListFilter, Search, ShoppingBasket, Sparkles, Soup, TimerReset, UtensilsCrossed } from 'lucide-react'
        import { useEffect, useMemo, useState } from 'react'

        import { buildShoppingList, filterRecipes, splitLines } from '#/features/recipes/recipes.helpers'
        import { createRecipe, getRecipes } from '#/features/recipes/recipes.functions'
        import type { CreateRecipeInput, RecipeBenefit, RecipeCategory, RecipeFilter, RecipeWeek } from '#/features/recipes/recipes.types'

        const FAVORITES_KEY = 'pantang-food-start-favorites'

        const categories: Array<RecipeCategory | 'All'> = ['All', 'Soup', 'Comfort', 'Seafood', 'Herbal', 'Protein', 'Snack']
        const benefits: Array<RecipeBenefit | 'All'> = ['All', 'Warming', 'Easy to digest', 'Milk support', 'Energy boosting', 'Light']
        const weeks: Array<RecipeWeek | 'All'> = ['All', 'Week 1', 'Week 2', 'Week 3+']

        export const Route = createFileRoute('/')({
          loader: () => getRecipes(),
          component: Home,
        })

        function Home() {
          const initialRecipes = Route.useLoaderData()
          const [recipes, setRecipes] = useState(initialRecipes)
          const [selectedRecipeId, setSelectedRecipeId] = useState(initialRecipes[0]?.id ?? '')
          const [favorites, setFavorites] = useState<string[]>([])
          const [isSubmitting, setIsSubmitting] = useState(false)
          const [formError, setFormError] = useState('')
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

useEffect(() => {
  const saved = window.localStorage.getItem(FAVORITES_KEY)
  if (!saved) return
  try {
    const parsed = JSON.parse(saved)
    if (Array.isArray(parsed)) {
      setFavorites(parsed.filter((item): item is string => typeof item === 'string'))
    }
  } catch {
    // ignore invalid localStorage
  }
}, [])

useEffect(() => {
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}, [favorites])

const filteredRecipes = useMemo(() => filterRecipes(recipes, filters), [recipes, filters])
const featuredRecipes = useMemo(() => recipes.filter((recipe) => recipe.featured).slice(0, 3), [recipes])
const favoriteRecipes = useMemo(() => recipes.filter((recipe) => favorites.includes(recipe.id)), [recipes, favorites])
const shoppingList = useMemo(() => buildShoppingList(recipes, favorites), [recipes, favorites])
const selectedRecipe =
  filteredRecipes.find((recipe) => recipe.id === selectedRecipeId) || filteredRecipes[0] || recipes[0]

          const stats = useMemo(
            () => [
              { label: 'Resipi aktif', value: `${recipes.length}` },
              { label: 'Menu minggu pertama', value: `${recipes.filter((recipe) => recipe.week === 'Week 1').length}` },
              { label: 'Favorit keluarga', value: `${favoriteRecipes.length}` },
            ],
            [favoriteRecipes.length, recipes],
          )

          function toggleFavorite(recipeId: string) {
            setFavorites((current) =>
              current.includes(recipeId) ? current.filter((item) => item !== recipeId) : [...current, recipeId],
            )
          }

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
              setSelectedRecipeId(created.id)
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
            } catch (error) {
              setFormError(error instanceof Error ? error.message : 'Tidak dapat menyimpan resipi baharu.')
            } finally {
              setIsSubmitting(false)
            }
          }

          return (
            <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
              <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-orange-400 via-rose-400 to-amber-200 p-[1px] shadow-2xl shadow-orange-950/30">
                <div className="grid gap-6 rounded-[calc(2rem-1px)] bg-stone-950/95 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/20 bg-orange-300/10 px-3 py-1 text-sm font-medium text-orange-100">
                      <Sparkles className="h-4 w-4" /> UI baharu + TanStack Start + Turso/Drizzle
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-orange-100/70">Pantang Food untuk ibu Melayu</p>
                      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        Resipi pantang yang lebih cantik, lebih tersusun, dan sedia berkembang dengan database sebenar.
                      </h1>
                      <p className="max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                        Cari menu ikut minggu pemulihan, manfaat, dan bahan dapur. Simpan favorit keluarga dan bina senarai belian automatik terus dari aplikasi.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {stats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                          <p className="text-sm text-stone-400">{stat.label}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <div className="flex items-center gap-2 text-sm text-orange-100">
                      <Soup className="h-4 w-4" /> Cadangan utama hari ini
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className={`recipe-glow recipe-glow-${selectedRecipe.heroColor} rounded-[1.5rem] p-5 text-stone-950`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">{selectedRecipe.week}</p>
                            <h2 className="mt-2 text-2xl font-semibold">{selectedRecipe.title}</h2>
                          </div>
                          <button
                            type="button"
                            className="rounded-full bg-black/10 p-2 text-stone-900 transition hover:bg-black/20"
                            onClick={() => toggleFavorite(selectedRecipe.id)}
                            aria-label="Toggle favourite"
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(selectedRecipe.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-stone-800/80">{selectedRecipe.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-stone-800/80">
                          <span className="rounded-full bg-black/10 px-3 py-1">{selectedRecipe.category}</span>
                          <span className="rounded-full bg-black/10 px-3 py-1">{selectedRecipe.benefit}</span>
                          <span className="rounded-full bg-black/10 px-3 py-1">{selectedRecipe.prepTime}</span>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {featuredRecipes.map((recipe) => (
                          <button
                            key={recipe.id}
                            type="button"
                            className="rounded-2xl border border-white/10 bg-stone-900/70 p-4 text-left transition hover:border-orange-300/40 hover:bg-stone-900"
                            onClick={() => setSelectedRecipeId(recipe.id)}
                          >
                            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{recipe.category}</p>
                            <p className="mt-2 font-medium text-white">{recipe.title}</p>
                            <p className="mt-1 text-sm text-stone-400">{recipe.benefit}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-6">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/10 backdrop-blur">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm text-orange-200"><Search className="h-4 w-4" /> Cari resipi</p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">Menu ikut selera ibu dan stok dapur</h2>
                      </div>
                      <p className="max-w-md text-sm leading-6 text-stone-400">Tapis ikut minggu pantang, manfaat utama, kategori menu, atau bahan seperti halia, kurma, ikan, dan labu.</p>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <label className="space-y-2 text-sm text-stone-300 md:col-span-2 xl:col-span-1">
                        <span>Carian</span>
                        <input
                          value={filters.query}
                          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
                          placeholder="Contoh: halia, bubur, salmon"
                          className="w-full rounded-2xl border border-white/10 bg-stone-900/70 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-stone-500 focus:border-orange-300/40"
                        />
                      </label>
                      <SelectField label="Kategori" value={filters.category} onChange={(value) => setFilters((current) => ({ ...current, category: value as RecipeCategory | 'All' }))} options={categories} />
                      <SelectField label="Manfaat" value={filters.benefit} onChange={(value) => setFilters((current) => ({ ...current, benefit: value as RecipeBenefit | 'All' }))} options={benefits} />
                      <SelectField label="Minggu" value={filters.week} onChange={(value) => setFilters((current) => ({ ...current, week: value as RecipeWeek | 'All' }))} options={weeks} />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => setSelectedRecipeId(recipe.id)}
                        className={`group rounded-[1.5rem] border p-5 text-left transition ${selectedRecipe.id === recipe.id ? 'border-orange-300/60 bg-orange-100 text-stone-950 shadow-lg shadow-orange-950/10' : 'border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/8'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${selectedRecipe.id === recipe.id ? 'text-stone-600' : 'text-stone-400'}`}>{recipe.week}</p>
                            <h3 className="mt-2 text-xl font-semibold">{recipe.title}</h3>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${selectedRecipe.id === recipe.id ? 'bg-stone-950/10 text-stone-700' : 'bg-white/10 text-stone-200'}`}>{recipe.category}</span>
                        </div>
                        <p className={`mt-3 text-sm leading-6 ${selectedRecipe.id === recipe.id ? 'text-stone-700' : 'text-stone-400'}`}>{recipe.summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                          <span className={`rounded-full px-3 py-1 ${selectedRecipe.id === recipe.id ? 'bg-stone-950/10 text-stone-700' : 'bg-white/10 text-stone-200'}`}>{recipe.benefit}</span>
                          <span className={`rounded-full px-3 py-1 ${selectedRecipe.id === recipe.id ? 'bg-stone-950/10 text-stone-700' : 'bg-white/10 text-stone-200'}`}>{recipe.prepTime}</span>
                          <span className={`rounded-full px-3 py-1 ${selectedRecipe.id === recipe.id ? 'bg-stone-950/10 text-stone-700' : 'bg-white/10 text-stone-200'}`}>{recipe.servings}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {filteredRecipes.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 p-8 text-center text-stone-400">
                      Tiada resipi sepadan. Cuba longgarkan penapis atau cari bahan lain.
                    </div>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-orange-200">Butiran resipi</p>
                          <h2 className="mt-2 text-3xl font-semibold text-white">{selectedRecipe.title}</h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(selectedRecipe.id)}
                          className={`rounded-full px-4 py-2 text-sm font-medium transition ${favorites.includes(selectedRecipe.id) ? 'bg-orange-300 text-stone-950' : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                        >
                          {favorites.includes(selectedRecipe.id) ? '★ Favorit' : '☆ Simpan'}
                        </button>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-stone-300">{selectedRecipe.summary}</p>
                      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-stone-200">
                        {selectedRecipe.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">#{tag}</span>
                        ))}
                      </div>

                      <div className="mt-6 grid gap-3 md:grid-cols-3">
                        <InfoCard icon={<TimerReset className="h-4 w-4" />} label="Masa" value={selectedRecipe.prepTime} />
                        <InfoCard icon={<UtensilsCrossed className="h-4 w-4" />} label="Hidangan" value={selectedRecipe.servings} />
                        <InfoCard icon={<ListFilter className="h-4 w-4" />} label="Fokus" value={selectedRecipe.benefit} />
                      </div>

                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <RecipeListSection title="Bahan-bahan" items={selectedRecipe.ingredients} ordered={false} />
                        <RecipeListSection title="Cara memasak" items={selectedRecipe.steps} ordered />
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-stone-900/60 p-4">
                        <p className="text-sm font-medium text-white">Tip dapur</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                          {selectedRecipe.pantryTips.map((tip) => (
                            <li key={tip}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </section>

                  <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="flex items-center gap-2 text-sm text-orange-200"><Heart className="h-4 w-4" /> Favorit keluarga</div>
                      <div className="mt-4 space-y-3">
                        {favoriteRecipes.length > 0 ? favoriteRecipes.map((recipe) => (
                          <button
                            key={recipe.id}
                            type="button"
                            onClick={() => setSelectedRecipeId(recipe.id)}
                            className="w-full rounded-2xl border border-white/10 bg-stone-900/70 p-4 text-left transition hover:border-orange-300/40"
                          >
                            <p className="font-medium text-white">{recipe.title}</p>
                            <p className="mt-1 text-sm text-stone-400">{recipe.benefit}</p>
                          </button>
                        )) : <p className="text-sm leading-6 text-stone-400">Simpan beberapa resipi supaya pasangan atau ahli keluarga boleh terus ikut menu yang ibu suka.</p>}
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="flex items-center gap-2 text-sm text-orange-200"><ShoppingBasket className="h-4 w-4" /> Senarai belian automatik</div>
                      <div className="mt-4 space-y-2">
                        {shoppingList.length > 0 ? shoppingList.map((item) => (
                          <div key={item} className="rounded-2xl bg-stone-900/70 px-4 py-3 text-sm text-stone-200">{item}</div>
                        )) : <p className="text-sm leading-6 text-stone-400">Favorit yang disimpan akan digabungkan di sini sebagai senarai bahan dapur.</p>}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center gap-2 text-sm text-orange-200"><Sparkles className="h-4 w-4" /> Tambah resipi keluarga</div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Simpan resipi pantang versi rumah sendiri</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-400">Resipi baharu akan disimpan melalui TanStack Start server function ke Turso/libSQL menggunakan Drizzle.</p>
                    <form className="mt-5 grid gap-4" onSubmit={handleCreateRecipe}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextField label="Nama resipi" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} placeholder="Contoh: Sup Ikan Merah Halia" />
                        <TextField label="Ringkasan" value={form.summary} onChange={(value) => setForm((current) => ({ ...current, summary: value }))} placeholder="Kenapa resipi ini sesuai untuk ibu?" />
                        <SelectField label="Kategori" value={form.category} onChange={(value) => setForm((current) => ({ ...current, category: value as RecipeCategory }))} options={categories.filter((item): item is RecipeCategory => item !== 'All')} />
                        <SelectField label="Manfaat" value={form.benefit} onChange={(value) => setForm((current) => ({ ...current, benefit: value as RecipeBenefit }))} options={benefits.filter((item): item is RecipeBenefit => item !== 'All')} />
                        <SelectField label="Minggu" value={form.week} onChange={(value) => setForm((current) => ({ ...current, week: value as RecipeWeek }))} options={weeks.filter((item): item is RecipeWeek => item !== 'All')} />
                        <div className="grid grid-cols-2 gap-4">
                          <TextField label="Masa" value={form.prepTime} onChange={(value) => setForm((current) => ({ ...current, prepTime: value }))} placeholder="25 minit" />
                          <TextField label="Hidangan" value={form.servings} onChange={(value) => setForm((current) => ({ ...current, servings: value }))} placeholder="2 orang" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextareaField label="Bahan-bahan (satu baris satu item)" value={form.ingredients} onChange={(value) => setForm((current) => ({ ...current, ingredients: value }))} placeholder={`300g ayam\n2 inci halia\n700ml air`} />
                        <TextareaField label="Cara memasak (satu baris satu langkah)" value={form.steps} onChange={(value) => setForm((current) => ({ ...current, steps: value }))} placeholder={`Tumis bahan...\nMasukkan ayam...`} />
                        <TextareaField label="Tip dapur (opsyenal)" value={form.pantryTips} onChange={(value) => setForm((current) => ({ ...current, pantryTips: value }))} placeholder={`Simpan stok awal minggu\nGuna api perlahan`} />
                        <TextField label="Tag (pisahkan dengan koma)" value={form.tags} onChange={(value) => setForm((current) => ({ ...current, tags: value }))} placeholder="halia, berkuah, cepat" />
                      </div>
                      {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-2xl bg-orange-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-orange-200 disabled:cursor-not-allowed disabled:bg-orange-100"
                      >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan resipi ke database'}
                      </button>
                    </form>
                  </section>
                </div>
              </section>
            </main>
          )
        }

        function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
          return (
            <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4">
              <div className="flex items-center gap-2 text-sm text-stone-400">{icon}{label}</div>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </div>
          )
        }

        function RecipeListSection({ title, items, ordered }: { title: string; items: string[]; ordered: boolean }) {
          const ListTag = ordered ? 'ol' : 'ul'
          return (
            <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4">
              <p className="text-sm font-medium text-white">{title}</p>
              <ListTag className="mt-3 space-y-2 text-sm leading-6 text-stone-300">
                {items.map((item) => (
                  <li key={item} className="rounded-xl bg-white/5 px-3 py-2">{item}</li>
                ))}
              </ListTag>
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
            <label className="space-y-2 text-sm text-stone-300">
              <span>{label}</span>
              <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-stone-900/70 px-4 py-3 text-white outline-none transition focus:border-orange-300/40"
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
            <label className="space-y-2 text-sm text-stone-300">
              <span>{label}</span>
              <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-white/10 bg-stone-900/70 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-orange-300/40"
              />
            </label>
          )
        }

        function TextareaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
          return (
            <label className="space-y-2 text-sm text-stone-300">
              <span>{label}</span>
              <textarea
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-stone-900/70 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-orange-300/40"
              />
            </label>
          )
        }
