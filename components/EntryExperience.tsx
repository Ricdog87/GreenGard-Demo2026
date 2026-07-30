'use client';

import { useEffect, useRef, useState } from 'react';
import { AudienceGate } from '@/components/AudienceGate';
import { Loader } from '@/components/Loader';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

/**
 * Entscheidet, was beim Laden über der Seite liegt:
 *
 *   ohne Auswahl        → Entry-Fenster (Zielgruppe + Login), ersetzt den Loader
 *   mit Auswahl         → Editorial-Loader, einmal pro Session
 *   Loader schon gehabt → nichts, Hero startet sofort
 *
 * Bis der persistierte Store hydriert ist, liegt eine neutrale Linen-Fläche
 * darüber. Sie sieht wie Fenster und Loader aus, deshalb ist der Wechsel
 * unsichtbar — und es blitzt kein falsches Overlay auf.
 *
 * Setzt der Nutzer die Ansicht später zurück ("wechseln" in Bar oder Footer),
 * erscheint das Entry-Fenster erneut.
 */
export function EntryExperience() {
  const audienceChosen = useCart((s) => s.audienceChosen);
  const finishEntry = useUI((s) => s.finishEntry);
  const [hydrated, setHydrated] = useState(false);
  const [loaderSeen, setLoaderSeen] = useState(false);
  /** true, solange dieselbe Gate-Runde noch nachwirkt (Exit-Animation). */
  const gateSettled = useRef(false);

  useEffect(() => {
    const markHydrated = () => {
      setHydrated(true);
      try {
        if (sessionStorage.getItem('gg_loader_done')) setLoaderSeen(true);
      } catch {
        // Private-Mode ohne sessionStorage: Loader läuft dann pro Seitenaufruf.
      }
    };

    // Der Store hydriert bewusst nicht automatisch (siehe store/cart.ts) —
    // erst hier nach dem Mount, damit statisches HTML und erster Client-Render
    // identisch sind.
    const unsub = useCart.persist.onFinishHydration(markHydrated);
    void useCart.persist.rehydrate();
    // Fallback, falls die Hydration nie feuert (z.B. localStorage gesperrt).
    const t = setTimeout(markHydrated, 600);
    return () => {
      unsub?.();
      clearTimeout(t);
    };
  }, []);

  // Auswahl zurückgesetzt → das Fenster darf erneut erscheinen.
  useEffect(() => {
    if (!audienceChosen) gateSettled.current = false;
  }, [audienceChosen]);

  // Liegt nichts mehr über der Seite, darf der Hero-Reveal starten.
  const nothingOverlaying = hydrated && (audienceChosen || gateSettled.current) && loaderSeen;
  useEffect(() => {
    if (nothingOverlaying) finishEntry();
  }, [nothingOverlaying, finishEntry]);

  function markSessionSeen() {
    try {
      sessionStorage.setItem('gg_loader_done', '1');
    } catch {
      /* siehe oben */
    }
    setLoaderSeen(true);
  }

  if (!hydrated) {
    return <div aria-hidden className="fixed inset-0 z-[95] bg-linen" />;
  }

  if (!audienceChosen && !gateSettled.current) {
    return (
      <AudienceGate
        onDone={() => {
          gateSettled.current = true;
          markSessionSeen();
        }}
      />
    );
  }

  if (!loaderSeen && !gateSettled.current) {
    return <Loader onDone={markSessionSeen} />;
  }

  return null;
}
