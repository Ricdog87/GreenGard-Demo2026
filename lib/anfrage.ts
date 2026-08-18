// Anfragen ohne Backend — der Go-Live-Weg (12.08.2026).
//
// Bis Office 365 bzw. Resend angebunden ist, darf kein Formular so tun, als
// hätte es gesendet. Stattdessen: strukturierte Mail im Mailprogramm des
// Besuchers vorbefüllen. Das kommt nachweislich an, braucht keinen Server
// und die Antwortadresse des Kunden stimmt automatisch.
//
// TODO: Sobald der Mailversand steht (UEBERGABE.md), diese Helfer durch
// echte Submits ersetzen — die Formulare selbst bleiben unverändert.

import { CONTACT } from '@/lib/contact';

/** Betreff + Zeilen → mailto an info@. Leere Zeilen gliedern die Mail. */
export function baueAnfrageMailto(betreff: string, zeilen: (string | false | undefined)[]): string {
  const body = zeilen.filter((z): z is string => Boolean(z) || z === '').join('\n');
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(betreff.slice(0, 150))}&body=${encodeURIComponent(body)}`;
}

/**
 * Mailfenster öffnen. Gibt die URL zurück, damit der Erfolgs-Zustand einen
 * Fallback-Link anbieten kann — nicht jedes Gerät hat ein Mailprogramm
 * konfiguriert, und der Klick darf trotzdem nicht ins Leere führen.
 */
export function oeffneAnfrage(betreff: string, zeilen: (string | false | undefined)[]): string {
  const url = baueAnfrageMailto(betreff, zeilen);
  window.location.href = url;
  return url;
}

export const ANFRAGE_HINWEIS =
  'Ihr Mailprogramm öffnet sich mit der fertigen Anfrage — bitte dort auf Senden tippen.';
