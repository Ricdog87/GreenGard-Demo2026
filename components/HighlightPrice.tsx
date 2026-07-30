'use client';

import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';

/** Kleiner Client-Baustein, damit Highlights & Co. serverseitig bleiben können. */
export function HighlightPrice({ netPrice }: { netPrice: number }) {
  const mode = useCart((s) => s.mode);
  return (
    <p className="mt-2">
      <span className="font-mono mr-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/50">ab</span>
      <span className="price text-lg">{formatEUR(priceFor(netPrice, mode))}</span>
      <span className="font-mono ml-2 text-[10px] uppercase tracking-[0.18em] text-ink/50">
        {priceLabel(mode)}
      </span>
    </p>
  );
}
