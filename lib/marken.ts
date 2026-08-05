// Herstellerprofile.
//
// Grundlage sind die Markenseiten auf green-gard.de (/hunter, /rainbird,
// /inlite, /kress) sowie die Herstellerliste aus dem Learning Center. Die
// Texte sind bewusst neu geschrieben: auf der Kundenseite stehen dort
// Herstellerbroschüren-Texte, die wir nicht wörtlich übernehmen wollen. Die
// Fakten — Gründung, Schwerpunkt, was Green Gard davon führt — bleiben.
//
// TODO: Freigabe der Wortmarken beim jeweiligen Hersteller prüfen
// (siehe OFFENE-PUNKTE.md, B6).

export interface Marke {
  slug: string;
  name: string;
  claim: string;
  /** Wofür der Hersteller steht — zwei bis drei Sätze. */
  text: string;
  /** Was Green Gard von dieser Marke im Sortiment hat. */
  sortiment: string;
  /** Disziplinen, in denen die Marke bei uns auftaucht. */
  kategorien: string[];
}

export const MARKEN: Marke[] = [
  {
    slug: 'hunter',
    name: 'Hunter Industries',
    claim: 'Bewässerung und Außenbeleuchtung, seit 1981',
    text: 'Familienunternehmen aus San Marcos, Kalifornien, das seit 1981 Bewässerungstechnik für Profis baut — vom Hausgarten bis zum Stadion. Der Anspruch: eine Anlage soll mit so wenig Wasser und Energie auskommen wie möglich. Über die Tochter FX Luminaire kam die Außenbeleuchtung dazu.',
    sortiment: 'Getriebeversenkregner, MP-Rotator-Düsen, Sprühregner, Ventile, Steuergeräte, Tropfsysteme und Sensorik. Hydrawise ist bei uns die Standardempfehlung für alles, was per App laufen soll.',
    kategorien: ['bewaesserung', 'steuerung'],
  },
  {
    slug: 'rainbird',
    name: 'Rain Bird',
    claim: 'Intelligenter Umgang mit Wasser',
    text: 'Einer der größten Hersteller für Bewässerungskomponenten weltweit, mit über 4.000 Produkten und mehreren hundert Patenten. Das Zentrallager für Europa steht in Frankreich, entsprechend schnell ist die Nachversorgung in Deutschland.',
    sortiment: 'Versenkregner der 3500er- und 5000er-Reihe, R-VAN-Düsen, Magnetventile, Steuergeräte und der druckkompensierte Tropfschlauch XFD.',
    kategorien: ['bewaesserung', 'steuerung'],
  },
  {
    slug: 'in-lite',
    name: 'In-Lite',
    claim: 'Gartenlicht auf 12 Volt',
    text: 'Entwickelt seit über zwanzig Jahren Außenbeleuchtung, die möglichst natürlich wirkt. Das gesamte System läuft auf 12-Volt-Niederspannung — dadurch lässt es sich sicher und ohne Elektrofachkraft selbst stecken. Gesteuert wird über die App: dimmen, Farbe, Szenen.',
    sortiment: 'Spots, Wand- und Wegeleuchten, Trafos, Smart HUB 150 und 300, das 14/2- und 10/2-Kabelsystem. Bei durchgängiger In-Lite-Ausstattung geben wir fünf Jahre Garantie.',
    kategorien: ['beleuchtung'],
  },
  {
    slug: 'kress',
    name: 'Kress',
    claim: 'Mähen ohne Begrenzungskabel',
    text: 'Fachhandelsmarke des Positec-Konzerns. Die RTK-Modelle navigieren über Satellit statt über ein Begrenzungskabel: GNSS liefert die grobe Position, die Echtzeitkorrektur über das eigene Referenznetz bringt sie auf Zentimeter. Dazu kommt das 60-Volt-Akkusystem, das in acht Minuten voll lädt.',
    sortiment: 'RTK-Mähroboter für kleine bis große Flächen, Akkugeräte der 60-V-Serie, CyberTank als mobile Ladestation.',
    kategorien: ['maehroboter'],
  },
  {
    slug: 'husqvarna',
    name: 'Husqvarna',
    claim: 'Marktführer bei Mährobotern',
    text: 'Der Automower ist das meistverkaufte Modell im Segment und läuft in vielen Gärten seit acht bis zwölf Jahren. Die Nera-Reihe kommt ohne Begrenzungskabel aus. Mit rund 60 dB liegt der Schallpegel auf dem Niveau einer normalen Unterhaltung.',
    sortiment: 'Automower in allen Baugrößen, Ladestationen, Zubehör. Reparatur und Winterservice machen wir im eigenen Haus.',
    kategorien: ['maehroboter'],
  },
  {
    slug: 'netafim',
    name: 'Netafim',
    claim: 'Die Referenz für Tropfbewässerung',
    text: 'Hat die Tropfbewässerung als Technik überhaupt erst etabliert. Die druckkompensierten Tropfer geben auch bei schwankendem Druck und über lange Strecken konstant dieselbe Menge ab — der Grund, warum wir sie bei Hecken und Beeten empfehlen.',
    sortiment: 'Techline-Tropfrohr für ober- und unterirdische Verlegung, Mikroschlauch, Tropfer und Zubehör.',
    kategorien: ['bewaesserung'],
  },
  {
    slug: 'pedrollo',
    name: 'Pedrollo',
    claim: 'Pumpen für Brunnen und Zisterne',
    text: 'Italienischer Pumpenhersteller, seit Jahren unser Standard für Brunnen- und Zisternenanwendungen. Die Geräte schalten bei Wassermangel selbsttätig ab und laufen nach wenigen Minuten von allein wieder an — das verhindert Trockenlaufschäden.',
    sortiment: 'Tauchdruckpumpen, Kreiselpumpen, Hauswasserwerke und passende Druckschalter.',
    kategorien: ['pumpentechnik'],
  },
  {
    slug: 'grundfos',
    name: 'Grundfos',
    claim: 'Effiziente Druckerhöhung',
    text: 'Dänischer Hersteller, in der Haustechnik seit Jahrzehnten gesetzt. Wir setzen die Pumpen dort ein, wo Effizienz und Regelgüte über den Betriebskosten stehen.',
    sortiment: 'Druckerhöhungsanlagen, Unterwasserpumpen und Regelungstechnik.',
    kategorien: ['pumpentechnik'],
  },
  {
    slug: 'speck',
    name: 'Speck',
    claim: 'Pumpentechnik für Pool und Garten',
    text: 'Die BADU-Baureihe ist im Betrieb wartungsfrei — es genügt, das Saugsieb regelmäßig zu reinigen und ab und zu einen Blick darauf zu werfen.',
    sortiment: 'BADU-Pumpen für Pool und Filtertechnik, Brunnenpumpen.',
    kategorien: ['pumpentechnik', 'pool'],
  },
  {
    slug: 'bayrol',
    name: 'Bayrol',
    claim: 'Wasserpflege, die planbar bleibt',
    text: 'Chemie und Messtechnik für den privaten Pool. Richtig dosiert wird die Wasserpflege zur Routine statt zum Wochenendprojekt.',
    sortiment: 'Chlor, pH-Regulierung, Dosier- und Messtechnik.',
    kategorien: ['pool'],
  },
  {
    slug: 'beatbot',
    name: 'Beatbot',
    claim: 'Kabellose Poolroboter',
    text: 'Autonome Reiniger, die Boden, Wand und Wasserlinie abfahren, ohne Kabel und ohne Schlauch. Neu im Sortiment.',
    sortiment: 'Poolroboter für private Becken.',
    kategorien: ['pool'],
  },
];

export function marke(slug: string): Marke | undefined {
  return MARKEN.find((m) => m.slug === slug);
}

/** Alle Marken, die in einer Disziplin geführt werden. */
export function markenFuer(kategorie: string): Marke[] {
  return MARKEN.filter((m) => m.kategorien.includes(kategorie));
}
