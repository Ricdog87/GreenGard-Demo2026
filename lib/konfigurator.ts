// Planungs-Logik (V2, vereinfacht auf Kundenwunsch):
// nur noch 3 Kernfragen + WLAN-Abfrage. Ergebnis ist ein empfohlenes Starter Kit
// mit "ab"-Preis plus eine Stückliste als Orientierung — bewusst KEIN Festpreis.
//
// Die Mengen sind eine transparente Faustformel, keine hydraulische Auslegung:
// die echten Werte kommen aus der kostenlosen Systemplanung (Druck, Leitungswege,
// Gartenschnitt). Das ist auch genau die Botschaft an den Nutzer.

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

export interface Empfehlung {
  kitSlug: 'bewaesserung-starter' | 'bewaesserung-komfort';
  kitName: string;
  abPreis: number;
  zusatz: { label: string; abPreis: number }[];
  abPreisGesamt: number;
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
  leitung: 'Leitungswasser',
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
  const abPreis = brauchtKomfort ? 2490 : 899;

  const zusatz: { label: string; abPreis: number }[] = [];
  if (quelle === 'zisterne') {
    zusatz.push({ label: 'Saugpumpe für Zisterne (Pedrollo)', abPreis: 389 });
  }
  if (quelle === 'brunnen') {
    zusatz.push({ label: 'Brunnenpumpe inkl. Druckregelung (Pedrollo)', abPreis: 489 });
  }

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
  for (const z of zusatz) {
    positionen.push({ label: z.label, menge: '1 Stück' });
  }

  const hinweise: string[] = [
    'Alle Mengen sind Richtwerte. Die verbindliche Auslegung erfolgt in der kostenlosen Systemplanung.',
  ];
  if (quelle !== 'leitung') {
    hinweise.push(
      'Pumpen werden individuell ausgelegt — Saughöhe, Filterung und Volumenstrom entscheiden über das Modell.'
    );
  }
  if (flaecheQm > 1200) {
    hinweise.push('Ab etwa 1.200 m² planen wir mehrere Bewässerungskreise und prüfen den Hausanschluss vor Ort.');
  }
  if (steuerung === 'manuell') {
    hinweise.push('Das Steuergerät ist später ohne Austausch auf WLAN-Betrieb aufrüstbar.');
  }

  const abPreisGesamt = abPreis + zusatz.reduce((s, z) => s + z.abPreis, 0);

  return { kitSlug, kitName, abPreis, zusatz, abPreisGesamt, positionen, zonen, hinweise };
}
