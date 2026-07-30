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
}

export const AUDIENCES: Record<Audience, AudienceConfig> = {
  profi: {
    id: 'profi',
    kicker: 'I',
    title: 'GaLaBau / Architekt',
    claim: 'Planung, Konditionen, Ausführung',
    detail: 'Nettopreise, Staffelrabatt, Systemplanung und Unterlagen für Ihre Projekte.',
    image: '/img/gate/architekt.svg',
    mode: 'profi',
    gewerbe: 'galabau',
    links: [
      { href: '/profi', label: 'Konditionskatalog', note: 'Netto, Staffeln, Rechnungskauf' },
      { href: '/planung', label: 'Systemplanung starten', note: 'Stückliste in vier Schritten' },
      { href: '/produkte', label: 'Sortiment mit Nettopreisen', note: '31 Artikel ab Lager' },
    ],
  },
  privat: {
    id: 'privat',
    kicker: 'II',
    title: 'Privat',
    claim: 'Lösungen für Ihren Garten',
    detail: 'Bruttopreise, fertige Starter Kits und kostenlose Planung für Ihr Grundstück.',
    image: '/img/gate/privat.svg',
    mode: 'privat',
    gewerbe: 'sonstiges',
    links: [
      { href: '/planung', label: 'Bewässerung berechnen', note: 'Drei Fragen, ein Richtpreis' },
      { href: '/starter-kits', label: 'Starter Kits', note: 'ab 899 € inkl. Planung' },
      { href: '/produkte', label: 'Produkte ansehen', note: 'Bewässerung bis Pool' },
    ],
  },
  haendler: {
    id: 'haendler',
    kicker: 'III',
    title: 'Händler',
    claim: 'Wiederverkauf und Streckengeschäft',
    detail: 'Händlerkonditionen, Sortimentslisten und Verfügbarkeiten für den Wiederverkauf.',
    image: '/img/gate/haendler.svg',
    mode: 'profi',
    gewerbe: 'fachhandel',
    links: [
      { href: '/profi', label: 'Händlerkonditionen', note: 'Staffeln und Rechnungskauf' },
      { href: '/produkte', label: 'Sortiment und Nettopreise', note: 'Lagerbestand je Artikel' },
      { href: '/beratung#schulungen', label: 'Produktschulungen', note: 'Für Ihr Verkaufsteam' },
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
