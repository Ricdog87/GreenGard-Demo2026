'use client';

import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';

/** Preis einer Katalogzeile — folgt der gewählten Ansicht (netto/brutto). */
export function KatalogPrice({ netPrice, showLabel = false }: { netPrice: number; showLabel?: boolean }) {
  const mode = useCart((s) => s.mode);
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className="price text-base">{formatEUR(priceFor(netPrice, mode))}</span>
      {showLabel && (
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
          {priceLabel(mode)}
        </span>
      )}
    </span>
  );
}
