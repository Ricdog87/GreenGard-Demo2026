'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { B2BSwitch } from '@/components/B2BSwitch';
import { useCart } from '@/store/cart';
import { isProfi } from '@/lib/audience';
import { cn } from '@/lib/utils';

// Für Privatkunden bleibt /profi aus der Hauptnavigation (Kundenwunsch).
// Wer sich im Entry-Fenster als GaLaBau oder Architekt eingeordnet hat, sieht
// den Konditionsbereich direkt in der Nav — das ist die "richtige Maske".
const BASE_NAV = [
  { href: '/produkte', label: 'Produkte' },
  { href: '/starter-kits', label: 'Starter Kits' },
  { href: '/planung', label: 'Planung' },
  { href: '/beratung', label: 'Beratung & Schulungen' },
  { href: '/warum-green-gard', label: 'Warum Green-Gard' },
];

export function Header() {
  const pathname = usePathname();
  const count = useCart((s) => s.items.reduce((sum, l) => sum + l.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const audience = useCart((s) => s.audience);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Dezente Elevation, sobald die Seite in Bewegung ist.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = isProfi(audience)
    ? [...BASE_NAV, { href: '/profi', label: 'Konditionen' }]
    : BASE_NAV;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-mist backdrop-blur-md transition-[background-color,box-shadow] duration-300',
        scrolled ? 'bg-paper/95 shadow-[0_12px_32px_-24px_rgba(10,15,12,0.45)]' : 'bg-paper/85'
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" data-cursor="hover" aria-label="Green-Gard — zur Startseite">
          {/* TODO: echtes Logo-File vom Kunden ersetzen (public/logo-green-gard.svg). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-green-gard.svg" alt="Green-Gard" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
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
            className="relative inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-bronze"
            aria-label="Warenkorb öffnen"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Warenkorb</span>
            {count > 0 && (
              <span className="num inline-grid h-5 min-w-[20px] place-items-center bg-forest px-1.5 text-[10px] text-linen">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            data-cursor="hover"
            className="-mr-2 grid h-10 w-10 place-items-center xl:hidden"
            aria-label="Menü"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-mist bg-paper xl:hidden">
          <div className="container flex flex-col gap-1 py-6">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className="font-display border-b border-mist py-3 text-2xl tracking-tight last:border-0"
              >
                {n.label}
              </Link>
            ))}
            {!isProfi(audience) && (
              <Link
                href="/profi"
                onClick={() => setMobileOpen(false)}
                className="font-mono mt-2 py-2 text-[11px] uppercase tracking-[0.18em] text-moss"
              >
                Konditionen für Profis →
              </Link>
            )}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="font-mono py-2 text-[11px] uppercase tracking-[0.18em] text-moss"
            >
              Anmelden →
            </Link>
            <div className="mt-4">
              <B2BSwitch />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
