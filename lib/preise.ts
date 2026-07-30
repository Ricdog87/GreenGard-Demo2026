// Echte Preisbasis für den Kalkulator.
//
// Quelle: Preisliste von Jan Leifermann (Mail vom 30.07.2026, "Gartenfläche.docx").
//   Gartenfläche → Materialkosten (ca. netto), Hauswasseranschluss:
//   100 m² → 650 €, 200 m² → 900 € … 1.500 m² → 4.150 €
//   Zisterne: Preis oben + 1.000 € (nur Technik, ohne Zisterne)
//   Brunnen:  Preis oben +   900 € (ohne Brunnenbohrung)
//
// Die 15 Stützpunkte der Liste liegen exakt auf 400 € + 2,50 €/m². Deshalb
// rechnen wir mit der Formel und zeigen die Liste unverändert daneben — so
// bleibt jede Zahl im Kalkulator auf Jans Liste zurückführbar.

import type { Quelle } from '@/lib/konfigurator';

/** Grundbetrag der Liste (Steuerung, Ventile, Kleinteile). */
export const MATERIAL_BASE = 400;
/** Flächenanteil der Liste. */
export const MATERIAL_PER_QM = 2.5;
/** Bis hierhin ist die Liste belegt — darüber schreiben wir linear fort. */
export const MATERIAL_TABLE_MAX_QM = 1500;

/** Die Liste, wie geliefert — Grundlage für die Anzeige und zum Nachprüfen. */
export const MATERIAL_TABLE: { qm: number; netto: number }[] = Array.from(
  { length: 15 },
  (_, i) => {
    const qm = (i + 1) * 100;
    return { qm, netto: MATERIAL_BASE + MATERIAL_PER_QM * qm };
  }
);

export interface QuelleZuschlag {
  netto: number;
  label: string;
  note?: string;
}

export const QUELLE_ZUSCHLAG: Record<Quelle, QuelleZuschlag | null> = {
  leitung: null,
  zisterne: {
    netto: 1000,
    label: 'Zisternen-Technik',
    note: 'Pumpe, Filter und Steuerung — die Zisterne selbst ist nicht enthalten.',
  },
  brunnen: {
    netto: 900,
    label: 'Brunnen-Technik',
    note: 'Pumpe und Druckregelung — das Bohren des Brunnens ist nicht enthalten.',
  },
};

/**
 * Materialkosten netto für eine bewässerte Fläche.
 * TODO: mit Jan bestätigen, ob sich die Liste auf die Grundstücks- oder auf die
 * bewässerte Fläche bezieht — wir rechnen mit der bewässerten Fläche.
 */
export function materialkostenNetto(qm: number): number {
  const flaeche = Math.max(0, qm);
  return MATERIAL_BASE + MATERIAL_PER_QM * flaeche;
}

/** true, sobald wir über die belegte Liste hinaus fortschreiben. */
export function ueberListe(qm: number): boolean {
  return qm > MATERIAL_TABLE_MAX_QM;
}
