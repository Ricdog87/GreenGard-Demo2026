'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { B2BSwitch } from '@/components/B2BSwitch';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/kollektion', label: 'Kollektion' },
  { href: '/systeme', label: 'Systeme' },
  { href: '/planung', label: 'Planung' },
  { href: '/atelier', label: 'Atelier' },
  { href: '/handwerk', label: 'Handwerk' },
  { href: '/manifest', label: 'Manifest' },
];

export function Header() {
  const pathname = usePathname();
  const count = useCart((s) => s.items.reduce((sum, l) => sum + l.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-paper/85 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" data-cursor="hover" className="flex items-center gap-2">
          <span className="font-display text-xl tracking-tight">GREEN-GARD</span>
          <span className="hidden sm:inline-block eyebrow text-moss/60">· Wiesbaden</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => {
            const active = pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                data-cursor="hover"
                className={cn(
                  'font-mono text-[11px] uppercase tracking-[0.18em] transition-colors',
                  active ? 'text-ink' : 'text-ink/55 hover:text-ink'
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <B2BSwitch className="hidden md:inline-flex" />
          <button
            onClick={openDrawer}
            data-cursor="hover"
            className="relative inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] hover:text-bronze transition-colors"
            aria-label="Mappe öffnen"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Mappe</span>
            {count > 0 && (
              <span className="num inline-grid h-5 min-w-[20px] place-items-center bg-forest px-1.5 text-[10px] text-linen">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor="hover"
            className="lg:hidden grid h-10 w-10 place-items-center -mr-2"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-mist bg-paper">
          <div className="container py-6 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 font-display text-2xl tracking-tight border-b border-mist last:border-0"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-4">
              <B2BSwitch />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
