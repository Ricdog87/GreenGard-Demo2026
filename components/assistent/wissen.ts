// Das Wissen hinter Gießbert.
//
// Alles hier ist deterministisch und kommt aus Quellen, die im Repo ohnehin
// gepflegt werden: die 139 Antworten von green-gard.de, das Sortiment, die
// Service-Regeln aus lib/contact.ts. Kein LLM, keine API — der Assistent kann
// deshalb nichts erfinden und antwortet in Millisekunden. Wenn die Inhalte
// wachsen, wächst er mit, ohne dass jemand ihn trainiert.

import faqJson from '@/data/faq.json';
import { products, categories } from '@/lib/data';
import { CONTACT, OEFFNUNG, LIEFERUNG, AUSFUEHRUNG } from '@/lib/contact';
import { PLANUNGSGEBUEHR, PLANUNGSDAUER } from '@/lib/planungspakete';

export interface FaqTreffer {
  art: 'faq';
  frage: string;
  antwort: string[];
  score: number;
}
export interface ProduktTreffer {
  art: 'produkt';
  name: string;
  brand: string;
  href: string;
  score: number;
}
export interface SeitenTreffer {
  art: 'seite';
  label: string;
  note: string;
  href: string;
  score: number;
}
export type Treffer = FaqTreffer | ProduktTreffer | SeitenTreffer;

interface FaqEintrag {
  position: number;
  frage: string;
  antwort: string[];
  kategorie: string;
}

const FAQ = (faqJson as { eintraege: FaqEintrag[] }).eintraege;

/** Umlaute einebnen — „bewasserung“ findet „Bewässerung“. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Füllwörter, die beim Punkten nichts beitragen. */
const STOPP = new Set(
  'der die das den dem des ein eine einen einem wie was wann wo wer kann ich man mein meine muss soll darf gibt es ist sind hat und oder auch bei mit fur von zu im in auf sie ihr euch wir uns nicht kein'.split(' ')
);

function woerter(s: string): string[] {
  return normalize(s)
    .split(' ')
    .filter((w) => w.length >= 3 && !STOPP.has(w));
}

// ── Vorberechnete Indizes ───────────────────────────────────────────────────

const FAQ_INDEX = FAQ.map((e) => ({
  e,
  frageNorm: normalize(e.frage),
  antwortNorm: normalize(e.antwort.join(' ')),
}));

const PRODUKT_INDEX = products.map((p) => ({
  p,
  haystack: normalize([p.name, p.brand, p.shortDesc, p.category].join(' ')),
}));

const KAT_NAME = new Map(categories.map((c) => [c.slug, c.name]));

/** Seiten und Aktionen, die der Assistent direkt anbieten kann. */
const SEITEN: { label: string; note: string; href: string; stichworte: string }[] = [
  { label: 'Bewässerung planen', note: 'Garten zeichnen, Plan in 1–3 Werktagen', href: '/planung', stichworte: 'planung plan bewaesserungsplan zeichnen irrisketch angebot kosten rechner planen' },
  { label: 'Beratungstermin buchen', note: '30 Minuten, kostenfrei', href: '/beratung', stichworte: 'beratung termin gespraech besuchen vorbeikommen video beraten' },
  { label: 'Schulungen ansehen', note: 'Fachschulung, Expertentraining, Inhouse', href: '/beratung#schulungen', stichworte: 'schulung training kurs fortbildung expertentraining lernen' },
  { label: 'Learning Center', note: '139 Antworten und Videos', href: '/learning-center', stichworte: 'learning center video anleitung hilfe wissen fragen' },
  { label: 'Katalog blättern', note: 'Katalog 2026 digital', href: '/katalog', stichworte: 'katalog blaetterkatalog preisliste sortiment' },
  { label: 'Sortiment ansehen', note: '31 Artikel mit Filter', href: '/produkte', stichworte: 'produkte sortiment artikel kaufen shop bestellen' },
  { label: 'Konditionen für Profis', note: 'GaLaBau, Architekten, Händler', href: '/profi', stichworte: 'profi konditionen netto galabau haendler rechnung gewerblich partner' },
  { label: 'Mein Konto', note: 'EK-Preise, Bestellungen, Projekte', href: '/konto', stichworte: 'konto login anmelden dashboard ek preis bestellung projekt zugang' },
  { label: 'Warum Green-Gard', note: 'Team, Geschichte, Rainworks', href: '/warum-green-gard', stichworte: 'team ueber uns geschichte wer seid ihr ansprechpartner mitarbeiter' },
];

// ── Sofort-Fakten ───────────────────────────────────────────────────────────
//
// Die Fragen, die auf der alten Seite den Support-Anruf ausgelöst haben,
// beantwortet Gießbert aus lib/contact.ts — der einen Quelle, die auch Footer
// und Profi-Seite speist. Ändert sich eine Öffnungszeit, ändert sie sich überall.

export interface Fakt {
  id: string;
  titel: string;
  text: string[];
  /** Begriffe, bei denen dieser Fakt ganz oben stehen soll. */
  ausloeser: string;
  href?: { label: string; url: string };
}

export const FAKTEN: Fakt[] = [
  {
    id: 'oeffnungszeiten',
    titel: 'Öffnungszeiten',
    text: [
      `Telefonisch: ${OEFFNUNG.telefon}.`,
      `Lagerverkauf: ${OEFFNUNG.lager}. ${OEFFNUNG.samstag}.`,
      OEFFNUNG.anfahrt,
    ],
    ausloeser: 'offen geoffnet offnungszeit offnungszeiten samstag wochenende uhrzeit erreichbar lager abholen abholung parken anfahrt adresse',
  },
  {
    id: 'lieferung',
    titel: 'Lieferung',
    text: [
      `Lagerware liefern wir in ${LIEFERUNG.lagerware}.`,
      LIEFERUNG.wege,
      LIEFERUNG.abholung,
    ],
    ausloeser: 'lieferung lieferzeit versand liefern paket direktfahrt baustelle dauert',
  },
  {
    id: 'zahlung',
    titel: 'Bezahlung',
    text: [LIEFERUNG.zahlung],
    ausloeser: 'rechnung bezahlen zahlung vorkasse kauf karte zahlungsziel',
  },
  {
    id: 'planungskosten',
    titel: 'Was kostet die Planung?',
    text: [
      PLANUNGSGEBUEHR.erklaerung,
      `Bearbeitungszeit: ${PLANUNGSDAUER}, sobald alle Angaben vorliegen.`,
    ],
    ausloeser: 'planung kostet kosten preis bewaesserungsplan angebot euro gebuhr',
    href: { label: 'Planung starten', url: '/planung' },
  },
  {
    id: 'einbau',
    titel: 'Bauen Sie auch ein?',
    text: [AUSFUEHRUNG.hinweis, AUSFUEHRUNG.vermittlung],
    ausloeser: 'einbau einbauen montage monteur installieren installation verbauen fachbetrieb',
    href: { label: 'Beratung vereinbaren', url: '/beratung' },
  },
];

// ── Suche ───────────────────────────────────────────────────────────────────

export function sucheFakten(query: string): Fakt[] {
  const qw = woerter(query);
  if (!qw.length) return [];
  return FAKTEN.filter((f) => qw.some((w) => f.ausloeser.includes(w)));
}

export function suche(query: string): Treffer[] {
  const qNorm = normalize(query);
  const qw = woerter(query);
  if (!qw.length && qNorm.length < 3) return [];

  const treffer: Treffer[] = [];

  for (const { e, frageNorm, antwortNorm } of FAQ_INDEX) {
    let score = 0;
    for (const w of qw) {
      if (frageNorm.includes(w)) score += 3;
      else if (antwortNorm.includes(w)) score += 1;
    }
    if (qw.length > 1 && frageNorm.includes(qNorm)) score += 4;
    if (score > 0) treffer.push({ art: 'faq', frage: e.frage, antwort: e.antwort, score });
  }

  for (const { p, haystack } of PRODUKT_INDEX) {
    let score = 0;
    for (const w of qw) if (haystack.includes(w)) score += 2;
    if (score > 0)
      treffer.push({
        art: 'produkt',
        name: p.name,
        brand: `${p.brand} · ${KAT_NAME.get(p.category) ?? p.category}`,
        href: `/produkte/${p.slug}`,
        score,
      });
  }

  for (const s of SEITEN) {
    const hay = normalize(`${s.label} ${s.stichworte}`);
    let score = 0;
    for (const w of qw) if (hay.includes(w)) score += 2;
    if (score > 0) treffer.push({ art: 'seite', label: s.label, note: s.note, href: s.href, score });
  }

  return treffer.sort((a, b) => b.score - a.score);
}

// ── Mähroboter-Finder ───────────────────────────────────────────────────────
//
// Drei Antworten genügen, um aus den vier Modellen das richtige zu nennen —
// die Logik entspricht der Telefonberatung: Fläche zuerst, dann Draht ja/nein.

export interface RoboterEmpfehlung {
  slug: string;
  name: string;
  grund: string;
  href: string;
}

export const FINDER_FLAECHEN = [
  { id: 'klein', label: 'bis 600 m²' },
  { id: 'mittel', label: '600 – 1.500 m²' },
  { id: 'gross', label: '1.500 – 2.200 m²' },
  { id: 'sehr-gross', label: 'über 2.200 m²' },
] as const;

export type FinderFlaeche = (typeof FINDER_FLAECHEN)[number]['id'];

export function empfehleRoboter(flaeche: FinderFlaeche, ohneKabel: boolean): RoboterEmpfehlung[] {
  const alle: Record<string, RoboterEmpfehlung> = {
    'husqvarna-305': {
      slug: 'husqvarna-305',
      name: 'Husqvarna Automower 305',
      grund: 'Der bewährte Einstieg für kompakte Gärten bis 600 m² — leise und zuverlässig.',
      href: '/produkte/husqvarna-305',
    },
    'kress-kr136e': {
      slug: 'kress-kr136e',
      name: 'Kress KR136E',
      grund: 'RTK-Satellitennavigation ohne Begrenzungsdraht, bis 1.500 m², 45 % Steigung, 53 dB.',
      href: '/produkte/kress-kr136e',
    },
    'kress-kr173e': {
      slug: 'kress-kr173e',
      name: 'Kress KR173E',
      grund: 'Wie der KR136E, ausgelegt bis 2.200 m² — für große Flächen ohne Kabelverlegung.',
      href: '/produkte/kress-kr173e',
    },
    'husqvarna-430x-nera': {
      slug: 'husqvarna-430x-nera',
      name: 'Husqvarna Automower 430X NERA',
      grund: 'EPOS-Satellitennavigation ohne Draht, bis 3.200 m² und 45 % Steigung.',
      href: '/produkte/husqvarna-430x-nera',
    },
  };

  if (flaeche === 'klein') return ohneKabel ? [alle['kress-kr136e'], alle['husqvarna-305']] : [alle['husqvarna-305'], alle['kress-kr136e']];
  if (flaeche === 'mittel') return [alle['kress-kr136e'], alle['kress-kr173e']];
  if (flaeche === 'gross') return [alle['kress-kr173e'], alle['husqvarna-430x-nera']];
  return [alle['husqvarna-430x-nera'], alle['kress-kr173e']];
}

// ── Kontakt-Ausstieg ────────────────────────────────────────────────────────

export function mailtoFuer(frage: string): string {
  const betreff = encodeURIComponent(frage.trim() ? `Frage: ${frage.trim().slice(0, 120)}` : 'Frage über die Website');
  return `mailto:${CONTACT.email}?subject=${betreff}`;
}

export const KONTAKT = {
  telefon: CONTACT.phoneDisplay,
  telefonHref: CONTACT.phoneHref,
  zeiten: OEFFNUNG.telefon,
} as const;
