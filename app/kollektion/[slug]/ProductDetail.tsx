'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Truck, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eyebrow } from '@/components/Eyebrow';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel, volumeDiscount } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';

interface Product {
  slug: string;
  name: string;
  brand: string;
  shortDesc: string;
  longDesc: string;
  netPrice: number;
  image: string;
  stock: number;
  specs: Record<string, string>;
  bestseller?: boolean;
  category: string;
}

export function ProductDetail({ product, cross }: { product: Product; cross: any[] }) {
  const mode = useCart((s) => s.mode);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);
  const [qty, setQty] = useState(1);

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
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 mb-6">
            <Link href="/kollektion" data-cursor="hover" className="hover:text-ink">Kollektion</Link>
            <span className="mx-2">/</span>
            <Link href={`/kollektion?cat=${product.category}`} data-cursor="hover" className="hover:text-ink">
              {product.category}
            </Link>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="relative aspect-square bg-linen overflow-hidden">
                <Image src={product.image} alt={product.name} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" data-cursor="view" />
                {product.bestseller && (
                  <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] bg-bronze text-linen px-3 py-1.5">
                    Bestseller
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative aspect-square bg-linen overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                    <Image src={product.image} alt="" fill sizes="20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <Eyebrow>{product.brand}</Eyebrow>
              <h1 className="h-display text-4xl md:text-5xl mt-4 text-balance">{product.name}</h1>
              <p className="text-ink/70 mt-4 leading-relaxed">{product.shortDesc}</p>

              <div className="border-y border-mist my-8 py-6">
                <div className="flex items-baseline justify-between">
                  <span className="price text-4xl">{formatEUR(unit)}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{priceLabel(mode)}</span>
                </div>
                {discount > 0 && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bronze mt-2">
                    – {Math.round(discount * 100)}% Handwerk-Rabatt ab {qty} Stk.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="inline-flex items-center border border-mist">
                  <button data-cursor="hover" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center hover:bg-linen" aria-label="Weniger">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="num font-display text-lg px-5 min-w-[3ch] text-center">{qty}</span>
                  <button data-cursor="hover" onClick={() => setQty(qty + 1)} className="grid h-12 w-12 place-items-center hover:bg-linen" aria-label="Mehr">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button onClick={handleAdd} variant="primary" size="lg" className="flex-1">
                  In Mappe legen · <span className="price">{formatEUR(total)}</span>
                </Button>
              </div>

              <div className="mt-6 space-y-2.5 text-sm text-ink/70">
                <p className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-forest" />
                  Lieferung in 1–3 Werktagen · {product.stock} auf Lager
                </p>
                <p className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-forest" />
                  2 Jahre Garantie · Original-Hersteller-Ware
                </p>
              </div>

              <Tabs defaultValue="desc" className="mt-10">
                <TabsList>
                  <TabsTrigger value="desc">Beschreibung</TabsTrigger>
                  <TabsTrigger value="tech">Technik</TabsTrigger>
                  <TabsTrigger value="ship">Lieferung</TabsTrigger>
                </TabsList>
                <TabsContent value="desc">
                  <p className="text-ink/80 leading-relaxed">{product.longDesc}</p>
                </TabsContent>
                <TabsContent value="tech">
                  <dl className="grid grid-cols-1 gap-px bg-mist border border-mist">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-2 gap-4 bg-paper px-4 py-3">
                        <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">{k}</dt>
                        <dd className="num font-mono text-sm text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </TabsContent>
                <TabsContent value="ship">
                  <ul className="space-y-3 text-ink/80 text-sm">
                    <li>Versand DHL · 6,90 € (kostenfrei ab 250 €)</li>
                    <li>Direktfahrt im Großraum Wiesbaden · 19 €</li>
                    <li>Abholung am Studio Wiesbaden · kostenfrei</li>
                    <li>Lagerware versendet binnen 24h.</li>
                    <li>2 Jahre Garantie, 14 Tage Widerruf.</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {cross.length > 0 && (
        <section className="container py-20 md:py-28 border-t border-mist">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow number="++">Komplettiere dein Setup</Eyebrow>
              <h2 className="h-display text-3xl md:text-5xl mt-4">Passt <em className="italic">dazu</em>.</h2>
            </div>
            <Link href={`/kollektion?cat=${product.category}`} data-cursor="hover" className="font-mono text-[11px] uppercase tracking-[0.18em] hover:text-bronze inline-flex items-center gap-2">
              Mehr ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {cross.map((c) => <ProductCard key={c.slug} p={c} />)}
          </div>
        </section>
      )}

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-mist p-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55">{product.brand}</p>
          <p className="price text-lg">{formatEUR(unit)}</p>
        </div>
        <Button onClick={handleAdd} variant="primary">In Mappe</Button>
      </div>
    </>
  );
}
