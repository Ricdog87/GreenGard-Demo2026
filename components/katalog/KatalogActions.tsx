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
        className="group inline-flex items-center gap-3 border border-ink/20 px-4 py-2.5 transition-colors hover:border-ink/50"
      >
        <Printer className="h-3.5 w-3.5 text-ink/50" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 group-hover:text-ink">
          Drucken
        </span>
      </button>
    </div>
  );
}
