# Offene Punkte — was noch von Green Gard kommen muss

Stand: 03.08.2026 · Ansprechpartner: Jan Leifermann

Die Demo läuft vollständig mit Platzhaltern, wo echte Inhalte fehlen. Jede Zeile
hier zeigt auf die Stelle im Code, an der der finale Inhalt eingesetzt wird —
tauschen heißt in fast allen Fällen: eine Datei ersetzen, kein Umbau.

---

## A · Blockiert den Livegang

| # | Punkt | Warum nötig | Landet in |
|---|---|---|---|
| A1 | **Shop-Adresse** | Der Menüpunkt „Shop" zeigt aktuell auf die Hauptdomain. Ohne echte URL läuft der Kaufweg ins Leere. | `lib/links.ts` → `SHOP_URL` |
| A2 | **Logo als Vektor** (SVG oder AI/EPS) | Wir haben das Logo aus dem Bildmaterial nachgebaut. Für Druckschärfe auf Retina und im Footer brauchen wir die Originaldatei. | `public/logo-green-gard.svg` |
| A3 | **Preise Starter Kits** | Die „ab"-Preise der fünf Kits sind geschätzt. Falsche Preise auf einer Live-Seite sind ein rechtliches Thema. | `data/starter-kits.json` → `abPreis` |
| A4 | **Montagekosten** | Der Planungsrechner weist bisher nur Material aus (400 € + 2,50 €/m² aus eurer Liste). Ohne Montagesatz bleibt die Endsumme unvollständig. | `lib/preise.ts` |

## B · Inhalte

| # | Punkt | Status heute |
|---|---|---|
| B1 | **Teamfotos in Originalauflösung** | Wir haben die sechs Porträts von green-gard.de übernommen (ca. 900 px). Für die großen Kacheln wären die Originaldateien besser. Zwei Bilder sind S/W, vier in Farbe — die Seite zieht sie deshalb einheitlich in Graustufen. Wenn ihr das anders wollt: kurz sagen. |
| B2 | **Katalog, restliche 7 Abschnitte** | Von acht Abschnitten ist einer als Daten eingepflegt („Bewässerung — Tropf & Mikro", `knowledge/green-gard/`). Der Rest ist im Blätterkatalog sichtbar, aber nicht durchsuchbar. |
| B3 | **Rainworks-Text** | Platzhalter. Wir haben eine Fassung geschrieben, die inhaltlich stimmen dürfte — bitte gegenlesen oder ersetzen. `app/warum-green-gard/page.tsx` |
| B4 | **Erklärvideos** (YouTube-IDs) | Learning Center und die geschützte Projektseite zeigen Kacheln ohne Video. Es genügen die YouTube-Links. |
| B5 | **Schulungen: Termine, Dauer, Preise, Plätze** | Aktuell Beispieldaten. `data/schulungen.json` |
| B6 | **Freigaben Herstellerlogos** | Hunter, Rainbird, Netafim, Pedrollo, Kress, In-Lite, Bayrol, Beatbot erscheinen als Wortmarken. Falls einer davon eine Freigabe braucht, bitte melden. |
| B7 | **Quelle der Bewertungen** | Der Bewertungs-Feed ist mit Beispieltexten gefüllt. Google Reviews oder ProvenExpert — beides anbindbar, wir brauchen nur die Entscheidung. |

## C · Zugänge und Technik

| # | Punkt |
|---|---|
| C1 | **Supabase** — Projekt anlegen, dann laufen Login, Profi-Konto, Anfragen und Projekte gegen echte Daten statt gegen die Demo-Datei. |
| C2 | **Stripe** — nur für die Schulungsbuchung nötig (Produktverkauf läuft über den externen Shop). |
| C3 | **Resend o. ä.** — Versand der Formulare an `info@green-gard.de`. Bis dahin zeigt die Seite die Bestätigung nur an, sie verschickt nichts. |
| C4 | **Domain / Subdomain** für den Livegang. |

## D · Entscheidungen, die nur ihr treffen könnt

| # | Frage |
|---|---|
| D1 | **Bezugsgröße der Preisliste**: Beziehen sich die 400 € + 2,50 €/m² auf die Grundstücks- oder auf die zu bewässernde Fläche? Der Rechner rechnet aktuell mit der Grundstücksfläche. |
| D2 | **Tonalität**: Die Texte spielen bewusst auf „Garten als Aufenthaltsraum", nicht auf Technikkatalog. Passt die Richtung, oder soll es sachlicher werden? |
| D3 | **Zuständigkeiten**: Aus eurer Teamseite haben wir übernommen — Jan: Beleuchtung (In-Lite), Nicolas: Bewässerung (Hunter Hydrawise). Auf der Beratungsseite stehen deshalb Jan, Nicolas und Thomas als Ansprechpartner. Richtig so? |

---

## Bewusst so umgesetzt — bitte nicht als Lücke lesen

- **Keine Preisnachlässe irgendwo auf der Seite.** Konditionen werden je Kunde
  vereinbart (Kooperationsvertrag bzw. Abstimmung). Es gibt keine Rabatttabelle —
  auch nicht versteckt im Quelltext. Profi-Einkaufspreise erscheinen ausschließlich
  nach Login im eigenen Konto.
- **Keine Durchwahlen.** Nur die Zentrale `+49 6122 95895-30`, wie besprochen.
  Persönliche Mailadressen stehen beim Team, Telefonnummern nicht.
- **Keine Rollenbezeichnungen** in der Teamsektion (Wunsch aus dem Termin am
  28.07.2026). Die Funktionen sind in `data/team.json` hinterlegt, falls ihr es
  euch anders überlegt — dann ist es eine Zeile Arbeit.
- **Pflanzenkölle** wird nirgends verlinkt oder erwähnt. Die Seite existiert unter
  `/pflanzenkoelle`, ist für Suchmaschinen gesperrt und nur über den direkten Link
  erreichbar.
- **Kein Produktverkauf über die Seite.** Der Warenkorb ist ausschließlich für
  Schulungen da, alles andere führt in den Shop.
