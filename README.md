# Green-Gard — Website-Demo V2

> Editorial-Premium-Demo für die Green Gard GmbH, Wiesbaden.
> Stand: V3 nach dem Termin vom **31.07.2026** mit Jan Leifermann.

**Die Website verkauft keine Produkte — sie erklärt, plant und schult.** Verkauft wird
im bestehenden Shop. Diese Entscheidung aus dem Termin vom 31.07.2026 trägt die
gesamte Struktur: Planungstool ganz vorn, Warenkorb ausschließlich für Schulungen,
Shop als externer Reiter.

---

## Was aus dem Termin vom 31.07.2026 umgesetzt ist

| Entscheidung | Umsetzung |
|---|---|
| **Keine Produktverkäufe** — Doppelbestellungen in zwei Systemen vermeiden | Produkt- und Kit-Karten verlinken in den Shop (`SHOP_URL`), kein „In den Warenkorb" mehr, Shop als eigener Reiter in Navigation und Footer |
| **Warenkorb bleibt für Schulungen** | „Platz buchen" legt Schulung samt Termin in den Warenkorb, Kasse ist auf Teilnehmerdaten und Schulungsort umgestellt (kein Versand) |
| **Planungstool IRRISketch einbinden** | `/planung` startet mit dem Tool: Sechs-Schritte-Ablauf, 24–48 h Zusage, Button auch im Hero und im Footer. Reiner Link, keine API — jeder Aufruf startet ein neues Projekt |
| **Learning Center gegen Support-Anrufe** | `/learning-center` mit filter- und durchsuchbarer Videothek, Dialog-Player, für die Baustelle aufs Handy ausgelegt |
| **Anfragen kategorisieren, zentral an info@** | Themenauswahl (Bewässerung, Beleuchtung, Pumpentechnik, Pool, Mähroboter) auf `/beratung`; alles läuft an die zentrale Adresse statt an Einzelpersonen |
| **Pflanzenkölle-Sonderseite** | `/pflanzenkoelle` mit Projektformular (12 Filialen inkl. Kostenstelle und Adress-Nr.), `noindex`, nirgends verlinkt — Wettbewerbsschutz |
| **Logo einbauen** | Doppelbogen-Signet und zweifarbige Wortmarke als SVG, dazu eine Variante mit Claim |
| **Katalog: 14 MB bremsen die Seite** | Der Preiskatalog 2025/26 liegt als 1000°-Blätterkatalog beim Anbieter und lädt erst auf Klick — nichts davon im Auslieferungspaket |
| **Katalog war zu dunkel** | Katalogkopf auf Linen umgestellt |

---

Bewässerung, Steuerung, Pumpentechnik, Beleuchtung, Robotik, **Pool** und Zubehör —
mit Entry-Fenster für GaLaBau/Architekten, Privatkunden und Händler.

---

## Schnellstart

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # Produktions-Build (läuft ohne jede env var durch)
pnpm start    # Produktions-Server
```

Node ≥ 18. Es sind **keine** Environment-Variablen nötig: Supabase, Stripe und
Mailversand laufen bis zur echten Anbindung in dokumentierte Mock-Zweige
(`console.info` + Success-State im UI). `.env.example` zeigt, was später gesetzt wird.

---

## Was in V2 neu ist

| Block | Änderung |
|---|---|
| 1 | Begriffe und Routen: **Produkte**, **Starter Kits**, **Planung**, **Beratung & Schulungen**, **Warum Green-Gard**, **Warenkorb**. `/profi` ist aus der Hauptnavigation raus. Alle alten Routen leiten per 308 weiter. |
| 2 | **Hero-Video** vom Kunden (Aufsteiger-Regner): Desktop autoplay/loop/stumm, Mobile nur Poster, `prefers-reduced-motion` respektiert. |
| 3 | **Entry-Fenster** beim Erstbesuch: **GaLaBau / Architekt · Privat · Händler** plus Login für bestehende Profi-Zugänge. Die Auswahl steuert Preisansicht, Navigation, Schnelleinstiege und die Vorbelegung im Konditionsformular. Persistiert in localStorage, jederzeit über Header, Schnelleinstiegs-Leiste oder Footer wechselbar. |
| 4 | **Logo** als SVG-Wortmarke im Header (Platzhalter bis zum Kundenlogo). |
| 5 | **Starter Kits** statt Festpreis-Pakete: vier Kits mit „ab“-Preis, kein „In den Warenkorb“, CTAs `Planung starten` / `Kit anfragen`. |
| 6 | **Planung** auf 3 Kernfragen + WLAN reduziert (Mähroboter- und Licht-Add-ons entfernt). Mini-Kalkulator auf der Landing nutzt dieselbe Logik. Die Preise kommen aus **Jans Liste** (siehe unten). |
| 7 | **Pool** als siebte Disziplin: Bayrol-Wasserpflege und Beatbot-Roboter, 7 Produkte. |
| 8 | **Highlights-Section** „Neu im Sortiment“, kuratiert über `data/highlights.json`. |
| 9 | **Warum Green-Gard**: Gründungsjahr **2006** projektweit, Team-Grid ohne Rollenbezeichnungen mit persönlichen Mailadressen, Rainworks-Section, Brief des Geschäftsführers. |
| 10 | **`/profi`** als Lead-Gate für den Konditionskatalog inkl. Gewerbe-Art. |
| 11 | **Kontaktdaten zentral** in `lib/contact.ts`: eine Rufnummer mit Endung -30, keine Durchwahlen mehr. |
| 12 | **Bewertungs-Feed** mit Sterne-Filter (Alle / 5★ / 4★), Sterne in Copper, Schnitt „4,9 von 5 · 27 Bewertungen“. |
| 13 | **Schulungen** auf `/beratung`: drei Kurse mit Terminen, Platzbuchung mit Hinweis auf Zahlungslink. |
| 14 | **Supabase vorbereitet**: Client mit Graceful Fallback, `supabase/schema.sql`, `/login`. |
| 16 | **Katalog-Hinweis** auf `/produkte`: tagesaktuelle Preise, kein gedruckter Katalog 2026 — stattdessen der digitale Katalog unter `/katalog`. |

---

## Seiten

| Route | Inhalt |
|---|---|
| `/` | Hero-Video, Haltung, 7 Disziplinen, Highlights, Mini-Kalkulator, Starter-Kit-Teaser, Pull-Quote, Kress im Fokus, Partner-Marquee, Kennzahlen, Bewertungen mit Filter, Profi-CTA, FAQ |
| `/katalog` | **Digitaler Katalog 2026**: sieben Kapitel als Doppelseiten, mitlaufendes Register, Volltextsuche per ⌘K, Druckansicht · 31 Artikel |
| `/produkte` | Shop-Ansicht mit Disziplin-, Hersteller- und Preisfilter, 4 Sortierungen, Verweis auf den Katalog · 31 Artikel |
| `/produkte/[slug]` | Produktdetail mit Technik-Tab, Cross-Sell, Sticky-Warenkorb auf Mobile (statisch vorgerendert) |
| `/starter-kits` | Vier Kits, Vergleichstabelle, Detail-Sections, „ab“-Preise |
| `/planung` | **IRRISketch-Planungstool** mit Sechs-Schritte-Ablauf, darunter der Kostenrechner (Fläche · Wasserquelle · Bereiche · WLAN) mit Stückliste |
| `/learning-center` | Videothek mit Filter, Suche und Dialog-Player — gegen Support-Anrufe |
| `/pflanzenkoelle` | Geschützte Projektseite für den Großkunden: Standortwahl, vollständiges Technikformular, `noindex`, nicht verlinkt |
| `/beratung` | Terminbuchung mit Ansprechpartner-Auswahl und ICS-Mock + Schulungsbereich |
| `/warum-green-gard` | Editorial-Lesestrecke, Team mit echten Porträts, Rainworks-Anriss, Brief des Geschäftsführers |
| `/rainworks` | Die Rainworks Alliance — Inhalte 1:1 von green-gard.de/rainworks, inkl. Mitgliederkarte und Struktur-Diagramm |
| `/profi` | Konditionen, Partner, Lead-Gate für den Konditionskatalog (Nachlässe werden individuell vereinbart, nicht angezeigt) |
| `/checkout` | Adresse, drei Versandarten, vier Zahlarten (Rechnung nur für Profi), MwSt-Aufschlüsselung, Mock-Abschluss |
| `/login` | Anmeldung, vorbereitet für Supabase Auth |

Alte Routen (`/kollektion`, `/systeme`, `/atelier`, `/manifest`, `/handwerk`,
`/shop`, `/pakete`, `/konfigurator`, `/b2b`) leiten dauerhaft auf die neuen.

---

## Architektur

```
app/                     Routen (App Router, überwiegend statisch vorgerendert)
components/              Editorial-Bausteine + components/ui (shadcn-Stil auf Radix)
components/katalog/      Digitaler Katalog: Kapitel, Register, ⌘K-Suche
components/AudienceGate  Entry-Fenster: Zielgruppe + Login
components/AudienceBar   Schnelleinstiege je Zielgruppe unter dem Hero
components/LoginForm     Anmeldung, genutzt im Fenster und auf /login
components/EntryExperience  entscheidet Fenster vs. Loader vs. nichts
lib/audience.ts          Zielgruppen: Preisansicht, Nav, Links, Formular
data/*.json              Produkte, Kategorien, Starter Kits, Highlights,
                         Bewertungen, Team, Schulungen
lib/data.ts              typisierter Zugriff auf die Daten — der einzige Ort,
                         der beim CMS-Wechsel angefasst werden muss
lib/pricing.ts           Privat (brutto) / Profi (netto + Staffel)
lib/konfigurator.ts      Planungslogik, dokumentierte Faustformel
lib/preise.ts            echte Preisliste: Material nach Fläche + Quelle
lib/contact.ts           zentrale Kontaktdaten, Gründungsjahr
lib/links.ts             externe Ziele: IRRISketch, Shop, Blätterkatalog, Social
lib/supabase.ts          Client + Mock-Fallback
store/cart.ts            Warenkorb + Preisansicht (localStorage)
store/ui.ts              Entry-Status für den Hero-Reveal
supabase/schema.sql      leads · profiles · schulung_buchungen inkl. RLS
public/videos/           web-optimiertes Hero-Video + Poster
public/img/gate/         Illustrationen der drei Zielgruppen im Entry-Fenster
public/img/              Illustrationen für Disziplinen, Produkte, Kits
```

**Design-System:** Fraunces (Headlines, Preise), Inter Tight (Body, 17px),
JetBrains Mono (Eyebrows, technische Daten). Farben forest / bark / moss / linen /
paper / bronze / copper / ink / mist. Preise laufen in Fraunces mit Tabellenziffern,
technische Werte in Mono — die Trennung ist bewusst.

**Preisbasis im Kalkulator** (`lib/preise.ts`): Liste von Jan Leifermann,
"Gartenfläche.docx" vom 30.07.2026. Materialkosten netto bei Hauswasseranschluss
von 100 m² (650 €) bis 1.500 m² (4.150 €) — alle 15 Stützpunkte liegen exakt auf
**400 € + 2,50 €/m²**, deshalb rechnet der Kalkulator mit dieser Formel.
Zuschläge: **Zisterne + 1.000 €** (nur Technik, ohne Zisterne), **Brunnen + 900 €**
(ohne Bohrung). Über 1.500 m² wird linear fortgeschrieben und der Nutzer darauf
hingewiesen. Angezeigt werden Materialkosten ohne Montage; Privatkunden sehen die
Werte brutto. Ein automatisierter Test prüft alle Listenwerte gegen die Oberfläche.

**Digitaler Katalog** (`/katalog`): Das Sortiment als Katalog statt als Filterliste —
sieben Kapitel, jedes mit stehendem Disziplinenbild und Artikelregister
(laufende Nummer, Marke, technische Kernangabe, Preis). Links läuft das
Inhaltsverzeichnis mit und hebt das aktuelle Kapitel hervor (IntersectionObserver,
kein Scroll-Listener); auf schmalen Displays wird daraus eine Fortschrittsleiste.
Die Volltextsuche öffnet mit **⌘K / Strg+K**, sucht über Name, Marke, Disziplin und
technische Daten, ist umlauttolerant ("mahroboter" findet Mähroboter) und komplett
per Tastatur bedienbar. Statt eines PDFs, das beim Erscheinen veraltet, gibt es eine
Druckansicht der Seite (Print-Styles in `globals.css`).

**Hero-Video:** Original (11,2 MB, 1080p, mit Ton) enthält drei Schnitte. Beide
harten Cuts sind übergeblendet, das Ende blendet auf den Anfang — ein ruhiger
7,4-Sekunden-Loop ohne Ton:
`hero-regner.mp4` 1,9 MB · `hero-regner.webm` 1,1 MB · `hero-poster.jpg` 99 KB.
Das Originalmaterial liegt in `assets-input/` und ist per `.gitignore` ausgenommen.
Neu erzeugen lässt sich das mit den ffmpeg-Befehlen aus dem V2-Briefing.

---

## Vor der Live-Schaltung

| Thema | Was fehlt | Wo |
|---|---|---|
| **Supabase** | Projekt anlegen, env vars setzen, `supabase/schema.sql` ausführen, RLS prüfen. Danach Mock-Zweige in `/profi`, `/beratung` und `/login` gegen echte Inserts tauschen. | `lib/supabase.ts`, `.env.example` |
| **Stripe** | Payment Intent für den Shop-Checkout, Payment Links für Schulungstermine, Webhook-Route. | `app/checkout/page.tsx` (`// TODO: Stripe Payment Intent`), `app/beratung/Schulungen.tsx` |
| **E-Mail** | Resend anbinden: Lead-Benachrichtigung, Konditionskatalog-PDF, „Plan per Mail“, Terminbestätigungen. | `lib/supabase.ts`, `BewaesserungsRechner`, `app/planung`, `app/beratung` |
| **CMS** | Produkte, Kits, Bewertungen, Team, Schulungen aus `data/*.json` in ein CMS überführen. | `lib/data.ts` (einziger Umschaltpunkt) |
| **Auth** | Profi-Freischaltung: USt-ID prüfen, `profiles.freigeschaltet` setzen. Nach echtem Login sollte die Zielgruppe aus dem Profil kommen, statt im Fenster erfragt zu werden. | `components/LoginForm.tsx`, `app/login/page.tsx` |
| **Analytics** | Plausible oder PostHog inkl. Funnel-Events (Gate-Auswahl → Planung → Kit-Anfrage → Lead). | `app/layout.tsx` |
| **ICS** | Echte Kalenderdatei statt `alert()` beim Beratungstermin. | `app/beratung/BeratungBooking.tsx` |
| **SEO** | OG-Bilder, JSON-LD (Product, LocalBusiness), `sitemap.ts`, `robots.ts`, Impressum/Datenschutz/AGB. | `app/` |

### Offene Punkte, die Kunden-Input brauchen

- **Logo-Datei** — aktuell SVG-Wortmarke als Platzhalter (`public/logo-green-gard.svg`)
- **Team** — echte Namen, Fotos und Mailadressen (`data/team.json`, aktuell 6 Platzhalter)
- **Rainworks** — finaler Text für die Partnerschafts-Section
- **Rufnummer** — bestätigen, dass `+49 6122 95895-30` die richtige Sammelnummer ist (abgeleitet aus Jans Durchwahl -34)
- **Shop-Adresse** — `SHOP_URL` in `lib/links.ts` zeigt vorläufig auf die Hauptdomain
- **YouTube-IDs** — `data/videos.json` trägt Platzhalter; der Dialog zeigt solange einen Hinweis statt fremder Inhalte
- **Zuständigkeiten** — welches Thema geht intern an wen (Beleuchtung → Jan, Bewässerung → Nick, …)
- **Logo-Vektordatei** — die Wortmarke ist derzeit gesetzter Text, keine Pfade
- **„Luxus"-Wording** — im Termin ausdrücklich zur Disposition gestellt; Alternative wäre die Fachberater-Tonalität aus dem Claim „Technik für Gärten und Grünflächen"
- **Bezugsgröße der Preisliste** — bezieht sich "Gartenfläche" auf das Grundstück oder auf die bewässerte Fläche? Der Kalkulator rechnet mit der bewässerten Fläche
- **Montagekosten** — die Liste enthält nur Material; für einen Komplettpreis fehlen Stundensätze oder Pauschalen
- **Markenfreigabe** — Bayrol und Beatbot bestätigen (Schreibweise, Sortimentstiefe, Preise)
- **Eigenmarke** — Kabel und Klemmverbinder laufen jetzt als „Green-Gard" statt als „Generic"; bitte bestätigen
- **Katalogdaten** — der Produktkatalog von Jan lag der Session nicht bei. Artikel und Produktfotos daraus füllen `data/products.json` und `public/img/prod/`; die Katalogseite zieht sie automatisch
- **Starter-Kit-Preise** — belastbare „ab“-Preise und Komponentenlisten von Jan
- **Schulungen** — Preise, Termine, Teilnehmerzahlen und das Zahlungskonzept (folgt in 2–4 Wochen)
- **Bewertungen** — Quelle festlegen: Google Reviews API oder ProvenExpert-Embed
- **Bildmaterial** — eigene Fotos statt der Illustrationen für Disziplinen und Produkte

---

## Shop-Domain-Strategie

Der Kunde sichert eine separate Shop-Domain. Aufgeteilt ist hier bewusst noch
nichts — drei Optionen:

**1. Alles auf green-gard.de — Empfehlung.**
Ein Auftritt, eine Session, ein Login. Die SEO-Kraft bleibt auf einer Domain,
Content und Shop stärken sich gegenseitig. Änderungsaufwand: null.

**2. `shop.green-gard.de` als Subdomain, gleiche App.**
Marketing und Shop lassen sich getrennt kommunizieren, technisch bleibt es ein
Projekt (Middleware-Routing, Cookies auf `.green-gard.de` → Login gilt für beides).
Aufwand gering, SEO-Nachteil klein.

**3. Eigene Domain, eigenes Deployment.**
Nur sinnvoll, wenn es organisatorisch sein muss. Nachteile: zweite Auth-Domäne,
doppelte Rechtstexte, aufgeteilte SEO-Signale, doppelte Pflege.

Die Anforderung „B2B-Kunden sollen sich nicht mehrfach anmelden“ spricht klar für
Option 1 oder 2. Empfehlung: **Option 1 starten, Option 2 bleibt jederzeit möglich**,
weil beide dieselbe Codebasis nutzen.

---

## Sales-Mechaniken (für den Pitch)

1. **Entry-Fenster mit drei Zielgruppen** — GaLaBau/Architekt, Privat und Händler
   werden in der ersten Sekunde getrennt. Danach passt alles: Preise (netto oder
   brutto), Navigation (Konditionen nur für Profis), Schnelleinstiege unter dem
   Hero und die Gewerbe-Art im Konditionsformular. Eine Website, drei Masken.
   Wer schon einen Zugang hat, meldet sich direkt im Fenster an.
2. **Hero-Video** — echtes Material des Kunden, keine Stock-Optik.
3. **Mini-Kalkulator auf der Landing** — drei Fragen, sofort ein Kit mit Preisrahmen.
   Kein Kontaktzwang, kein PDF-Download.
4. **„ab“-Preise statt Festpreise** — nennt eine belastbare Größenordnung und führt
   in die kostenlose Systemplanung, statt später nachverhandeln zu müssen.
5. **Drei Ausstiege am Planungsende** — Termin, Plan per Mail, Kit ansehen. Deckt
   heiße, warme und kalte Interessenten ab.
6. **Lead-Gate `/profi`** — Konditionskatalog gegen Firmendaten inkl. Gewerbe-Art,
   damit der Außendienst vorqualifiziert anruft.
7. **Konditionen nur nach Login** — auf der Seite steht nirgends ein Nachlass.
   Wer Konditionen sehen will, meldet sich an; das qualifiziert und schützt die
   individuell vereinbarten Preise.
8. **Schulungen** — Zusatzumsatz und Kundenbindung: wer geschult ist, kauft
   Komponenten dort, wo er sie kennengelernt hat.
9. **Highlights-Section** — steuerbare Bühne für margenstarke Neuheiten
   (aktuell Beatbot, Kress, Hydrawise), pflegbar über eine JSON-Datei.
10. **Bewertungs-Filter** — auch 4★-Stimmen sind sichtbar. Das wirkt echter als
    eine reine Bestenliste und beantwortet Einwände (Terminfindung, Online-Zugang).
11. **Warum Green-Gard** — Editorial-Strecke für Projekte im fünfstelligen Bereich,
    wo Vertrauen und nicht der Preis entscheidet.
12. **Warenkorb bleibt Warenkorb** — Einzelteile sind sofort kaufbar, Systeme werden
    geplant. Die Trennung verhindert Fehlkäufe und schützt die Beratungsleistung.

---

© 2026 Green-Gard GmbH · Demo, keine Zahlungen, keine echten Datenübertragungen.
