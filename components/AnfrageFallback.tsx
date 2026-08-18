'use client';

import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Rettungsanker unter jedem Formular-Erfolg (18.08.2026).
 *
 * Beim Übergabe-Test blieb das Mailfenster auf einem Rechner ohne verknüpftes
 * Mailprogramm einfach aus — die Anfrage wäre verloren gewesen. Deshalb bietet
 * jeder Erfolgsbildschirm jetzt Wege an, die im Browser funktionieren:
 * Gmail- und Outlook-Compose im Web sowie „Text kopieren“ für alle anderen
 * Postfächer. Der mailto-Link bleibt als erster Weg erhalten.
 *
 * Die Komponente zerlegt die fertige mailto-URL aus lib/anfrage.ts — die
 * Formulare müssen nur die URL durchreichen, sonst nichts.
 */
function zerlege(mailtoUrl: string) {
  const [an, query = ''] = mailtoUrl.replace(/^mailto:/, '').split('?');
  const p = new URLSearchParams(query);
  return { an, betreff: p.get('subject') ?? '', text: p.get('body') ?? '' };
}

export function AnfrageFallback({
  mailtoUrl,
  dark = false,
  className,
}: {
  mailtoUrl: string;
  /** true auf dunklen Karten (Rechner-Empfehlung, Planungsergebnis). */
  dark?: boolean;
  className?: string;
}) {
  const [kopiert, setKopiert] = useState(false);
  if (!mailtoUrl) return null;

  const { an, betreff, text } = zerlege(mailtoUrl);
  const enc = encodeURIComponent;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(an)}&su=${enc(betreff)}&body=${enc(text)}`;
  const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(an)}&subject=${enc(betreff)}&body=${enc(text)}`;

  async function kopiere() {
    const inhalt = `An: ${an}\nBetreff: ${betreff}\n\n${text}`;
    try {
      await navigator.clipboard.writeText(inhalt);
    } catch {
      // Ältere Browser/HTTP: unsichtbares Textfeld als Umweg.
      const feld = document.createElement('textarea');
      feld.value = inhalt;
      document.body.appendChild(feld);
      feld.select();
      document.execCommand('copy');
      feld.remove();
    }
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2500);
  }

  const linkKlasse = cn(
    'inline-flex items-center gap-1.5 border-b pb-0.5 transition-colors',
    dark
      ? 'border-linen/30 text-linen/80 hover:border-linen hover:text-linen'
      : 'border-mist text-ink/70 hover:border-ink hover:text-ink'
  );

  return (
    <div className={cn('text-sm', dark ? 'text-linen/60' : 'text-ink/60', className)}>
      <p>Kein Mailfenster aufgegangen? Senden Sie die fertige Anfrage direkt im Browser:</p>
      <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={gmail} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={linkKlasse}>
          Mit Gmail senden
        </a>
        <a href={outlook} target="_blank" rel="noopener noreferrer" data-cursor="hover" className={linkKlasse}>
          Mit Outlook senden
        </a>
        <button type="button" onClick={kopiere} data-cursor="hover" className={linkKlasse}>
          {kopiert ? (
            <>
              <Check className="h-3.5 w-3.5" /> Kopiert — in Ihr Mailprogramm einfügen
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Text kopieren
            </>
          )}
        </button>
        <a href={mailtoUrl} data-cursor="hover" className={linkKlasse}>
          <Mail className="h-3.5 w-3.5" /> Mail-App erneut öffnen
        </a>
      </p>
    </div>
  );
}
