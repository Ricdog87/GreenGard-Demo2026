// Planungs-Logik (V2, vereinfacht auf Kundenwunsch):
// nur noch 3 Kernfragen + WLAN-Abfrage.
//
// Die Preise kommen aus der echten Liste von Jan Leifermann (siehe lib/preise.ts):
// Materialkosten nach Fläche, Zuschlag je Wasserquelle. Die Stücklisten-Mengen
// bleiben eine transparente Faustformel — die verbindliche Auslegung macht die
// kostenlose Systemplanung.

import {
  MATERIAL_TABLE_MAX_QM,
  QUELLE_ZUSCHLAG,
  materialkostenNetto,
  ueberListe,
} from '@/lib/preise';

export type Quelle = 'leitung' | 'zisterne' | 'brunnen';
export type Flaechentyp = 'rasen' | 'beete';
export type Steuerung = 'smart' | 'manuell';

export interface PlanungInput {
  flaecheQm: number;
  quelle: Quelle;
  bereiche: Flaechentyp[];
  rasenQm: number;
  beetQm: number;
  steuerung: Steuerung;
}

export interface Position {
  label: string;
  menge: string;
}

export interface Kostenzeile {
  label: string;
  netto: number;
  note?: string;
}

export interface Empfehlung {
  kitSlug: 'bewaesserung-starter' | 'bewaesserung-komfort';
  kitName: string;
  /** Bewässerte Fläche, auf die sich die Materialkosten beziehen. */
  bewaesserteFlaeche: number;
  /** Materialkosten und Zuschläge — einzeln, damit sie nachvollziehbar bleiben. */
  kosten: Kostenzeile[];
  gesamtNetto: number;
  positionen: Position[];
  zonen: number;
  hinweise: string[];
}

/** Effektiv abgedeckte Rasenfläche pro Getrieberegner (mit Überdeckung). */
const QM_PRO_REGNER = 80;
/** Laufende Meter Tropfschlauch pro m² Beetfläche. */
const LFM_PRO_BEET_QM = 1.2;
/** Regner pro Bewässerungszone (begrenzt durch verfügbaren Durchfluss). */
const REGNER_PRO_ZONE = 4;

export const QUELLE_LABEL: Record<Quelle, string> = {
  leitung: 'Hauswasseranschluss',
  zisterne: 'Zisterne',
  brunnen: 'Brunnen',
};

export function berechneEmpfehlung(input: PlanungInput): Empfehlung {
  const { flaecheQm, quelle, bereiche, steuerung } = input;

  // Nur die Flächen zählen, die auch bewässert werden sollen.
  const rasenQm = bereiche.includes('rasen') ? Math.max(0, input.rasenQm) : 0;
  const beetQm = bereiche.includes('beete') ? Math.max(0, input.beetQm) : 0;
  const bewaesserteFlaeche = rasenQm + beetQm;

  const regner = rasenQm > 0 ? Math.max(2, Math.ceil(rasenQm / QM_PRO_REGNER)) : 0;
  const tropfLfm = beetQm > 0 ? Math.ceil((beetQm * LFM_PRO_BEET_QM) / 10) * 10 : 0;
  const rasenZonen = regner > 0 ? Math.ceil(regner / REGNER_PRO_ZONE) : 0;
  const beetZonen = tropfLfm > 0 ? 1 : 0;
  const zonen = Math.max(1, rasenZonen + beetZonen);

  // Kit-Wahl: Komfort sobald Smart-Steuerung gewünscht ist, die Fläche über
  // 300 m² liegt oder Rasen und Beete zusammen laufen sollen.
  const brauchtKomfort =
    steuerung === 'smart' || bewaesserteFlaeche > 300 || zonen > 4 || bereiche.length > 1;

  const kitSlug: Empfehlung['kitSlug'] = brauchtKomfort
    ? 'bewaesserung-komfort'
    : 'bewaesserung-starter';
  const kitName = brauchtKomfort ? 'Bewässerung Komfort Kit' : 'Bewässerung Starter Kit';

  // --- Kosten nach Jans Liste ---
  // Jans Liste nennt den Grundbetrag für den Hauswasseranschluss; Zisterne und
  // Brunnen kommen als Technik-Zuschlag obendrauf. Deshalb steht der Zusatz
  // "Hauswasseranschluss" nur dort, wo er auch die ganze Wahrheit ist.
  const kosten: Kostenzeile[] = [
    {
      label:
        quelle === 'leitung'
          ? `Material für ${bewaesserteFlaeche} m² · Hauswasseranschluss`
          : `Material für ${bewaesserteFlaeche} m² · Bewässerungstechnik`,
      netto: materialkostenNetto(bewaesserteFlaeche),
    },
  ];
  const zuschlag = QUELLE_ZUSCHLAG[quelle];
  if (zuschlag) {
    kosten.push({ label: zuschlag.label, netto: zuschlag.netto, note: zuschlag.note });
  }
  const gesamtNetto = kosten.reduce((s, k) => s + k.netto, 0);

  // --- Stückliste als Orientierung ---
  const positionen: Position[] = [];
  positionen.push({
    label: brauchtKomfort
      ? 'Hunter Hydrawise WLAN-Steuergerät'
      : 'Rainbird ESP-RZXe Steuergerät',
    menge: `1 Stück · ${Math.max(zonen, brauchtKomfort ? 6 : 4)} Zonen`,
  });
  if (regner > 0) {
    positionen.push({
      label: brauchtKomfort ? 'Hunter I-20 Versenkregner' : 'Hunter MP-Rotator Versenkregner',
      menge: `ca. ${regner} Stück`,
    });
  }
  if (tropfLfm > 0) {
    positionen.push({
      label: 'Netafim Techline CV Tropfschlauch',
      menge: `ca. ${tropfLfm} lfm`,
    });
  }
  positionen.push({ label: 'Rainbird Magnetventile + Ventilbox', menge: `${zonen} Stück` });
  positionen.push({
    label: 'PE-Rohr 25 mm inkl. Klemmverbindern',
    menge: `ca. ${Math.max(40, Math.ceil((bewaesserteFlaeche * 0.35) / 10) * 10)} lfm`,
  });
  if (steuerung === 'smart') {
    positionen.push({ label: 'Regensensor + Wetter-API-Anbindung', menge: '1 Set' });
  }
  if (quelle === 'zisterne') {
    positionen.push({ label: 'Saugpumpe, Filter und Steuerung', menge: '1 Set' });
  }
  if (quelle === 'brunnen') {
    positionen.push({ label: 'Brunnenpumpe mit Druckregelung', menge: '1 Set' });
  }

  // --- Hinweise ---
  const hinweise: string[] = [
    'Angegeben sind Materialkosten. Montage, Erdarbeiten und Inbetriebnahme kommen je nach Projekt hinzu.',
    'Mengen sind Richtwerte — die verbindliche Auslegung erfolgt in der kostenlosen Systemplanung.',
  ];
  if (zuschlag?.note) {
    hinweise.push(zuschlag.note);
  }
  if (ueberListe(bewaesserteFlaeche)) {
    hinweise.push(
      `Über ${MATERIAL_TABLE_MAX_QM.toLocaleString('de-DE')} m² kalkulieren wir individuell — der Richtwert ist linear fortgeschrieben.`
    );
  }
  if (flaecheQm > bewaesserteFlaeche) {
    hinweise.push(
      `Berechnet auf die bewässerte Fläche (${bewaesserteFlaeche} m² von ${flaecheQm} m² Grundstück).`
    );
  }
  if (steuerung === 'manuell') {
    hinweise.push('Das Steuergerät ist später ohne Austausch auf WLAN-Betrieb aufrüstbar.');
  }

  return {
    kitSlug,
    kitName,
    bewaesserteFlaeche,
    kosten,
    gesamtNetto,
    positionen,
    zonen,
    hinweise,
  };
}
