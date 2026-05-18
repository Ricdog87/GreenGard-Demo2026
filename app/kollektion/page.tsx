'use client';

import { useMemo, useState } from 'react';
import productsData from '@/data/products.json';
import categories from '@/data/categories.json';
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

const ALL_BRANDS = Array.from(new Set(productsData.map((p) => p.brand)));

export default function KollektionPage() {
  const mode = useCart((s) => s.mode);
  const [cat, setCat] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(3000);
  const [sort, setSort] = useState<string>('relevance');

  const filtered = useMemo(() => {
    let list = [...productsData];
    if (cat) list = list.filter((p) => p.category === cat);
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    list = list.filter((p) => priceFor(p.netPrice, mode) <= priceMax);
    if (sort === 'price-asc') list.sort((a, b) => a.netPrice - b.netPrice);
    if (sort === 'price-desc') list.sort((a, b) => b.netPrice - a.netPrice);
    if (sort === 'bestseller') list.sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
    return list;
  }, [cat, brands, priceMax, sort, mode]);

  function toggleBrand(b: string) {
    setBrands((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]));
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="A">Kollektion</Eyebrow>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mt-6 gap-6">
          <h1 className="h-display text-5xl md:text-7xl">
            Die <em className="italic">Kollektion</em>.
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55 num">
            {filtered.length} von {productsData.length} Stücken
          </p>
        </div>

        <div className="grid mt-16 grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-3 space-y-10">
            <div>
              <p className="eyebrow mb-4">Disziplinen</p>
              <ul className="space-y-1.5">
                <li>
                  <button
                    data-cursor="hover"
                    className={cn('text-left w-full font-display text-base hover:text-bronze', !cat ? 'text-ink' : 'text-ink/60')}
                    onClick={() => setCat(null)}
                  >
                    Alle
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <button
                      data-cursor="hover"
                      className={cn('text-left w-full font-display text-base hover:text-bronze', cat === c.slug ? 'text-ink' : 'text-ink/60')}
                      onClick={() => setCat(cat === c.slug ? null : c.slug)}
                    >
                      {c.slug === 'maehroboter' ? 'Robotik' : c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-4">Hersteller</p>
              <div className="flex flex-wrap gap-2">
                {ALL_BRANDS.map((b) => {
                  const active = brands.includes(b);
                  return (
                    <button
                      key={b}
                      data-cursor="hover"
                      onClick={() => toggleBrand(b)}
                      className={cn(
                        'px-3 py-1.5 text-xs border transition-colors',
                        active ? 'bg-forest text-linen border-forest' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-3">
                <p className="eyebrow">Preis bis</p>
                <span className="num font-display text-lg">{priceMax} €</span>
              </div>
              <Slider value={[priceMax]} min={50} max={3000} step={50} onValueChange={(v) => setPriceMax(v[0])} />
            </div>

            {(cat || brands.length || priceMax < 3000) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCat(null); setBrands([]); setPriceMax(3000); }}
              >
                Filter zurücksetzen
              </Button>
            )}
          </aside>

          <div className="lg:col-span-9">
            <div className="flex items-center justify-between border-y border-mist py-3 mb-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">Sortieren</p>
              <div className="flex gap-5">
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
              <p className="text-center py-20 text-ink/60">Keine Stücke entsprechen deiner Auswahl.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
                {filtered.map((p) => (
                  <ProductCard key={p.slug} p={p as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
