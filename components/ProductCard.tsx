'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';
import { Plus } from 'lucide-react';

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
      <Link href={`/kollektion/${p.slug}`} data-cursor="view" className="relative aspect-square overflow-hidden bg-linen block">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
        {p.bestseller && (
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] bg-bronze text-linen px-2 py-1">
            Bestseller
          </span>
        )}
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3 border-t border-mist pt-4">
        <div className="min-w-0">
          <p className="eyebrow text-ink/50">{p.brand}</p>
          <Link href={`/kollektion/${p.slug}`} data-cursor="hover" className="block">
            <h3 className="font-display text-lg leading-tight tracking-tight mt-1 hover:text-bronze transition-colors">
              {p.name}
            </h3>
          </Link>
          <p className="text-sm text-ink/60 mt-1 line-clamp-2">{p.shortDesc}</p>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <span className="price text-xl">{formatEUR(priceFor(p.netPrice, mode))}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 ml-2">
            {priceLabel(mode)}
          </span>
        </div>
        <button
          data-cursor="hover"
          onClick={() => {
            addItem({ slug: p.slug, name: p.name, brand: p.brand, image: p.image, netPrice: p.netPrice });
            openDrawer();
          }}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] hover:text-bronze transition-colors"
          aria-label="In Mappe legen"
        >
          <Plus className="h-3.5 w-3.5" /> In Mappe
        </button>
      </div>
    </article>
  );
}
