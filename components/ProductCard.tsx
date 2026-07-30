'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';

export interface ProductCardData {
  slug: string;
  name: string;
  brand: string;
  shortDesc: string;
  netPrice: number;
  image: string;
  stock?: number;
  bestseller?: boolean;
}

export function ProductCard({ p }: { p: ProductCardData }) {
  const mode = useCart((s) => s.mode);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);

  return (
    <article className="group flex flex-col">
      <Link
        href={`/produkte/${p.slug}`}
        data-cursor="view"
        className="relative block aspect-square overflow-hidden bg-linen"
      >
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform [transition-duration:1200ms] group-hover:scale-[1.04]"
        />
        {p.bestseller && (
          <span className="font-mono absolute left-3 top-3 bg-bronze px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-linen">
            Bestseller
          </span>
        )}
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3 border-t border-mist pt-4">
        <div className="min-w-0">
          <p className="eyebrow text-ink/50">{p.brand}</p>
          <Link href={`/produkte/${p.slug}`} data-cursor="hover" className="block">
            <h3 className="font-display mt-1 text-lg leading-tight tracking-tight transition-colors hover:text-bronze">
              {p.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-ink/60">{p.shortDesc}</p>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <span className="price text-xl">{formatEUR(priceFor(p.netPrice, mode))}</span>
          <span className="font-mono ml-2 text-[10px] uppercase tracking-[0.18em] text-ink/50">
            {priceLabel(mode)}
          </span>
        </div>
        <button
          data-cursor="hover"
          onClick={() => {
            addItem({
              slug: p.slug,
              name: p.name,
              brand: p.brand,
              image: p.image,
              netPrice: p.netPrice,
            });
            openDrawer();
          }}
          className="font-mono inline-flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-bronze"
        >
          <Plus className="h-3.5 w-3.5" /> Warenkorb
        </button>
      </div>
    </article>
  );
}
