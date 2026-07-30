'use client';

import { useCart } from '@/store/cart';
import { AUDIENCES } from '@/lib/audience';

/** Öffnet das Entry-Fenster erneut — Zielgruppe und Ansicht wechseln. */
export function ViewSwitchLink() {
  const audience = useCart((s) => s.audience);
  const resetAudience = useCart((s) => s.resetAudience);

  return (
    <button
      type="button"
      data-cursor="hover"
      onClick={resetAudience}
      className="max-w-full text-left transition-colors hover:text-bronze"
    >
      Ansicht wechseln
      {/* Label unter den Text und umbrechbar: "GaLaBau / Architekt" sprengt
          sonst die schmale Footer-Spalte auf Tablet-Breite. */}
      <span className="font-mono mt-0.5 block break-words text-[10px] uppercase leading-snug tracking-[0.16em] text-linen/50">
        {AUDIENCES[audience].title}
      </span>
    </button>
  );
}
