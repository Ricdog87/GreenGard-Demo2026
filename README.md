# Green-Gard · Smart-Garden Atelier (Sales Demo)

> Editorial Premium Brand-Demo für Green-Gard GmbH (Wiesbaden) — Vertriebs- und Handelshaus für professionelle Gartentechnik. Gebaut als Production-Grade-Pitch-Demo für 2026.

**Vibe:** Bose × Husqvarna × Aesop × Apple Product Pages.

---

## Was wurde gebaut

**8 Pages, vollständig verlinkt:**

| Route | Inhalt |
|---|---|
| `/` | Landing — Hero, Manifest, Disziplinen, Mini-Konfigurator, Systeme, Pull-Quote, Featured System, Brand-Wall, Kennzahlen, Stimmen, Handwerk-CTA, FAQ |
| `/kollektion` | Shop mit Disziplinen-, Hersteller-, Preis-Filter und 4 Sortierungen · 24 Produkte |
| `/kollektion/[slug]` | Produktdetail: Galerie, Mengen-Selector, B2B-Volumenrabatt, Tabs Beschreibung / Technik / Lieferung, Cross-Sell, Sticky-Bar mobile |
| `/systeme` | 3 Smart-Garden-Systeme (Sereno / Cortile / Sovereign), Vergleichstabelle, Detail-Sections |
| `/planung` | 7-Step-Konfigurator (Fläche · Quelle · Bewässerung · Steuerung · Robotik · Licht · Ergebnis) mit Stückliste, Email-Capture, Direkt-Add-to-Cart |
| `/atelier` | Termin-Booking: Berater + Datum + Slot + Form → ICS-Mock |
| `/checkout` | Lieferadresse, Versand (3 Optionen), Zahlung (4 Methoden, Rechnung nur B2B), MwSt-Aufschlüsselung, Success-Modal · Stripe ist als Mock markiert |
| `/handwerk` | B2B-Landing für GaLaBauer: 4 USPs, Mengenrabatt-Tabelle, Partner-Logos, Werkstattgespräch-Form |
| `/manifest` | Editorial Magazin-Lesepage mit Drop-Caps, Pull-Quotes, Brief vom Geschäftsführer |

**Globale Mechaniken:**

- **B2B/B2C-Switch** (Privat/Handwerk) im Header — schaltet **alle Preise** live um. Brutto inkl. 19% MwSt. ↔ Netto. B2B aktiviert zusätzlich automatische Volumenrabatte (5/10/15% ab 5/10/25 Stk pro Position) und schaltet Rechnungskauf frei.
- **Mappe** (Cart) als Slide-In, persistiert via Zustand + localStorage, mit Mengen-Selector und Toast-Confirm beim Hinzufügen.
- **Smooth Scroll** (Lenis) + **Custom Cursor** (GSAP quickTo) + **Magnetic Buttons** für Hero-CTA + **Grain Overlay** + **Loader** (1.5s nur beim ersten Visit der Session).
- **Editorial Type-System:** Fraunces (Headlines, italic-Akzente, Preise), Inter Tight (Body), JetBrains Mono (Eyebrows, Specs, Labels). Hero-Headline mit `clamp(56px, 9vw, 156px)` und char-by-char-Reveal via GSAP.

---

## Wie starten

```bash
pnpm install
pnpm dev   # → http://localhost:3000
pnpm build # Production-Build (durchgehender Type-Check)
```

Node ≥ 18, pnpm bevorzugt. `pnpm` ist im Lockfile als Manager gesetzt.

Mobile-Check: `375px / 768px / 1440px` — alle Pages stacken sauber. Custom-Cursor und Magnetic-Buttons sind auf Coarse-Pointers automatisch deaktiviert.

---

## Tech-Stack

- **Next.js 14** (App Router, TypeScript, statisch prerendered wo möglich)
- **Tailwind CSS** mit Custom-Color-Tokens (forest/bark/moss/linen/paper/bronze/copper/ink/mist) statt brand.*
- **shadcn-style UI-Primitives** auf Radix (Button, Slider, Accordion, Dialog, Sheet, Tabs)
- **Framer Motion** für Section-Reveals, Slider-Transitions, Loader
- **GSAP + Lenis** für Hero-Reveal, Magnetic Buttons, Custom Cursor, Smooth Scroll
- **Zustand + persist** für Mappe und B2B/B2C-Mode
- **React-Hook-Form + Zod** für Atelier, Handwerk, Checkout
- **Lucide Icons**

Alle Daten in `data/*.json` (Products, Pakete, Categories, Testimonials). Keine DB, keine Auth.

---

## Struktur

```
app/
  ├ page.tsx              Landing
  ├ kollektion/page.tsx   Shop
  ├ kollektion/[slug]/    Produktdetail (SSG für alle 24 Produkte)
  ├ systeme/              Pakete
  ├ planung/              Multi-Step-Konfigurator
  ├ atelier/              Termin-Booking
  ├ handwerk/             B2B-Landing
  ├ checkout/             Mock-Stripe
  ├ manifest/             Editorial-Story
  ├ layout.tsx
  └ globals.css
components/
  ├ ui/                   shadcn-style Primitives
  ├ Header.tsx, Footer.tsx
  ├ Hero.tsx              GSAP char-reveal, Live-Stempel
  ├ BewaesserungsRechner  Inline-Mini-Konfigurator
  ├ CategoryGrid, FeaturedSystem, BrandWall (Marquee), Stats (CountUp),
    TestimonialSlider, FAQ, PullQuote, ManifestIntro, CTABanner
  ├ ProductCard, PaketCard
  ├ B2BSwitch, CartDrawer, Eyebrow
  ├ Cursor, MagneticButton, SmoothScroll, Grain, Loader
data/
  ├ products.json         24 Produkte mit realistischen Specs
  ├ pakete.json           3 Systeme (Sereno / Cortile / Sovereign)
  ├ testimonials.json     5 echte Kundenstimmen
  └ categories.json
lib/
  ├ pricing.ts            B2B/B2C-Logik + Mengenrabatt
  ├ konfigurator.ts       Empfehlungs-Algorithmus
  └ utils.ts
store/
  └ cart.ts               Zustand mit localStorage-Persist
```

---

## Vor Live-Schaltung integrieren

| Bereich | Was fehlt | Wo |
|---|---|---|
| **Stripe** | Echter Payment-Intent + Webhook-Handler. Aktuell zeigt der Klick auf "Jetzt kaufen" ein Success-Modal. | `app/checkout/page.tsx` (Marker `// TODO: Stripe Payment Intent`) + `app/api/checkout/route.ts` neu anlegen + `STRIPE_SECRET_KEY` als ENV |
| **Email** | Email-Capture im Mini-Konfigurator und in Planung/Atelier zeigen nur einen Success-State. Resend / Postmark / SendGrid einbinden. | Form-Submit-Handler in `BewaesserungsRechner`, `app/planung`, `app/atelier`, `app/handwerk` |
| **CMS** | Produkte, Pakete, Testimonials, Manifest-Texte aus `data/*.json` → Sanity / Contentful / Strapi | `data/*.json` → CMS-Fetcher in `lib/data.ts` |
| **Auth + B2B-Verifikation** | Echter B2B-Modus braucht USt-ID-Verification (VIES) + Login. Aktuell ist B2B nur ein UI-Toggle. | NextAuth + neue Route `/api/verify-vat` |
| **Analytics** | Plausible oder PostHog für Funnel-Tracking (Hero → Konfigurator → Mappe → Checkout). | `app/layout.tsx` Script-Tag + Custom-Events in CTAs |
| **ICS-Download Atelier** | Aktuell nur `alert()`. ICS-Generator via `ics` npm-Package serverseitig. | `app/api/calendar/route.ts` |
| **Bilder** | Unsplash-URLs als Platzhalter. Eigenes Hero-Material + Produkt-Stills (clean weiß) ersetzen. | Alle `images.unsplash.com`-Quellen |
| **SEO** | OG-Images, JSON-LD Product-Schema, sitemap.xml | `app/sitemap.ts` + Metadata pro Page |

---

## Sales-Funnel-Mechaniken (für den Pitch)

Die Demo ist **kein bloßer Shop** — sie ist ein **Lead-Engine + Editorial-Brand-Page + Self-Service-Shop** in einem. Folgende Mechaniken konvertieren auf verschiedenen Stufen:

### Top-of-Funnel (Awareness)
1. **Hero mit char-by-char-Reveal** — Awwwards-Niveau-Eindruck in 2 Sekunden. Premium-Signal noch bevor der User scrollt.
2. **Manifest-Intro mit Drop-Cap** — verkauft die Marke, nicht das Produkt. Erzeugt Vertrauen für die Premium-Preise weiter unten.
3. **Brand-Wall Marquee** — riesige Markennamen, fungiert als Social Proof und Trust-Booster (Rainbird, Hunter, Netafim, Pedrollo, Kress, Husqvarna, In-Lite).

### Mid-Funnel (Interest → Consideration)
4. **Mini-Konfigurator im Hero-Bereich** — User gibt 3 Daten → bekommt sofort ein konkretes Paket + Preis. Keine Wand, keine PDFs. Live-Reaktion.
5. **Email-Capture im Mini-Konfigurator** — "Detailplan per Mail". Lead-Magnet, der nicht aufdringlich ist.
6. **Editorial Featured System (Kress)** — verkauft ein 2.890€-Produkt mit Spec-Sheet im Mono-Font wie ein Premium-Manual. Hebt Margenstärkstes Produkt heraus.
7. **Pull-Quote-Sections** — geben dem User Pausen und vermitteln Markenhaltung.

### Decision (Konfiguration → Cart)
8. **7-Step-Konfigurator (`/planung`)** — strukturiert komplexe Anforderungen, gibt am Ende eine vollständige Stückliste **+ 3 CTAs**: "Komplett kaufen", "Plan per Mail", "Termin im Atelier". Drei Lead-Qualitätsstufen abgedeckt.
9. **Vergleichstabelle der Systeme** — beseitigt Entscheidungs-Reibung.
10. **Cross-Sell auf Produktdetail** — "Komplettiere dein Setup" mit 3 kategoriepassenden Artikeln.

### Conversion (Checkout)
11. **B2B/B2C-Switch** — adressiert beide Zielgruppen ohne separate Site. B2B sieht direkt Netto + automatische Mengenrabatte + Rechnungskauf.
12. **3 Versandoptionen** inkl. "Direktfahrt Wiesbaden 19€" — regionaler USP, der den lokalen Markt anzieht.
13. **Mock-Stripe-Checkout** — vollständige UI inkl. SEPA / Karte / Rechnung / Vorkasse. Hürdenfrei.

### Bottom-Funnel (Hochpreisige Kunden + B2B)
14. **Atelier-Termin-Booking** — für Kunden, die nicht selbst klicken wollen. 3 Berater, Datum, Slot — bewusst kein klassisches "Kontaktformular".
15. **Handwerk-Landing (`/handwerk`)** — eigener Funnel für GaLaBauer: Konditionen, Mengenrabatt-Tabelle, Partner-Liste, Werkstattgespräch-Form.
16. **Manifest-Page (`/manifest`)** — "Brief vom Geschäftsführer" verkauft Vertrauen bei Großprojekten (5.000€+).

### Retention / Trust-Layer
17. **Stimmen-Section mit echten Wiesbadener Kunden** — Glaubwürdigkeit durch konkrete Namen.
18. **Kennzahlen-CountUp** — 20+ Jahre, 500 Beratungen, 450 Projekte, 3 Tage Lieferzeit. Hart, ohne Marketing-Sprech.
19. **FAQ** — 6 ehrliche Fragen statt 30 SEO-FAQ. Beantwortet die kritischen Einwände (Installation, Beratungs-Kosten, Mähroboter ohne Draht, Winter).

**Multi-Touchpoint:** Ein User landet im Hero, spielt mit dem Mini-Konfigurator (5 Sek Engagement), liest die Manifest-Section, sieht Kennzahlen, scrollt zu Testimonials — und nimmt entweder den Atelier-Termin, schickt sich den Plan per Mail oder kauft direkt das Sereno-Paket. Drei Lead-Stufen, eine Site.

---

## Demo-Hinweise für den Pitch

- **Loader beim ersten Besuch** zeigt nur einmal pro Session — `sessionStorage` löscht beim Tab-Close. Für die Demo: Inkognito öffnen oder `sessionStorage.clear()` in der DevTools-Console.
- **B2B/B2C-Toggle** lebt im Header rechts oben (Desktop) bzw. unter dem Mobile-Menü. Hin- und herklicken zeigt Live-Preisänderung auf jeder Seite.
- **Cursor + Magnetic Buttons** funktionieren nur mit Maus-Eingabe — Touch/Tablet sind absichtlich auf Standard-Verhalten.
- **24 Produkte** in der Kollektion sind alle einzeln aufrufbar und SSG-prerendered für Top-Performance.

---

© 2026 — Demo für Green-Gard GmbH, Wiesbaden.
