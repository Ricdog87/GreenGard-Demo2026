'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Minus, Plus, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eyebrow } from '@/components/Eyebrow';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel, volumeDiscount } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';
import { getCategory, type Product } from '@/lib/data';

export function ProductDetail({ product, cross }: { product: Product; cross: Product[] }) {
  const mode = useCart((s) => s.mode);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);
  const [qty, setQty] = useState(1);

  const category = getCategory(product.category);
  const unit = priceFor(product.netPrice, mode);
  const discount = volumeDiscount(qty, mode);
  const total = unit * qty * (1 - discount);

  function handleAdd() {
    addItem({ ...product, qty });
    openDrawer();
  }

  return (
    <>
      <div className="py-12 md:py-20">
        <div className="container">
          <div className="font-mono mb-6 text-[10px] uppercase tracking-[0.18em] text-ink/55">
            <Link href="/produkte" data-cursor="hover" className="hover:text-ink">
              Produkte
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/produkte?cat=${product.category}`}
              data-cursor="hover"
              className="hover:text-ink"
            >
              {category?.name ?? product.category}
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-square overflow-hidden bg-linen">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  data-cursor="view"
                />
                {product.bestseller && (
                  <span className="font-mono absolute left-4 top-4 bg-bronze px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-linen">
                    Bestseller
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>{product.brand}</Eyebrow>
              <h1 className="h-display mt-4 text-balance text-4xl md:text-5xl">{product.name}</h1>
              <p className="mt-4 leading-relaxed text-ink/70">{product.shortDesc}</p>

              <div className="my-8 border-y border-mist py-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="price text-4xl">{formatEUR(unit)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    {priceLabel(mode)}
                  </span>
                </div>
                {discount > 0 && (
                  <p className="font-mono mt-2 text-[10px] uppercase tracking-[0.18em] text-bronze">
                    − {Math.round(discount * 100)}% Staffelrabatt ab {qty} Stück
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center border border-mist">
                  <button
                    data-cursor="hover"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="grid h-12 w-12 place-items-center hover:bg-linen"
                    aria-label="Menge verringern"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="num font-display min-w-[3ch] px-5 text-center text-lg">{qty}</span>
                  <button
                    data-cursor="hover"
                    onClick={() => setQty(qty + 1)}
                    className="grid h-12 w-12 place-items-center hover:bg-linen"
                    aria-label="Menge erhöhen"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={handleAdd} variant="primary" size="lg" className="flex-1">
                  In den Warenkorb · <span className="price">{formatEUR(total)}</span>
                </Button>
              </div>

              <div className="mt-6 space-y-2.5 text-sm text-ink/70">
                <p className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-forest" />
                  Lieferung in 1–3 Werktagen ·{' '}
                  <span className="num">{product.stock}</span> auf Lager
                </p>
                <p className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-forest" />
                  2 Jahre Garantie · Original-Herstellerware
                </p>
              </div>

              <Tabs defaultValue="desc" className="mt-10">
                <TabsList>
                  <TabsTrigger value="desc">Beschreibung</TabsTrigger>
                  <TabsTrigger value="tech">Technik</TabsTrigger>
                  <TabsTrigger value="ship">Lieferung</TabsTrigger>
                </TabsList>
                <TabsContent value="desc">
                  <p className="leading-relaxed text-ink/80">{product.longDesc}</p>
                </TabsContent>
                <TabsContent value="tech">
                  <dl className="grid grid-cols-1 gap-px border border-mist bg-mist">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-2 gap-4 bg-paper px-4 py-3">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                          {k}
                        </dt>
                        <dd className="num font-mono text-right text-sm">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
                <TabsContent value="ship">
                  <ul className="space-y-3 text-sm text-ink/80">
                    <li>Versand DHL · 6,90 € (kostenfrei ab 250 €)</li>
                    <li>Direktfahrt im Großraum Wiesbaden · 19 €</li>
                    <li>Abholung in Wiesbaden · kostenfrei</li>
                    <li>Lagerware versendet binnen 24 Stunden.</li>
                    <li>2 Jahre Garantie, 14 Tage Widerruf.</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {cross.length > 0 && (
        <section className="container border-t border-mist py-20 md:py-28">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow number="++">Passend dazu</Eyebrow>
              <h2 className="h-display mt-4 text-3xl md:text-5xl">
                Ergänzen Sie Ihr <em className="italic">System</em>.
              </h2>
            </div>
            <Link
              href={`/produkte?cat=${product.category}`}
              data-cursor="hover"
              className="font-mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] hover:text-bronze"
            >
              Mehr ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {cross.map((c) => (
              <ProductCard key={c.slug} p={c} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Add-to-Cart auf Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-mist bg-paper/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="font-mono truncate text-[10px] uppercase tracking-[0.18em] text-ink/55">
            {product.brand}
          </p>
          <p className="price text-lg">{formatEUR(unit)}</p>
        </div>
        <Button onClick={handleAdd} variant="primary">
          Warenkorb
        </Button>
      </div>
    </>
  );
}
