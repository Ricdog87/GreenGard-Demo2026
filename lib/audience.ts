// Zielgruppen-Modell.
//
// Die Auswahl im Entry-Fenster entscheidet zwei Dinge:
//   1. die Preisansicht (Profi und Händler sehen netto, Privat brutto)
//   2. welche Navigation, Schnelleinstiege und Formular-Vorbelegungen greifen
//
// GaLaBau und Architekten sind bewusst EINE Gruppe (Kundenvorgabe): beide
// planen und führen aus, brauchen dieselben Konditionen und Unterlagen.
// Händler sind eigenständig, weil Wiederverkauf andere Fragen stellt —
// Verfügbarkeit, Sortimentsbreite, Streckengeschäft.

import type { Mode } from '@/lib/pricing';
import type { GewerbeArt } from '@/lib/supabase';

export type Audience = 'profi' | 'privat' | 'haendler';

export interface AudienceConfig {
  id: Audience;
  kicker: string;
  title: string;
  claim: string;
  /** Kurzer Nutzen, erscheint auf der Auswahlkarte. */
  detail: string;
  image: string;
  mode: Mode;
  /** Vorbelegung im Konditions-Formular auf /profi. */
  gewerbe: GewerbeArt;
  /** Schnelleinstiege direkt unter dem Hero. */
  links: { href: string; label: string; note: string }[];
  /**
   * Leistungsversprechen je Zielgruppe, übernommen von den Partnerseiten auf
   * green-gard.de (/galabauer-installateure, /privatkunden, /fachhaendler).
   */
  vorteile: string[];
}

export const AUDIENCES: Record<Audience, AudienceConfig> = {
  profi: {
    id: 'profi',
    kicker: 'I',
    title: 'GaLaBau / Architekt',
    claim: 'Planung, Konditionen, Ausführung',
        detail: 'Nettopreise, Systemplanung und Unterlagen für Ihre Projekte — Konditionen nach Vereinbarung.',
    image: '/img/gate/architekt.svg',
    mode: 'profi',
    gewerbe: 'galabau',
    links: [
            { href: '/profi', label: 'Konditionen anfragen', note: 'Netto und Rechnungskauf' },
      { href: '/planung', label: 'Systemplanung starten', note: 'Stückliste in vier Schritten' },
      { href: '/produkte', label: 'Sortiment im Überblick', note: 'Shop bald verfügbar' },
    ],
    vorteile: [
      'Vor-Ort-Service: Unsere Leute helfen auf Wunsch bei der Montage',
      'Finden Sie ein Produkt nicht, besorgen wir es',
      'Kostenlose Beratung — vor und nach dem Kauf',
      'Technischer Support und Unterstützung in der Realisierungsplanung',
      'Erreichbar Mo – Fr von 7:30 bis 17:00 Uhr',
      'Support auch auf Englisch',
    ],
  },
  privat: {
    id: 'privat',
    kicker: 'II',
    title: 'Privat',
    claim: 'Lösungen für Ihren Garten',
    detail: 'Bruttopreise und eine Planung, die mit dem Material verrechnet wird.',
    image: '/img/gate/privat.svg',
    mode: 'privat',
    gewerbe: 'sonstiges',
    links: [
      { href: '/planung', label: 'Bewässerung berechnen', note: 'Drei Fragen, ein Richtpreis' },
      { href: '/beratung', label: 'Beratung buchen', note: '30 Minuten, kostenfrei' },
      { href: '/produkte', label: 'Sortiment ansehen', note: 'Bewässerung bis Pool' },
    ],
    vorteile: [
      'Fachberatung und Konzeption für Ihr Grundstück',
      'Erreichbar Mo – Fr von 7:30 bis 17:00 Uhr',
      'Support auch auf Englisch',
      'Mehr Zeit für Hobby und Familie',
      'Nachhaltiger gärtnern mit stromsparender Technik und Beleuchtung',
      'Hilfestellung und Tipps bei der Umsetzung Ihres Vorhabens',
    ],
  },
  haendler: {
    id: 'haendler',
    kicker: 'III',
    title: 'Händler',
    claim: 'Wiederverkauf und Streckengeschäft',
        detail: 'Sortimentslisten und Verfügbarkeiten für den Wiederverkauf — Konditionen nach Vereinbarung.',
    image: '/img/gate/haendler.svg',
    mode: 'profi',
    gewerbe: 'fachhandel',
    links: [
            { href: '/profi', label: 'Händlerkonditionen', note: 'Individuell nach Vereinbarung' },
      { href: '/produkte', label: 'Sortiment im Überblick', note: 'Shop bald verfügbar' },
      { href: '/beratung#schulungen', label: 'Produktschulungen', note: 'Für Ihr Verkaufsteam' },
    ],
    vorteile: [
      'Langjährige Erfahrung als Handelsunternehmen für Bewässerung, Pumpen, Teich- und Lichttechnik',
      'Zusammenarbeit mit Landschaftsarchitekten, Fachplanern und regionalen Fachhändlern',
      'Vor-Ort-Service: Unsere Leute helfen auf Wunsch bei der Montage',
      'Finden Sie ein Produkt nicht, besorgen wir es',
      'Betreuung und Beratung vor und nach dem Kauf',
      'Support auch auf Englisch',
    ],
  },
};

/** Reihenfolge im Entry-Fenster — wie vom Kunden vorgegeben. */
export const AUDIENCE_ORDER: Audience[] = ['profi', 'privat', 'haendler'];

export function isProfi(audience: Audience): boolean {
  return AUDIENCES[audience].mode === 'profi';
}

export function audienceLabel(audience: Audience): string {
  return AUDIENCES[audience].title;
}
