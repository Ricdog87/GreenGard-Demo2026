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

// ── Server-Versand über Office 365 (Microsoft Graph, ab 09/2026) ────────────
//
// Sobald die Green-Gard-IT die Anbindung hinterlegt hat (Env-Variablen in
// Vercel), gehen Anfragen direkt an info@green-gard.de — ohne dass sich ein
// Mailfenster öffnet und ohne erneutes Anhängen der Pläne. Klappt der
// Server-Versand nicht (nicht konfiguriert, offline, Anhänge zu groß), fällt
// die Funktion automatisch auf den bewährten mailto-Weg zurück.

export interface AnfrageAnhang {
  name: string;
  contentType: string;
  /** Reiner Base64-Inhalt ohne data:-Präfix. */
  contentBase64: string;
}

export interface AnfrageErgebnis {
  /** true = serverseitig versendet, kein Mailfenster nötig. */
  ok: boolean;
  /** Immer gesetzt — für den Fallback-Block unter dem Erfolg. */
  mailtoUrl: string;
}

// Graph nimmt einfache Anhänge bis ~4 MB je Nachricht. Darüber bleibt es beim
// mailto-Weg, damit nichts verloren geht (Base64-Zeichen ≈ 1,33 × Rohbytes).
const ANHANG_LIMIT_BASE64 = 3_000_000;

/** Datei clientseitig zu einem Graph-tauglichen Base64-Anhang lesen. */
export function dateiZuAnhang(file: File): Promise<AnfrageAnhang> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      const contentBase64 = result.includes(',') ? result.slice(result.indexOf(',') + 1) : '';
      resolve({
        name: file.name,
        contentType: file.type || 'application/octet-stream',
        contentBase64,
      });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Anfrage senden. Versucht zuerst den Server-Versand (Office 365); klappt das
 * nicht, öffnet sie das Mailprogramm wie bisher. Der Rückgabewert sagt dem
 * Formular, welchen Erfolgstext es zeigen soll.
 */
export async function sendeAnfrage(
  betreff: string,
  zeilen: (string | false | undefined)[],
  options?: { replyTo?: string; anhaenge?: AnfrageAnhang[] }
): Promise<AnfrageErgebnis> {
  const mailtoUrl = baueAnfrageMailto(betreff, zeilen);
  const text = zeilen.filter((z): z is string => Boolean(z) || z === '').join('\n');
  const anhaenge = options?.anhaenge ?? [];
  const gesamt = anhaenge.reduce((s, a) => s + a.contentBase64.length, 0);

  if (gesamt <= ANHANG_LIMIT_BASE64) {
    try {
      const res = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betreff, text, replyTo: options?.replyTo, anhaenge }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
        if (data?.ok) return { ok: true, mailtoUrl };
      }
    } catch {
      // Netzwerk/Server nicht erreichbar — Fallback unten.
    }
  }

  // Fallback: bisheriges Verhalten (Mailprogramm mit fertiger Anfrage öffnen).
  window.location.href = mailtoUrl;
  return { ok: false, mailtoUrl };
}
