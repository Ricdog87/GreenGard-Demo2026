'use client';

import { useCart } from '@/store/cart';
import { priceFor } from '@/lib/pricing';
import { formatEURRound } from '@/lib/utils';

/** "ab"-Preis in der Vergleichstabelle — reagiert auf Privat/Profi. */
export function KitPriceCell({ netPrice }: { netPrice: number }) {
  const mode = useCart((s) => s.mode);
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">ab</span>
      <span className="price text-2xl">{formatEURRound(priceFor(netPrice, mode))}</span>
    </span>
  );
}
