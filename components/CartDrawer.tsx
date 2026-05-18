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
          <p className="eyebrow">Mappe</p>
          <SheetTitle>
            {items.length === 0 ? 'Noch leer.' : `${items.length} ${items.length === 1 ? 'Position' : 'Positionen'}`}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-base text-ink/60 mb-8">
                Beginne mit der Kollektion oder lass uns einen Plan für deinen Garten erstellen.
              </p>
              <SheetClose asChild>
                <Button asChild variant="primary">
                  <Link href="/kollektion">Kollektion entdecken</Link>
                </Button>
              </SheetClose>
            </div>
          )}

          {items.map((l) => (
            <div key={l.slug} className="grid grid-cols-[80px_1fr_auto] gap-4 pb-6 border-b border-mist last:border-0">
              <div className="relative h-20 w-20 bg-linen overflow-hidden">
                <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="eyebrow text-ink/50">{l.brand}</p>
                <p className="font-display text-base leading-snug mt-1 line-clamp-2">{l.name}</p>
                <div className="mt-3 inline-flex items-center border border-mist">
                  <button data-cursor="hover" onClick={() => setQty(l.slug, l.qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-linen" aria-label="Weniger">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="num text-sm font-medium px-3 min-w-[2ch] text-center">{l.qty}</span>
                  <button data-cursor="hover" onClick={() => setQty(l.slug, l.qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-linen" aria-label="Mehr">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button data-cursor="hover" onClick={() => removeItem(l.slug)} aria-label="Entfernen" className="text-ink/40 hover:text-bronze">
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
          <div className="border-t border-mist px-7 py-6 space-y-5 bg-linen/40">
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
