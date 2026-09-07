// Echte Preisbasis für den Kalkulator.
//
// Quelle: Preisliste von Green-Gard (Jan Leifermann) — "Hauswasser.docx",
// übermittelt am 07.09.2026. Sie nennt die Materialkosten je Wasserquelle in
// 50-m²-Schritten von 50 bis 1.500 m². Ausgewertet:
//   • Hauswasseranschluss = Grundkurve (siehe HAUSWASSER_TABLE unten)
//   • Zisterne = Hauswasser + 350 € (Technik-Zuschlag, an jeder Zeile konstant)
//   • Brunnen  = Hauswasser + 590 € (Technik-Zuschlag, an jeder Zeile konstant)
//
// Die Beträge sind NETTO (wie die bisherige Liste) — Privatkunden sehen sie über
// priceFor() mit MwSt., Profis netto. Zwischen zwei Stützpunkten interpolieren
// wir linear; über 1.500 m² schreiben wir mit der Steigung des letzten Segments
// fort. So ist jede Zahl im Kalkulator exakt auf Jans Liste zurückführbar.

import type { Quelle } from '@/lib/konfigurator';

/** Bis hierhin ist die Liste belegt — darüber schreiben wir linear fort. */
export const MATERIAL_TABLE_MAX_QM = 1500;

/**
 * Hauswasseranschluss — die Grundkurve aus Jans Liste (netto, in €).
 * Exakt wie geliefert; Grundlage für Anzeige, Interpolation und Nachprüfung.
 */
export const HAUSWASSER_TABLE: { qm: number; netto: number }[] = [
  { qm: 50, netto: 389 },
  { qm: 100, netto: 486 },
  { qm: 150, netto: 615 },
  { qm: 200, netto: 793 },
  { qm: 250, netto: 991 },
  { qm: 300, netto: 1189 },
  { qm: 350, netto: 1388 },
  { qm: 400, netto: 1586 },
  { qm: 450, netto: 1785 },
  { qm: 500, netto: 1983 },
  { qm: 550, netto: 2171 },
  { qm: 600, netto: 2360 },
  { qm: 650, netto: 2548 },
  { qm: 700, netto: 2736 },
  { qm: 750, netto: 2924 },
  { qm: 800, netto: 3113 },
  { qm: 850, netto: 3301 },
  { qm: 900, netto: 3489 },
  { qm: 950, netto: 3678 },
  { qm: 1000, netto: 3866 },
  { qm: 1050, netto: 3951 },
  { qm: 1100, netto: 4036 },
  { qm: 1150, netto: 4121 },
  { qm: 1200, netto: 4206 },
  { qm: 1250, netto: 4292 },
  { qm: 1300, netto: 4377 },
  { qm: 1350, netto: 4462 },
  { qm: 1400, netto: 4547 },
  { qm: 1450, netto: 4632 },
  { qm: 1500, netto: 4717 },
];

/** Rückwärtskompatibler Alias — der Kalkulator zeigt die Liste unverändert. */
export const MATERIAL_TABLE = HAUSWASSER_TABLE;

export interface QuelleZuschlag {
  netto: number;
  label: string;
  note?: string;
}

// Zisterne und Brunnen liegen in Jans Liste konstant über dem Hauswasserwert:
// Zisterne + 350 €, Brunnen + 590 € (an jeder der 30 Zeilen geprüft).
export const QUELLE_ZUSCHLAG: Record<Quelle, QuelleZuschlag | null> = {
  leitung: null,
  zisterne: {
    netto: 350,
    label: 'Zisternen-Technik',
    note: 'Pumpe, Filter und Steuerung — die Zisterne selbst ist nicht enthalten.',
  },
  brunnen: {
    netto: 590,
    label: 'Brunnen-Technik',
    note: 'Pumpe und Druckregelung — das Bohren des Brunnens ist nicht enthalten.',
  },
};

/**
 * Materialkosten netto für eine bewässerte Fläche — Hauswasseranschluss.
 * Lineare Interpolation zwischen den Stützpunkten der Liste; unter- und
 * oberhalb der Liste mit der Steigung des jeweils äußersten Segments.
 *
 * Hinweis: bezieht sich auf die bewässerte Fläche (rasen + beet), nicht auf die
 * gesamte Grundstücksfläche — so nennt es auch der Kalkulator.
 */
export function materialkostenNetto(qm: number): number {
  const flaeche = Math.max(0, qm);
  const t = HAUSWASSER_TABLE;
  const first = t[0];
  const last = t[t.length - 1];

  // Unterhalb des ersten Stützpunkts: Steigung des ersten Segments.
  if (flaeche <= first.qm) {
    const slope = (t[1].netto - first.netto) / (t[1].qm - first.qm);
    return Math.max(0, Math.round(first.netto + slope * (flaeche - first.qm)));
  }
  // Oberhalb des letzten Stützpunkts: linear fortschreiben.
  if (flaeche >= last.qm) {
    const prev = t[t.length - 2];
    const slope = (last.netto - prev.netto) / (last.qm - prev.qm);
    return Math.round(last.netto + slope * (flaeche - last.qm));
  }
  // Dazwischen: linear zwischen den beiden umschließenden Stützpunkten.
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i];
    const b = t[i + 1];
    if (flaeche >= a.qm && flaeche <= b.qm) {
      const slope = (b.netto - a.netto) / (b.qm - a.qm);
      return Math.round(a.netto + slope * (flaeche - a.qm));
    }
  }
  return last.netto; // nicht erreichbar
}

/**
 * Smart-Zuschlag (18.08.2026, Ricardo): Die WLAN-Steuerung muss teurer sein
 * als die manuelle — mindestens 50 €. Angesetzt sind 150 € netto: WLAN-
 * Steuergerät statt Basisgerät (~ +80 €) plus Funk-Regensensor (~ +70 €).
 * TODO: Betrag von Jan bestätigen lassen.
 */
export const SMART_ZUSCHLAG = {
  netto: 150,
  label: 'Smart-Steuerung (WLAN + Regensensor)',
} as const;

/**
 * Beet-Zuschlag (Meeting 18.08.2026, Vorgabe von Jan): Tropfbewässerung für
 * Beete kostet je nach Größe 300 – 500 € netto zusätzlich. Vorher ging die
 * Beetfläche nur in die m²-Pauschale ein — die Auswahl „Beetfläche“ bewegte
 * den Preis dadurch kaum (± 3 €), was unrealistisch ist: Tropfschlauch,
 * Druckminderer und Filter kommen als eigene Technik obendrauf.
 * Staffelgrenzen 20/50 m² laut Kundenvorgabe (Master-Prompt 18.08.).
 */
export function beetZuschlagNetto(beetQm: number): number {
  if (beetQm <= 0) return 0;
  if (beetQm <= 20) return 300;
  if (beetQm <= 50) return 400;
  return 500;
}

/** true, sobald wir über die belegte Liste hinaus fortschreiben. */
export function ueberListe(qm: number): boolean {
  return qm > MATERIAL_TABLE_MAX_QM;
}
