'use client';

import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useCart } from '@/store/cart';
import { isProfi } from '@/lib/audience';
import { cn } from '@/lib/utils';

/**
 * Profi-Einstieg im Header.
 *
 * Bis 18.08.2026 stand hier ein Privat/Profi-Umschalter. Beschluss aus dem
 * Meeting vom 18.08.: Der Privat-Knopf ist raus (Privat ist die Standard-
 * ansicht), und der Profi-Knopf ist der Login-Einstieg — der Profibereich
 * erfordert eine Anmeldung. Der Klick aktiviert die Profi-Ansicht (Navigation
 * zieht mit) und führt zum Login bzw. ins Konto. Privat ist die Standard-
 * ansicht ohne eigenen Schalter — „Ansicht wechseln“ und das Entry-Fenster
 * sind komplett entfernt (18.08.2026).
 */
export function B2BSwitch({ className }: { className?: string }) {
  const audience = useCart((s) => s.audience);
  const chooseAudience = useCart((s) => s.chooseAudience);
  const eingeloggt = useCart((s) => s.eingeloggt);

  const profiAktiv = isProfi(audience);

  return (
    <div className={cn('inline-flex items-center', className)}>
      <Link
        href={eingeloggt ? '/konto' : '/login'}
        data-cursor="hover"
        onClick={() => {
          if (!profiAktiv) chooseAudience('profi');
        }}
        title={eingeloggt ? 'Zu Ihrem Konto' : 'Profi-Login — Konditionen für GaLaBau, Architekten und Händler'}
        className={cn(
          'font-mono inline-flex items-center gap-1.5 border px-3 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors',
          profiAktiv
            ? 'border-forest bg-forest text-linen hover:bg-forest/90'
            : 'border-mist text-ink/60 hover:bg-linen'
        )}
      >
        <LogIn className="h-3 w-3" /> Profi-Login
      </Link>
    </div>
  );
}
