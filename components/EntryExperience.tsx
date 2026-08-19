'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

/**
 * Entscheidet, was beim Laden über der Seite liegt:
 *
 *   erster Besuch      → Editorial-Loader, einmal pro Session
 *   Loader schon gehabt → nichts, Hero startet sofort
 *
 * Das frühere Entry-Fenster (Zielgruppe wählen) ist seit 18.08.2026 raus:
 * Die Standardansicht ist Privat, Profis kommen über den Profi-Login im
 * Header. Wer die Seite zum ersten Mal besucht, wird still auf „privat“
 * gesetzt — ohne Abfrage.
 *
 * Bis der persistierte Store hydriert ist, liegt eine neutrale Linen-Fläche
 * darüber, damit kein falscher Zustand aufblitzt.
 */
export function EntryExperience() {
  const finishEntry = useUI((s) => s.finishEntry);
  const [hydrated, setHydrated] = useState(false);
  const [loaderSeen, setLoaderSeen] = useState(false);

  useEffect(() => {
    const markHydrated = () => {
      // Ohne gespeicherte Wahl: still auf Privat setzen (Standardansicht).
      const store = useCart.getState();
      if (!store.audienceChosen) store.chooseAudience('privat');
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

  // Liegt nichts mehr über der Seite, darf der Hero-Reveal starten.
  const nothingOverlaying = hydrated && loaderSeen;
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

  if (!loaderSeen) {
    return <Loader onDone={markSessionSeen} />;
  }

  return null;
}
