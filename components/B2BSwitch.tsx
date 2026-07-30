'use client';

import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

/** Wechsel zwischen Privat- und Profi-Preisen — dieselbe Logik wie das Entry-Gate. */
export function B2BSwitch({ className }: { className?: string }) {
  const mode = useCart((s) => s.mode);
  const setMode = useCart((s) => s.setMode);

  return (
    <div
      className={cn(
        'inline-flex border border-mist font-mono text-[10px] uppercase tracking-[0.18em]',
        className
      )}
      role="tablist"
      aria-label="Preisansicht"
    >
      <button
        role="tab"
        data-cursor="hover"
        aria-selected={mode === 'privat'}
        onClick={() => setMode('privat')}
        className={cn(
          'px-3 py-2 transition-colors',
          mode === 'privat' ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
        )}
      >
        Privat
      </button>
      <button
        role="tab"
        data-cursor="hover"
        aria-selected={mode === 'profi'}
        onClick={() => setMode('profi')}
        className={cn(
          'px-3 py-2 transition-colors',
          mode === 'profi' ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
        )}
      >
        Profi
      </button>
    </div>
  );
}
