'use client';

import { useEffect, useRef, useState } from 'react';
import { AudienceGate } from '@/components/AudienceGate';
import { Loader } from '@/components/Loader';
import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';

/**
 * Entscheidet, was beim Laden über der Seite liegt:
 *
 *   Erstbesuch          → Entry-Gate (Privatkunde / Handwerker), ersetzt den Loader
 *   Wiederkehrer        → Editorial-Loader, einmal pro Session
 *   Loader schon gehabt → nichts, Hero startet sofort
 *
 * Bis der persistierte Store hydriert ist, liegt eine neutrale Linen-Fläche
 * darüber. Sie sieht wie Gate und Loader aus, deshalb ist der Wechsel unsichtbar
 * — und es blitzt kein falsches Overlay auf.
 */
export function EntryExperience() {
  const audienceChosen = useCart((s) => s.audienceChosen);
  const finishEntry = useUI((s) => s.finishEntry);
  const [phase, setPhase] = useState<'hydrating' | 'gate' | 'loader' | 'done'>('hydrating');
  const decided = useRef(false);

  useEffect(() => {
    // Ein einziges Mal entscheiden: die Gate-Auswahl selbst ändert
    // `audienceChosen` und darf die Entscheidung nicht neu auslösen.
    if (decided.current) return;

    const decide = () => {
      if (decided.current) return;
      decided.current = true;

      if (!useCart.getState().audienceChosen) {
        setPhase('gate');
        return;
      }
      if (sessionStorage.getItem('gg_loader_done')) {
        finishEntry();
        setPhase('done');
        return;
      }
      setPhase('loader');
    };

    // Der Store hydriert bewusst nicht automatisch (siehe store/cart.ts) —
    // erst hier nach dem Mount, damit das statische HTML und der erste
    // Client-Render identisch sind.
    const unsub = useCart.persist.onFinishHydration(decide);
    void useCart.persist.rehydrate();
    // Fallback, falls die Hydration nie feuert (z.B. localStorage gesperrt).
    const t = setTimeout(decide, 600);
    return () => {
      unsub?.();
      clearTimeout(t);
    };
  }, [audienceChosen, finishEntry]);

  function markSessionSeen() {
    try {
      sessionStorage.setItem('gg_loader_done', '1');
    } catch {
      // Private-Mode ohne sessionStorage: dann eben einmal pro Seitenaufruf.
    }
    setPhase('done');
  }

  if (phase === 'hydrating') {
    return <div aria-hidden className="fixed inset-0 z-[95] bg-linen" />;
  }
  if (phase === 'gate') {
    return <AudienceGate onDone={markSessionSeen} />;
  }
  if (phase === 'loader') {
    return <Loader onDone={markSessionSeen} />;
  }
  return null;
}
