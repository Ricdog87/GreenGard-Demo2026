'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, LayoutGrid, LogIn, Package, Tag, Zap } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { KontoUebersicht } from '@/components/konto/KontoUebersicht';
import { KontoBestellungen } from '@/components/konto/KontoBestellungen';
import { KontoPreise } from '@/components/konto/KontoPreise';
import { KontoSchnellbestellung } from '@/components/konto/KontoSchnellbestellung';
import { KontoProjekte } from '@/components/konto/KontoProjekte';
import { useCart } from '@/store/cart';
import { DEMO_KONTO } from '@/lib/konto-daten';
import { cn } from '@/lib/utils';

const BEREICHE = [
  { id: 'uebersicht', label: 'Übersicht', icon: LayoutGrid },
  { id: 'schnellbestellung', label: 'Schnellbestellung', icon: Zap },
  { id: 'bestellungen', label: 'Bestellungen', icon: Package },
  { id: 'preise', label: 'Ihre EK-Preise', icon: Tag },
  { id: 'projekte', label: 'Projekte & Planungen', icon: BookOpen },
] as const;

type BereichId = (typeof BEREICHE)[number]['id'];

/**
 * Profi-Dashboard.
 *
 * Der Zugang wird hier im Client geprüft, weil der Anmeldestatus (noch) im
 * persistierten Store liegt. Sobald Supabase Auth verbunden ist, gehört diese
 * Prüfung in die Middleware — bis dahin ist sie eine Komfort-, keine
 * Sicherheitsgrenze. Deshalb liegen hier auch nur Demodaten.
 * TODO: Middleware mit Supabase-Session, sobald Auth steht.
 */
export function KontoDashboard() {
  const eingeloggt = useCart((s) => s.eingeloggt);
  const abmelden = useCart((s) => s.abmelden);
  const [bereit, setBereit] = useState(false);
  const [bereich, setBereich] = useState<BereichId>('uebersicht');

  // Erst nach der Store-Hydration entscheiden, sonst blitzt die Anmeldeaufforderung
  // bei angemeldeten Nutzern kurz auf.
  useEffect(() => {
    const fertig = () => setBereit(true);
    const unsub = useCart.persist.onFinishHydration(fertig);
    void useCart.persist.rehydrate();
    const t = setTimeout(fertig, 600);
    return () => {
      unsub?.();
      clearTimeout(t);
    };
  }, []);

  if (!bereit) {
    return (
      <div className="container py-32">
        <div className="h-8 w-48 animate-pulse bg-linen" />
        <div className="mt-6 h-24 w-full max-w-2xl animate-pulse bg-linen" />
      </div>
    );
  }

  if (!eingeloggt) {
    return (
      <div className="container max-w-xl py-24 md:py-40">
        <Eyebrow number="K">Profi-Bereich</Eyebrow>
        <h1 className="h-display mt-6 text-5xl md:text-6xl">
          Bitte <em className="italic">anmelden</em>.
        </h1>
        <p className="mt-6 text-ink/70">
          Einkaufspreise, Bestellungen und Projekte sehen Sie nach der Anmeldung. Noch
          keinen Zugang? Wir richten ihn nach kurzer Prüfung ein.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/login">
              <LogIn className="h-4 w-4" /> Zur Anmeldung
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/profi">Zugang beantragen</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16">
      <div className="container">
        <div className="flex flex-col gap-4 border-b border-mist pb-8 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <Eyebrow number="K">Mein Konto</Eyebrow>
            <h1 className="h-display mt-4 text-4xl tracking-tight md:text-6xl">
              {DEMO_KONTO.firma}
            </h1>
            <p className="num font-mono mt-2 text-[11px] uppercase tracking-[0.16em] text-ink/55">
              Kundennummer {DEMO_KONTO.kundennummer} · {DEMO_KONTO.ansprechpartner}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={abmelden}>
            Abmelden
          </Button>
        </div>

        {/* Bereichswahl */}
        <nav aria-label="Kontobereiche" className="mt-8 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {BEREICHE.map((b) => (
              <button
                key={b.id}
                type="button"
                data-cursor="hover"
                aria-current={bereich === b.id ? 'page' : undefined}
                onClick={() => setBereich(b.id)}
                className={cn(
                  'inline-flex items-center gap-2 whitespace-nowrap border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors',
                  bereich === b.id
                    ? 'border-forest bg-forest text-linen'
                    : 'border-mist text-ink/60 hover:border-ink/40 hover:text-ink'
                )}
              >
                <b.icon className="h-3.5 w-3.5" />
                {b.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mt-10">
          {bereich === 'uebersicht' && <KontoUebersicht />}
          {bereich === 'schnellbestellung' && <KontoSchnellbestellung />}
          {bereich === 'bestellungen' && <KontoBestellungen />}
          {bereich === 'preise' && <KontoPreise />}
          {bereich === 'projekte' && <KontoProjekte />}
        </div>

        <p className="font-mono mt-16 border-t border-mist pt-6 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/45">
          Demo-Konto mit Beispieldaten · nach Anbindung von Supabase erscheinen hier Ihre
          echten Bestellungen, Konditionen und Projekte
        </p>
      </div>
    </div>
  );
}
