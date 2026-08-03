'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useCart } from '@/store/cart';
import { isProfi, AUDIENCES } from '@/lib/audience';
import { cn } from '@/lib/utils';

/**
 * Wechsel zwischen Privat- und Profi-Ansicht.
 *
 * Der Schalter setzt die ZIELGRUPPE, nicht nur die Preisansicht. Vorher änderte
 * er ausschließlich netto/brutto — auf Seiten ohne sichtbare Preise passierte
 * dann scheinbar nichts, und die Schnelleinstiegs-Leiste zeigte weiter die alte
 * Zielgruppe. Jetzt ziehen Navigation, Schnelleinstiege und Preise gemeinsam mit,
 * und eine kurze Rückmeldung bestätigt den Wechsel.
 *
 * Händler zählen zur Profi-Seite: wer als Händler unterwegs ist, bleibt es beim
 * Klick auf "Profi" — der Schalter stuft ihn nicht zum GaLaBauer herunter.
 */
export function B2BSwitch({ className }: { className?: string }) {
  const audience = useCart((s) => s.audience);
  const chooseAudience = useCart((s) => s.chooseAudience);
  const notify = useCart((s) => s.notify);
  const eingeloggt = useCart((s) => s.eingeloggt);

  const profiAktiv = isProfi(audience);

  function wechsle(zuProfi: boolean) {
    if (zuProfi === profiAktiv) return;
    const ziel = zuProfi ? 'profi' : 'privat';
    chooseAudience(ziel);
    notify(
      zuProfi
        ? 'Profi-Ansicht aktiv — Nettopreise und Konditionen'
        : 'Privat-Ansicht aktiv — Bruttopreise inkl. MwSt.'
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div
        className="inline-flex border border-mist font-mono text-[10px] uppercase tracking-[0.18em]"
        role="tablist"
        aria-label="Ansicht wechseln"
      >
        <button
          role="tab"
          type="button"
          data-cursor="hover"
          aria-selected={!profiAktiv}
          onClick={() => wechsle(false)}
          className={cn(
            'px-3 py-2 transition-colors',
            !profiAktiv ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
          )}
        >
          Privat
        </button>
        <button
          role="tab"
          type="button"
          data-cursor="hover"
          aria-selected={profiAktiv}
          onClick={() => wechsle(true)}
          className={cn(
            'px-3 py-2 transition-colors',
            profiAktiv ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
          )}
          title={profiAktiv ? AUDIENCES[audience].title : 'Zur Profi-Ansicht wechseln'}
        >
          Profi
        </button>
      </div>

      {/* In der Profi-Ansicht ohne Anmeldung führt der kürzeste Weg ins Konto. */}
      {profiAktiv && !eingeloggt && (
        <Link
          href="/login"
          data-cursor="hover"
          className="font-mono inline-flex items-center gap-1.5 whitespace-nowrap border-b border-bronze/50 pb-0.5 text-[10px] uppercase tracking-[0.16em] text-bronze transition-colors hover:border-bronze hover:text-ink"
        >
          <LogIn className="h-3 w-3" /> Anmelden
        </Link>
      )}
    </div>
  );
}
