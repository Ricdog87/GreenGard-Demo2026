'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { lineTotal, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';

export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const closeDrawer = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const mode = useCart((s) => s.mode);

  const total = items.reduce((s, l) => s + lineTotal(l.netPrice, l.qty, mode), 0);

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : closeDrawer())}>
      <SheetContent>
        <SheetHeader>
          <p className="eyebrow">Warenkorb</p>
          <SheetTitle>
            {items.length === 0
              ? 'Noch leer.'
              : `${items.length} ${items.length === 1 ? 'Position' : 'Positionen'}`}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
          {items.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-8 text-base text-ink/60">
                Einzelprodukte legst du direkt in den Warenkorb. Für ein komplettes System
                starte mit der Planung — wir rechnen dir das passende Kit.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <SheetClose asChild>
                  <Button asChild variant="primary">
                    <Link href="/produkte">Produkte ansehen</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/planung">Planung beginnen →</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          )}

          {items.map((l) => (
            <div
              key={l.slug}
              className="grid grid-cols-[80px_1fr_auto] gap-4 border-b border-mist pb-6 last:border-0"
            >
              <div className="relative h-20 w-20 overflow-hidden bg-linen">
                <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-ink/50">{l.brand}</p>
                <p className="font-display mt-1 line-clamp-2 text-base leading-snug">{l.name}</p>
                <div className="mt-3 inline-flex items-center border border-mist">
                  <button
                    data-cursor="hover"
                    onClick={() => setQty(l.slug, l.qty - 1)}
                    className="grid h-8 w-8 place-items-center hover:bg-linen"
                    aria-label="Menge verringern"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="num min-w-[2ch] px-3 text-center text-sm font-medium">{l.qty}</span>
                  <button
                    data-cursor="hover"
                    onClick={() => setQty(l.slug, l.qty + 1)}
                    className="grid h-8 w-8 place-items-center hover:bg-linen"
                    aria-label="Menge erhöhen"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  data-cursor="hover"
                  onClick={() => removeItem(l.slug)}
                  aria-label="Position entfernen"
                  className="text-ink/40 hover:text-bronze"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <span className="price text-base font-medium">
                  {formatEUR(lineTotal(l.netPrice, l.qty, mode))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="space-y-5 border-t border-mist bg-linen/40 px-7 py-6">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow">Zwischensumme</span>
              <span className="price text-2xl">{formatEUR(total)}</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              {priceLabel(mode)} · Versand im Checkout
            </p>
            <SheetClose asChild>
              <Button asChild variant="primary" size="lg" className="w-full">
                <Link href="/checkout">Zur Kasse →</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
