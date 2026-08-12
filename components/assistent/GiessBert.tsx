'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Panel samt Wissen (~57 KB FAQ) lädt erst beim ersten Öffnen — der Knopf
// selbst kostet die Seite fast nichts.
const Panel = dynamic(() => import('./GiessBertPanel'), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">
        einen Moment …
      </span>
    </div>
  ),
});

/**
 * Gießbert — der Sofort-Assistent.
 *
 * Das Maskottchen führt Green Gard seit Jahren auf der eigenen Seite; hier
 * bekommt es eine Aufgabe: Fragen beantworten, bevor jemand zum Hörer greift.
 * Öffnet als Panel unten rechts, auf Mobil als volle Fläche. Esc schließt,
 * der Fokus kehrt zum Knopf zurück.
 */
export function GiessBert() {
  const [offen, setOffen] = useState(false);
  const [geladen, setGeladen] = useState(false);
  const knopfRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const schliessen = useCallback(() => setOffen(false), []);

  useEffect(() => {
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') schliessen();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // Fokus zurück auf den Knopf — erst nach dem Re-Render, weil der Knopf
      // bei offenem Panel display:none hat und so keinen Fokus annehmen kann.
      requestAnimationFrame(() => knopfRef.current?.focus());
    };
  }, [offen, schliessen]);

  return (
    <>
      <button
        ref={knopfRef}
        type="button"
        data-cursor="hover"
        onClick={() => {
          setGeladen(true);
          setOffen((o) => !o);
        }}
        aria-expanded={offen}
        aria-haspopup="dialog"
        aria-label={offen ? 'Gießbert schließen' : 'Gießbert fragen — Antworten in Sekunden'}
        className={cn(
          'fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 border border-forest bg-forest py-2 pl-2 pr-4 text-linen shadow-lg transition-transform hover:-translate-y-0.5',
          offen && 'hidden'
        )}
      >
        <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-paper">
          <Image src="/img/giessbert.png" alt="" width={30} height={30} className="translate-y-0.5" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em]">Fragen?</span>
      </button>

      {offen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-label="Gießbert — Sofort-Antwort"
          className={cn(
            'fixed z-[75] flex flex-col overflow-hidden border border-mist bg-paper shadow-2xl',
            // Mobil volle Fläche, Desktop als Karte unten rechts
            'inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[600px] sm:max-h-[calc(100vh-40px)] sm:w-[420px]'
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-mist bg-forest px-5 py-3.5 text-linen">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-paper">
                <Image src="/img/giessbert.png" alt="" width={30} height={30} className="translate-y-0.5" />
              </span>
              <div>
                <p className="font-display text-base leading-tight tracking-tight">Gießbert</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-linen/60">
                  Antworten in Sekunden · rund um die Uhr
                </p>
              </div>
            </div>
            <button
              type="button"
              data-cursor="hover"
              onClick={schliessen}
              aria-label="Schließen"
              className="grid h-9 w-9 place-items-center border border-linen/25 transition-colors hover:bg-linen/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {geladen && <Panel />}
        </div>
      )}
    </>
  );
}
