'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEUR } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface PaketCardData {
  slug: string;
  name: string;
  tagline: string;
  netPrice: number;
  highlight?: boolean;
  image: string;
  includes: string[];
  controller: string;
  ideal: string;
}

const ROMAN: Record<string, string> = { starter: 'I · Sereno', pro: 'II · Cortile', premium: 'III · Sovereign' };

export function PaketCard({ p }: { p: PaketCardData }) {
  const mode = useCart((s) => s.mode);
  const addItem = useCart((s) => s.addItem);
  const openDrawer = useCart((s) => s.openDrawer);
  const tag = ROMAN[p.slug] ?? p.name;

  return (
    <article
      id={p.slug}
      className={`group flex flex-col ${p.highlight ? 'bg-forest text-linen' : 'bg-paper text-ink border border-mist'} p-8 lg:p-10`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${p.highlight ? 'text-linen/60' : 'text-moss'}`}>
          {tag}
        </span>
        {p.highlight && <Badge variant="bronze">Beliebt</Badge>}
      </div>
      <h3 className="font-display text-3xl md:text-4xl tracking-tight mt-4">{p.name}</h3>
      <p className={`mt-2 italic ${p.highlight ? 'text-linen/70' : 'text-moss'}`}>{p.tagline}</p>

      <div className="relative aspect-[4/3] overflow-hidden mt-8 mb-6">
        <Image src={p.image} alt={p.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
      </div>

      <ul className={`space-y-3 text-sm flex-1 ${p.highlight ? 'text-linen/85' : 'text-ink/80'}`}>
        {p.includes.map((inc) => (
          <li key={inc} className="flex gap-3">
            <Check className={`h-4 w-4 mt-0.5 shrink-0 ${p.highlight ? 'text-bronze' : 'text-forest'}`} />
            <span>{inc}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-8 pt-6 border-t ${p.highlight ? 'border-linen/15' : 'border-mist'}`}>
        <div className="flex items-baseline justify-between">
          <span className="price text-4xl">{formatEUR(priceFor(p.netPrice, mode))}</span>
          <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${p.highlight ? 'text-linen/60' : 'text-ink/50'}`}>
            {priceLabel(mode)}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              addItem({ slug: `paket-${p.slug}`, name: p.name, brand: 'Green-Gard', image: p.image, netPrice: p.netPrice });
              openDrawer();
            }}
            variant={p.highlight ? 'accent' : 'primary'}
          >
            In Mappe legen
          </Button>
          <Button asChild variant={p.highlight ? 'ghost' : 'outline'} className={p.highlight ? 'text-linen hover:bg-linen/10' : ''}>
            <Link href="/planung">Planung beginnen →</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
