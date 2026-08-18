// Zentraler, typisierter Zugriff auf die Mock-Daten.
//
// Alles läuft über dieses Modul, damit später nur HIER auf ein CMS umgestellt
// werden muss (Sanity/Contentful/Strapi): gleiche Exporte, andere Quelle.
// Die JSON-Importe brauchen einen Cast, weil TypeScript aus JSON sonst
// Literal-Unions mit optionalen Feldern ableitet.

import productsJson from '@/data/products.json';
import categoriesJson from '@/data/categories.json';
import kitsJson from '@/data/starter-kits.json';
import testimonialsJson from '@/data/testimonials.json';
import teamJson from '@/data/team.json';
import schulungenJson from '@/data/schulungen.json';
import highlightsJson from '@/data/highlights.json';
import rainworksJson from '@/data/rainworks.json';

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  netPrice: number;
  image: string;
  stock: number;
  bestseller?: boolean;
  specs: Record<string, string>;
}

export interface Category {
  slug: string;
  name: string;
  roman: string;
  manifest: string;
  blurb: string;
  /** Einleitungssatz der Disziplin — Fassung von green-gard.de. */
  intro?: string;
  /** „Unsere Expertise – Ihre Vorteile“ der jeweiligen Kategorieseite. */
  vorteile?: string[];
  /** Themenblöcke der Kategorieseite, z. B. Rasen- und Tropfbewässerung. */
  themen?: { title: string; text: string }[];
  abPreis: number;
  image: string;
}

export interface StarterKit {
  slug: string;
  name: string;
  roman: string;
  tagline: string;
  abPreis: number;
  highlight?: boolean;
  image: string;
  ideal: string;
  components: string[];
  note: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  date: string;
  /** Bewusst optional: zu echten Namen gehört entweder ein echtes Foto oder keins. */
  avatar?: string;
}

export interface TeamMember {
  first: string;
  last: string;
  /** Positionsbezeichnung — Wortlaut vom Kunden (18.08.2026). */
  rolle?: string;
  /** Steuert die Anzeige des Titels auf der Team-Seite. */
  zeigeRolle?: boolean;
  email: string;
  photo: string;
}

export interface Schulung {
  slug: string;
  roman: string;
  title: string;
  duration: string;
  abPreis: number;
  audience: string;
  content: string[];
  /** Leer, solange die echten Termine vom Kunden fehlen — dann „auf Anfrage“. */
  termine: string[];
  /** Veranstaltungsorte laut green-gard.de/training. */
  orte?: string[];
  /** 0 = Platzzahl noch nicht bestätigt. */
  plaetze: number;
}

export const products = productsJson as unknown as Product[];
export const categories = categoriesJson as unknown as Category[];
export const starterKits = kitsJson as unknown as StarterKit[];
export const testimonials = testimonialsJson as unknown as Testimonial[];
export const team = (teamJson as unknown as { members: TeamMember[] }).members;
/** Gruppenaufnahme 2025 vom Kunden — Auftakt der Teamsektion. */
export const teamGruppenfoto = (teamJson as unknown as { _gruppenfoto: string })._gruppenfoto;
export const schulungen = schulungenJson as unknown as Schulung[];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getKit(slug: string): StarterKit | undefined {
  return starterKits.find((k) => k.slug === slug);
}

/** Kuratierte Highlights für die Landing — Reihenfolge kommt aus der JSON. */
export function getHighlightProducts(): Product[] {
  const slugs = (highlightsJson as unknown as { slugs: string[] }).slugs;
  return slugs.map(getProduct).filter((p): p is Product => Boolean(p));
}

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

/**
 * Rainworks-Inhalte, Wortlaut 1:1 von green-gard.de/rainworks.
 * Bewusst kein Interface mit Literal-Unions — die Datei ist reiner Text.
 */
export const rainworks = rainworksJson;
