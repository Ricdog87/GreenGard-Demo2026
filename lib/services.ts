// Serviceleistungen mit ihren echten Eckdaten.
//
// Quelle sind die Service- und Mähroboter-Seiten auf green-gard.de sowie das
// Learning Center (abgerufen 03.08.2026). Wichtig ist die Rollenverteilung:
// Green Gard plant, liefert und betreut — eingebaut wird von Fachbetrieben.

export interface Serviceleistung {
  slug: string;
  titel: string;
  claim: string;
  text: string;
  /** Konkrete Leistungspunkte, wo die Quelle welche nennt. */
  punkte?: string[];
  /** Festpreis in Euro, falls der Kunde einen ausweist. */
  preis?: number;
  preisHinweis?: string;
}

export const SERVICES: Serviceleistung[] = [
  {
    slug: 'konzeption',
    titel: 'Konzeption',
    claim: 'Ab der ersten Idee dabei',
    text: 'Wir planen die Anlage unter effektiven, wirtschaftlichen und ökologischen Gesichtspunkten. Eine Überdimensionierung kostet nicht nur Geld, sie belastet auch unnötig die Umwelt — deshalb legen wir aus, was gebraucht wird, und nicht mehr.',
  },
  {
    slug: 'installation',
    titel: 'Installation',
    claim: 'Durch einen Fachbetrieb',
    text: 'Green Gard ist Vertriebs- und Handelshaus und hat keine eigenen Monteure. Wer Hilfe beim Einbau braucht, bekommt von uns einen Fachbetrieb aus dem Netzwerk vermittelt — der installiert routiniert und nimmt die Anlage sauber in Betrieb.',
  },
  {
    slug: 'betreuung',
    titel: 'Betreuung',
    claim: 'Auch nach der Abnahme',
    text: 'Neue Beregnungskreise ergänzen, die Anlage umbauen, einen defekten Regner tauschen, Zubehör nachbestellen: Auch Jahre später ist derselbe Ansprechpartner zuständig.',
  },
  {
    slug: 'winterservice',
    titel: 'Winterservice Mähroboter',
    claim: 'Fit für den Frühling',
    text: 'Wir prüfen Ihren Mähroboter in der Winterpause durch, damit er zum Saisonstart läuft. Für alle Modelle von Kress und Husqvarna.',
    punkte: [
      'Fachgerechte Reinigung des Mähers',
      'Autocheck, Akku-Test, Funktionstest von Sensoren und Antrieb',
      'Prüfung und Reinigung der Lade- und Kontaktbleche',
      'Wartung aller beweglichen Teile, Messertausch, Firmware-Update',
      'Prüfbericht',
    ],
    preis: 235,
    preisHinweis: 'Festpreis',
  },
  {
    slug: 'reparatur',
    titel: 'Reparatur',
    claim: 'Im eigenen Haus',
    text: 'Mähroboter von Kress und Husqvarna reparieren wir selbst. Für alles andere wickeln wir Garantie- und Reklamationsfälle über den Hersteller ab.',
  },
];

export function service(slug: string): Serviceleistung | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
