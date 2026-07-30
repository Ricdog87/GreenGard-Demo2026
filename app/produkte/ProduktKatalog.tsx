'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { brands as ALL_BRANDS, categories, products as productsData } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Eyebrow } from '@/components/Eyebrow';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/cart';
import { priceFor } from '@/lib/pricing';

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Empfohlen' },
  { id: 'price-asc', label: 'Preis ↑' },
  { id: 'price-desc', label: 'Preis ↓' },
  { id: 'bestseller', label: 'Bestseller' },
];

const PRICE_CEILING = 3000;

export function ProduktKatalog() {
  const params = useSearchParams();
  const catFromUrl = params.get('cat');
  const mode = useCart((s) => s.mode);

  const [cat, setCat] = useState<string | null>(catFromUrl);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(PRICE_CEILING);
  const [sort, setSort] = useState('relevance');

  const filtered = useMemo(() => {
    let list = [...productsData];
    if (cat) list = list.filter((p) => p.category === cat);
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (priceMax < PRICE_CEILING) list = list.filter((p) => priceFor(p.netPrice, mode) <= priceMax);
    if (sort === 'price-asc') list.sort((a, b) => a.netPrice - b.netPrice);
    if (sort === 'price-desc') list.sort((a, b) => b.netPrice - a.netPrice);
    if (sort === 'bestseller')
      list.sort((a, b) => Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)));
    return list;
  }, [cat, brands, priceMax, sort, mode]);

  function toggleBrand(b: string) {
    setBrands((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]));
  }

  const filtersActive = Boolean(cat) || brands.length > 0 || priceMax < PRICE_CEILING;

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="A">Produkte</Eyebrow>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="h-display text-5xl md:text-7xl">
            Das <em className="italic">Sortiment</em>.
          </h1>
          <p className="num font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
            {filtered.length} von {productsData.length} Artikeln
          </p>
        </div>

        {/* Katalog-Hinweis (Kundenwunsch) */}
        <p className="font-mono mt-8 border-l-2 border-copper/50 bg-linen/60 py-3 pl-4 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/60">
          Aktuelle Preise — tagesaktuell online. Ein gedruckter Katalog erscheint 2026 nicht.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <aside className="space-y-10 lg:col-span-3">
            <div>
              <p className="eyebrow mb-4">Disziplinen</p>
              <ul className="space-y-1.5">
                <li>
                  <button
                    data-cursor="hover"
                    className={cn(
                      'font-display w-full text-left text-base hover:text-bronze',
                      !cat ? 'text-ink' : 'text-ink/60'
                    )}
                    onClick={() => setCat(null)}
                  >
                    Alle
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <button
                      data-cursor="hover"
                      className={cn(
                        'font-display w-full text-left text-base hover:text-bronze',
                        cat === c.slug ? 'text-ink' : 'text-ink/60'
                      )}
                      onClick={() => setCat(cat === c.slug ? null : c.slug)}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-4">Hersteller</p>
              <div className="flex flex-wrap gap-2">
                {ALL_BRANDS.map((b) => (
                  <button
                    key={b}
                    data-cursor="hover"
                    onClick={() => toggleBrand(b)}
                    className={cn(
                      'border px-3 py-1.5 text-xs transition-colors',
                      brands.includes(b)
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <p className="eyebrow">Preis bis</p>
                <span className="num font-display text-lg">
                  {priceMax >= PRICE_CEILING ? 'alle' : `${priceMax} €`}
                </span>
              </div>
              <Slider
                value={[priceMax]}
                min={50}
                max={PRICE_CEILING}
                step={50}
                onValueChange={(v) => setPriceMax(v[0])}
                aria-label="Maximalpreis"
              />
            </div>

            {filtersActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCat(null);
                  setBrands([]);
                  setPriceMax(PRICE_CEILING);
                }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-10 flex flex-col gap-3 border-y border-mist py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
                Sortieren
              </p>
              <div className="flex flex-wrap gap-5">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    data-cursor="hover"
                    onClick={() => setSort(o.id)}
                    className={cn(
                      'font-mono text-[11px] uppercase tracking-[0.18em] transition-colors',
                      sort === o.id ? 'text-ink' : 'text-ink/50 hover:text-ink'
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="py-20 text-center text-ink/60">
                Keine Artikel entsprechen Ihrer Auswahl.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.slug} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
