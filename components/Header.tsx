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
  { href: '/planung', label: 'Planung' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/beratung', label: 'Beratung' },
  { href: '/learning-center', label: 'Learning Center' },
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

  // Kein Login mehr (18.08.2026): Profi-Ansicht ergänzt nur den Konditionen-Link.
  const nav = isProfi(audience)
    ? [...BASE_NAV, { href: '/profi', label: 'Konditionen' }]
    : BASE_NAV;

  return (
    <header
      className={cn(
        // Kein backdrop-blur — auch nicht im Ruhezustand: der Weichzeichner
        // müsste bei jedem Scroll-Frame neu berechnet werden und kostete
        // messbar Bildrate (Premium-Pass 18.08.2026 vollständig entfernt).
        'sticky top-0 z-40 border-b border-mist transition-[background-color,box-shadow] duration-300',
        scrolled ? 'bg-paper shadow-[0_12px_32px_-24px_rgba(10,15,12,0.45)]' : 'bg-paper/95'
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" data-cursor="hover" aria-label="Green-Gard — zur Startseite">
          {/* TODO: echtes Logo-File vom Kunden ersetzen (public/logo-green-gard.svg). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-green-gard.svg" alt="Green-Gard" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-6">
                    {nav.map((n) => {
            const active = pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                data-cursor="hover"
                className={cn(
                  'font-mono whitespace-nowrap text-[11px] uppercase tracking-[0.12em] transition-colors 2xl:tracking-[0.16em]',
                  active ? 'text-ink' : 'text-ink/55 hover:text-ink'
                )}
              >
                {n.label}
              </Link>
            );
          })}
          {/* Der neue Shop wird parallel gebaut — bis zum Start bewusst ohne Link
              (Kundenwunsch 18.08.2026). */}
          <span
            title="Der neue Green-Gard Shop ist bald verfügbar"
            className="font-mono inline-flex cursor-default items-center gap-1.5 whitespace-nowrap text-[11px] uppercase tracking-[0.12em] text-ink/40 2xl:tracking-[0.16em]"
          >
            Shop
            <span className="border border-mist px-1.5 py-0.5 text-[9px] tracking-[0.12em] text-ink/45">
              Bald verfügbar
            </span>
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <B2BSwitch className="hidden md:inline-flex" />
          <button
            onClick={openDrawer}
            data-cursor="hover"
            className="relative inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors hover:text-bronze"
            aria-label="Gebuchte Schulungen öffnen"
          >
            <ShoppingBag className="h-4 w-4" />
                        <span className="hidden sm:inline">Schulungen</span>
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
        /* Sanft einblenden statt hart aufklappen (Premium-Pass 18.08.2026). */
        <div className="animate-[fade-up_0.35s_ease-out] border-t border-mist bg-paper xl:hidden">
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
            <span className="font-display flex items-center gap-3 border-b border-mist py-3 text-2xl tracking-tight text-ink/40">
              Shop
              <span className="font-mono border border-mist px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                Bald verfügbar
              </span>
            </span>
            {/* „Anmelden“ raus — es gibt keinen Login mehr (18.08.2026). */}
            {/* Kein zweiter Profi-Knopf hier: „Konditionen für Profis“ bzw. der
                Nav-Eintrag „Konditionen“ decken den Weg im Mobilmenü bereits ab. */}
          </div>
        </div>
      )}
    </header>
  );
}
