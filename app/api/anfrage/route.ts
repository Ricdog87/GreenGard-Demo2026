// Serverseitiger Formular-Versand über Microsoft Graph (Office 365).
//
// Eingerichtet von der Green-Gard-IT (Gasser, 09/2026): eine App-Registrierung
// mit „Mail.Send" versendet aus der Shared Mailbox web@green-gard.de an
// info@green-gard.de. Alle Zugangsdaten kommen ausschließlich aus
// Umgebungsvariablen (in Vercel gesetzt) — niemals in den Code/ins Repo.
//
// Ist nichts konfiguriert, antwortet die Route mit 503 und die Formulare
// fallen clientseitig auf den bisherigen mailto-Weg zurück (lib/anfrage.ts).

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TENANT = process.env.GRAPH_TENANT_ID;
const CLIENT_ID = process.env.GRAPH_CLIENT_ID;
const CLIENT_SECRET = process.env.GRAPH_CLIENT_SECRET;
// Absender (Shared Mailbox) und Ziel sind keine Geheimnisse — sinnvolle
// Vorgaben, per Env überschreibbar.
const SENDER = process.env.GRAPH_SENDER ?? 'web@green-gard.de';
const RECIPIENT = process.env.GRAPH_RECIPIENT ?? 'info@green-gard.de';

// Graph nimmt einfache Anhänge bis ~4 MB pro Nachricht — wir bleiben darunter.
const MAX_ANHANG_BASE64 = 3_500_000;

interface Anhang {
  name: string;
  contentType: string;
  contentBase64: string;
}

async function graphToken(): Promise<string> {
  const body = new URLSearchParams({
    client_id: CLIENT_ID!,
    client_secret: CLIENT_SECRET!,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  });
  const res = await fetch(`https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    throw new Error(`Token-Anfrage fehlgeschlagen (${res.status})`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Kein access_token erhalten');
  return data.access_token;
}

/**
 * Temporäre Diagnose (?diagnose=1): zeigt, welche Anwendungsrechte Microsoft
 * der App im Token tatsächlich mitgibt. Damit lässt sich unterscheiden, ob
 * "Mail.Send" fehlt (Zustimmung/Berechtigung) oder ob trotz vorhandenem Recht
 * eine Exchange-Zugriffsrichtlinie das Postfach sperrt. Verschickt nichts und
 * gibt keine Zugangsdaten preis. Nach der Fehlersuche wieder entfernen.
 */
export async function GET(req: Request) {
  if (new URL(req.url).searchParams.get('diagnose') !== '1') {
    return NextResponse.json({ ok: false, error: 'method_not_allowed' }, { status: 405 });
  }
  if (!TENANT || !CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }
  try {
    const token = await graphToken();
    const teil = token.split('.')[1] ?? '';
    const payload = JSON.parse(
      Buffer.from(teil.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    ) as { roles?: string[] };
    const roles = Array.isArray(payload.roles) ? payload.roles : [];
    return NextResponse.json({
      ok: true,
      sender: SENDER,
      empfaenger: RECIPIENT,
      roles,
      mailSendVorhanden: roles.includes('Mail.Send'),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'token_failed', detail: err instanceof Error ? err.message : '' },
      { status: 502 }
    );
  }
}

export async function POST(req: Request) {
  if (!TENANT || !CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let payload: {
    betreff?: unknown;
    text?: unknown;
    replyTo?: unknown;
    anhaenge?: unknown;
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const betreff = String(payload.betreff ?? '').slice(0, 200) || 'Anfrage über die Website';
  const text = String(payload.text ?? '');
  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 });
  }

  const rohAnhaenge: Anhang[] = Array.isArray(payload.anhaenge)
    ? (payload.anhaenge as Anhang[]).slice(0, 10)
    : [];
  const gesamtBytes = rohAnhaenge.reduce((s, a) => s + (a?.contentBase64?.length ?? 0), 0);
  if (gesamtBytes > MAX_ANHANG_BASE64) {
    return NextResponse.json({ ok: false, error: 'attachments_too_large' }, { status: 413 });
  }

  const attachments = rohAnhaenge
    .filter((a) => a && a.name && a.contentBase64)
    .map((a) => ({
      '@odata.type': '#microsoft.graph.fileAttachment',
      name: String(a.name).slice(0, 200),
      contentType: String(a.contentType || 'application/octet-stream'),
      contentBytes: String(a.contentBase64),
    }));

  const message: Record<string, unknown> = {
    subject: betreff,
    body: { contentType: 'Text', content: text },
    toRecipients: [{ emailAddress: { address: RECIPIENT } }],
  };

  // Antwortadresse des Absenders, damit Green-Gard direkt zurückschreiben kann.
  const replyTo = String(payload.replyTo ?? '').trim();
  if (replyTo && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(replyTo)) {
    message.replyTo = [{ emailAddress: { address: replyTo } }];
  }
  if (attachments.length) message.attachments = attachments;

  try {
    const token = await graphToken();
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(SENDER)}/sendMail`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, saveToSentItems: true }),
      }
    );
    if (res.status === 202) {
      return NextResponse.json({ ok: true });
    }
    // Kurzer Fehlercode von Microsoft (enthält keine Zugangsdaten) hilft der
    // IT bei der Ursachensuche; der volle Text bleibt im Server-Log.
    const rohtext = await res.text().catch(() => '');
    console.error('Graph sendMail fehlgeschlagen', res.status, rohtext);
    let code = '';
    try {
      code = String((JSON.parse(rohtext) as { error?: { code?: string } })?.error?.code ?? '');
    } catch {
      /* keine JSON-Antwort */
    }
    return NextResponse.json(
      { ok: false, error: 'send_failed', status: res.status, code },
      { status: 502 }
    );
  } catch (err) {
    console.error('Graph-Versand-Fehler', err);
    return NextResponse.json(
      { ok: false, error: 'exception', detail: err instanceof Error ? err.message : '' },
      { status: 502 }
    );
  }
}
