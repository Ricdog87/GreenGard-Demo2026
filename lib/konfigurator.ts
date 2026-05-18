// Konfigurator-Logik: einfache Heuristik, die aus Eingaben ein Paket + Add-Ons
// empfiehlt. Bewusst transparent gehalten — für die echte Site würde hier eine
// kalibrierte Berechnung mit Druckverlust, Niederschlagsspende etc. stehen.

export type Quelle = 'leitung' | 'zisterne' | 'brunnen';
export type Steuerung = 'manuell' | 'smart' | 'premium';
export type Bewässert = 'rasen' | 'beete' | 'hecken' | 'hochbeet';

export interface KonfiguratorInput {
  flaecheQm: number;
  quelle: Quelle;
  bewaessert: Bewässert[];
  steuerung?: Steuerung;
  maehroboter?: boolean;
  beleuchtung?: boolean;
}

export interface Empfehlung {
  paketSlug: 'starter' | 'pro' | 'premium';
  basisPreis: number;
  addOns: { label: string; preis: number }[];
  gesamt: number;
  hinweise: string[];
}

export function berechneEmpfehlung(input: KonfiguratorInput): Empfehlung {
  const { flaecheQm, quelle, bewaessert, steuerung, maehroboter, beleuchtung } = input;

  // Paketwahl primär nach Fläche
  let paketSlug: Empfehlung['paketSlug'] = 'starter';
  let basisPreis = 899;
  if (flaecheQm > 350 || bewaessert.length >= 3 || steuerung === 'smart') {
    paketSlug = 'pro';
    basisPreis = 2490;
  }
  if (flaecheQm > 900 || steuerung === 'premium' || (maehroboter && beleuchtung)) {
    paketSlug = 'premium';
    basisPreis = 4990;
  }

  const addOns: { label: string; preis: number }[] = [];
  const hinweise: string[] = [];

  if (quelle === 'zisterne' || quelle === 'brunnen') {
    addOns.push({
      label: quelle === 'zisterne' ? 'Zisterne-Saugpumpe Pedrollo' : 'Brunnenpumpe Pedrollo',
      preis: 389,
    });
    hinweise.push('Pumpenleistung passend zur Wasserquelle ist enthalten.');
  }

  if (maehroboter && paketSlug !== 'premium') {
    const m = flaecheQm <= 600 ? 'Kress KR136E (1.500 m²)' : 'Husqvarna 430X NERA';
    const p = flaecheQm <= 600 ? 1290 : 2890;
    addOns.push({ label: `Mähroboter ${m}`, preis: p });
  }

  if (beleuchtung && paketSlug !== 'premium') {
    const fixturePreis = flaecheQm < 300 ? 590 : 1190;
    addOns.push({ label: 'In-Lite Garten-Beleuchtungsset 12V', preis: fixturePreis });
  }

  if (bewaessert.includes('hochbeet')) {
    addOns.push({ label: 'Netafim Tropfschlauch-Set Hochbeet', preis: 89 });
  }

  const gesamt = basisPreis + addOns.reduce((s, a) => s + a.preis, 0);

  if (flaecheQm > 1500) {
    hinweise.push('Bei > 1.500 m² empfehlen wir eine kostenfreie Vor-Ort-Planung.');
  }

  return { paketSlug, basisPreis, addOns, gesamt, hinweise };
}
