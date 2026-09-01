'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useCart } from '@/store/cart';
import { isProfi } from '@/lib/audience';
import { cn } from '@/lib/utils';

/**
 * Profi-Einstieg im Header.
 *
 * Umbau 18.08.2026 (Kundenwunsch): Es gibt KEINE Anmeldung/Registrierung
 * mehr. Profis stellen eine Konditions-Anfrage über das Formular auf /profi
 * (Kontaktdaten Pflicht), und Green-Gard sendet das Konditionsblatt
 * persönlich zu. Der Knopf führt deshalb direkt zum Anfrage-Formular.
 */
export function B2BSwitch({ className }: { className?: string }) {
  const audience = useCart((s) => s.audience);
  const chooseAudience = useCart((s) => s.chooseAudience);

  const profiAktiv = isProfi(audience);

  return (
    <div className={cn('inline-flex items-center', className)}>
      <Link
        href="/profi"
        data-cursor="hover"
        onClick={() => {
          if (!profiAktiv) chooseAudience('profi');
        }}
        title="Konditionen für GaLaBau, Architekten und Händler anfragen"
        className={cn(
          'font-mono inline-flex items-center gap-1.5 border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors',
          profiAktiv
            ? 'border-forest bg-forest text-linen hover:bg-forest/90'
            : 'border-mist text-ink/60 hover:bg-linen'
        )}
      >
        Profi-Konditionen <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
