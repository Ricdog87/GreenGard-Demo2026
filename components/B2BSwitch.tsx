'use client';

import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

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
        aria-selected={mode === 'b2c'}
        onClick={() => setMode('b2c')}
        className={cn(
          'px-3 py-2 transition-colors',
          mode === 'b2c' ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
        )}
      >
        Privat
      </button>
      <button
        role="tab"
        data-cursor="hover"
        aria-selected={mode === 'b2b'}
        onClick={() => setMode('b2b')}
        className={cn(
          'px-3 py-2 transition-colors',
          mode === 'b2b' ? 'bg-forest text-linen' : 'text-ink/60 hover:bg-linen'
        )}
      >
        Handwerk
      </button>
    </div>
  );
}
