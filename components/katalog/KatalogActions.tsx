'use client';

import { Printer } from 'lucide-react';
import { KatalogSearch } from '@/components/katalog/KatalogSearch';

/**
 * Werkzeugleiste im Katalogkopf: Volltextsuche und Druckansicht.
 * Gedruckt wird die Seite selbst (Print-Styles in globals.css) — es gibt
 * bewusst kein PDF, das schon beim Erscheinen veraltet ist.
 */
export function KatalogActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <KatalogSearch />
      <button
        type="button"
        data-cursor="hover"
        onClick={() => window.print()}
        className="group inline-flex items-center gap-3 border border-linen/25 px-4 py-2.5 transition-colors hover:border-linen/60"
      >
        <Printer className="h-3.5 w-3.5 text-linen/60" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/60 group-hover:text-linen">
          Drucken
        </span>
      </button>
    </div>
  );
}
