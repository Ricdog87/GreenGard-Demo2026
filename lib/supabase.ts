// Supabase-Vorbereitung — noch KEINE aktive Anbindung.
//
// Die Site läuft vollständig ohne Keys: ist `isSupabaseConfigured` false, laufen
// alle Schreibpfade in den Mock-Zweig (console.log + Success-State im UI).
// So bleibt die Demo präsentierbar, während das Projekt aufgesetzt wird.
//
// TODO: Supabase-Projekt anlegen, env vars aus .env.example setzen,
// RLS-Policies aus supabase/schema.sql aktivieren, danach die Mock-Zweige
// in /profi, /beratung und /login gegen echte Inserts tauschen.

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Gibt den Browser-Client zurück — oder null, solange keine Keys gesetzt sind. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createBrowserClient(url!, anonKey!);
  }
  return client;
}

// ---------------------------------------------------------------------------
// Typisierte Payloads — spiegeln supabase/schema.sql
// ---------------------------------------------------------------------------

export type GewerbeArt = 'galabau' | 'installateur' | 'fachhandel' | 'sonstiges';

export interface LeadPayload {
  firma: string;
  name: string;
  email: string;
  telefon: string;
  gewerbe_art: GewerbeArt;
}

export interface SchulungBuchungPayload {
  schulung: string;
  termin: string;
  name: string;
  firma: string;
  email: string;
  teilnehmer: number;
}

async function insert(table: string, payload: object) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    // Mock-Pfad für die Demo — hier landet später der echte Insert.
    console.info(`[green-gard mock] ${table} <-`, payload);
    return { ok: true as const, mocked: true as const };
  }
  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    console.error(`[green-gard] Insert in ${table} fehlgeschlagen:`, error.message);
    return { ok: false as const, mocked: false as const, error: error.message };
  }
  return { ok: true as const, mocked: false as const };
}

/** Konditionskatalog-Anfrage aus /profi. */
export function submitLead(payload: LeadPayload) {
  // TODO: nach dem Insert Email-Trigger (Resend) mit Konditionskatalog-PDF auslösen.
  return insert('leads', payload);
}

/** Schulungs-Buchung aus /beratung. */
export function submitSchulungBuchung(payload: SchulungBuchungPayload) {
  // TODO: Stripe Payment Link zum gebuchten Termin per Mail versenden.
  return insert('schulung_buchungen', { ...payload, bezahlt: false });
}
