// Ausstattungsstufen und Planungsgebühr.
//
// Beides steht so auf green-gard.de (/planungstool und Learning Center) und
// fehlte auf der neuen Seite komplett. Die Stufen sind kein Rabattmodell,
// sondern eine Materialentscheidung — welche Steuerung, welche Verteilung.
// Preise stehen bewusst keine daran: die ergeben sich aus der Planung.

export interface Ausstattungsstufe {
  id: 'bronze' | 'silber' | 'gold';
  name: string;
  claim: string;
  beschreibung: string;
  merkmale: string[];
  beliebt?: boolean;
}

export const AUSSTATTUNGSSTUFEN: Ausstattungsstufe[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    claim: 'Der solide Einstieg',
    beschreibung:
      'Bewährte Steuerungen und Regner ohne Extras. Für alle, die eine funktionierende Anlage wollen und das Budget im Blick behalten.',
    merkmale: ['Manuelles Steuergerät', 'Magnetventilverteilung aus Kunststoff', 'Kundensupport inklusive'],
  },
  {
    id: 'silber',
    name: 'Silber',
    claim: 'Die Mitte, gut gewählt',
    beschreibung:
      'Eine Mischung aus Bronze und Gold — für alle, die nichts dem Zufall überlassen, aber auch nicht überdimensionieren wollen.',
    merkmale: ['Steuergerät auf WLAN erweiterbar', 'WLAN nachrüstbar', 'Kundensupport inklusive'],
  },
  {
    id: 'gold',
    name: 'Gold',
    claim: 'Einmal richtig',
    beschreibung:
      'Die langlebigsten Materialien im Sortiment. Für alle, die sich um die Anlage danach keine Gedanken mehr machen wollen.',
    merkmale: ['Steuerung mit WLAN und App', 'Verteilung aus Messing', 'Kundensupport inklusive'],
    beliebt: true,
  },
];

/**
 * Die Planung selbst kostet 120 € und wird mit dem Material verrechnet — wer
 * bei uns kauft, zahlt sie also nicht. Steht so im Learning Center; auf der
 * neuen Seite hieß es vorher pauschal „kostenlose Planung“, was den Mechanismus
 * verschweigt und beim ersten Angebot für Überraschung sorgt.
 */
export const PLANUNGSGEBUEHR = {
  betrag: 120,
  regel: 'wird mit dem Material verrechnet',
  erklaerung:
    'Für einen professionellen Bewässerungsplan mit passendem Angebot berechnen wir 120 €. Bestellen Sie das Material bei uns, wird der Betrag verrechnet — dann ist die Planung kostenlos.',
} as const;

/** Bearbeitungszeit laut Learning Center, sobald alle Angaben vorliegen. */
export const PLANUNGSDAUER = '1 – 3 Werktage';

/**
 * Einheitliche Kurzfassung für Fließtext und Fußnoten. Vorher stand an
 * mehreren Stellen „kostenlose Systemplanung“ — das stimmt erst nach der
 * Verrechnung und klang nach einer Zusage, die das Angebot dann bricht.
 */
export const PLANUNG_KURZ = 'Planung 120 €, wird mit dem Material verrechnet';
