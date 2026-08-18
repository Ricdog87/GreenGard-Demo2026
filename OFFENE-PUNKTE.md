# Offene Punkte — was noch von Green Gard kommen muss

Stand: **12.08.2026, nach dem Meeting mit Jan** · Die Punkte aus dem Meeting sind unten eingearbeitet.

## Aus dem Meeting vom 12.08.2026 — Jans Lieferungen

| # | Punkt | Für |
|---|---|---|
| M1 | **Msoft-API prüfen** (offene API für Bestellungen/Rechnungen) | Bestellhistorie im Dashboard automatisch statt Demo-Daten |
| M2 | ~~YouTube-Kanal-Link~~ | **Erledigt** (12.08.2026): Kanal gefunden und alle drei Videos eingebettet (Kress Nano 101e, Ladestation, RTK) — samt echten Thumbnails und Kanal-Link. Neue Videos: ein Eintrag in `data/videos.json`. |
| M3 | **Bestellbestätigungen (Alt-Daten)** bereitstellen | Historienanzeige für Pilotkunden |
| M4 | **5–10 Pilotkunden** auswählen (gemeinsam) | VIP-Freischaltung, Feedback, Konditions-Zuweisung validieren |
| M5 | **Social-Media-Links** (Instagram, LinkedIn) | Footer — aktuell Platzhalter |
| M6 | **Fotos + Highlight-Infos** für die Sortimentpräsentation | /produkte-Schaufenster |

## A · Blockiert den Livegang

| # | Punkt | Warum nötig | Landet in |
|---|---|---|---|
| A1 | **Shop-Adresse** | Entschärft (Meeting 18.08.2026): Alle Shop-Buttons stehen bis zum Shop-Start bewusst ohne Link auf „Bald verfügbar". Sobald der Shop live ist: Adresse eintragen und Buttons wieder verlinken. | `lib/links.ts` → `SHOP_URL` |
| A2 | **Logo als Vektor** (SVG oder AI/EPS) | Wir haben das Logo aus dem Bildmaterial nachgebaut. Für Druckschärfe auf Retina und im Footer brauchen wir die Originaldatei. | `public/logo-green-gard.svg` |
| A3 | ~~Preise Starter Kits~~ | **Hinfällig** (Meeting 12.08.2026): Die Website zeigt keine Produkt- und Paketpreise mehr — Preise pflegt allein der Shop. |
| A4 | **Montagekosten** | Der Rechner nennt jetzt ausdrücklich einen *unverbindlichen Material-Richtwert* mit Disclaimer (Meeting 12.08.2026). Ein Montagesatz ist damit optional — falls gewünscht, liefert Jan den Satz. | `lib/preise.ts` |

## B · Inhalte

| # | Punkt | Status heute |
|---|---|---|
| B1 | **Teamfotos in Originalauflösung** | Wir haben die sechs Porträts von green-gard.de übernommen (ca. 900 px). Für die großen Kacheln wären die Originaldateien besser. Zwei Bilder sind S/W, vier in Farbe — die Seite zieht sie deshalb einheitlich in Graustufen. Wenn ihr das anders wollt: kurz sagen. |
| B2 | **Katalog, restliche 7 Abschnitte** | Von acht Abschnitten ist einer als Daten eingepflegt („Bewässerung — Tropf & Mikro", `knowledge/green-gard/`). Der Rest ist im Blätterkatalog sichtbar, aber nicht durchsuchbar. |
| B3 | ~~Rainworks-Text~~ | **Erledigt.** Wortlaut 1:1 von green-gard.de/rainworks übernommen, eigene Seite unter `/rainworks`, Karte und Struktur-Diagramm inklusive. Offen bleibt nur: Gibt es die beiden Grafiken als Vektor oder in höherer Auflösung? Sie stammen aus dem Web-Export (1600 px). |
| B4 | **Erklärvideos** | Die drei Kanal-Videos sind eingebettet (siehe M2). Für die übrigen Themen (Ventil, Hydrawise, Vordruck …) fehlen weiterhin Aufnahmen — sobald ihr dreht, tragen wir nur die ID ein. |
| B8 | **Learning Center, Eintrag Nr. 85** | Auf eurer Seite steht dort als *Frage* die Antwort der vorherigen Frage („Verschleißteile sind alle dichtenden und rotierenden Elemente …"). Die Antwort darunter erklärt die Gleitringdichtung. Wir haben es unverändert übernommen — sagt kurz, wie die Frage lauten soll, dann korrigieren wir sie. |
| B5 | **Schulungen: Termine, Dauer, Plätze** | Angebot und Preise sind jetzt von eurer Trainingsseite übernommen (Fachschulung 159 €, Schulung im eigenen Betrieb 599 € ab sechs Personen, Expertentraining bei Köln/Stuttgart/Wiesbaden/München). Was fehlt: die konkreten Termine, die Dauer je Schulung und die Platzzahl. Solange die fehlen, steht auf der Seite „Termine auf Anfrage" — wir erfinden keine Daten neben echten Preisen. `data/schulungen.json` |
| B6 | **Bildrechte und Herstellerfreigaben** | Wir haben die Fotos von eurer Seite übernommen: sechs Disziplinbilder, 23 Produktbilder, acht Partnerlogos. Ein Teil davon ist Herstellermaterial (In-Lite, Husqvarna, Kress, Rain Bird, Pedrollo). Ihr zeigt es als autorisierter Händler bereits, trotzdem: Falls für einzelne Marken eine schriftliche Freigabe nötig ist oder ihr euch bei einem Bild unsicher seid, sagt Bescheid — dann tauschen wir es. Für den Livegang wären eigene Aufnahmen aus euren Projekten ohnehin stärker als Katalogbilder. |
| B7 | **Quelle der Bewertungen** | Die sechs Stimmen von eurer Seite sind übernommen, alle mit fünf Sternen. Für die Live-Anbindung brauchen wir die Entscheidung: Google Reviews oder ProvenExpert. Solange keine Quelle angebunden ist, stehen die Bewertungen ohne Datum aus einer echten Erhebung. |
| B9 | **Referenzbetriebe** | Auf `/profi` stand eine erfundene Liste von Partnerbetrieben — die ist raus und durch die belegbare Herstellerliste ersetzt. Wenn ihr echte Referenzkunden nennen dürft, liefert uns die Namen samt Freigabe, dann bauen wir sie ein. |
| B10 | **Karriere / Stellenmarkt** | Eure Seite führt eine ausgeschriebene Stelle (Fachberater Vertrieb, Wiesbaden-Delkenheim, Vollzeit). Auf der neuen Seite gibt es dafür noch keinen Platz. Soll eine Karriereseite mit rein? |
| B12 | **Bilder, die noch fehlen** | Ohne echtes Foto sind acht Artikel: Speck BADU, die beiden Beatbot-Poolroboter und die fünf Bayrol-Pflegeprodukte — für die hat eure Seite nichts. Ebenso die Disziplin Pool und die vier Starter Kits. Dort steht weiter unsere Illustration. Ein paar Handyfotos aus dem Lager würden genügen. |
| B11 | **Reklamation und Garantieantrag** | Eure Seite hat dafür eigene Formulare. Wollt ihr die auf der neuen Seite ebenfalls, oder läuft das künftig über das zentrale Anfrageformular? |

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
| D4 | **Planungsgebühr sichtbar?** Auf der neuen Seite stehen jetzt die 120 € und der Hinweis, dass sie mit dem Material verrechnet werden. Vorher stand dort pauschal „kostenlose Planung". Wir halten die ehrliche Variante für besser — sie verhindert die Überraschung beim ersten Angebot. Falls ihr das anders seht, ist es eine Zeile. |
| D5 | **Schulungspreise brutto oder netto?** 159 € und 599 € zeigen wir Profis netto, Privatpersonen brutto. Falls die Zahlen auf eurer Seite schon Bruttopreise sind, sagt kurz Bescheid. |
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

## Neu aus dem Meeting — noch offen auf unserer Seite

| # | Punkt |
|---|---|
| R1 | **Office-365-Anbindung** für E-Mail-Empfang der Formulare — braucht Zugangsdaten/Setup von Green Gard (alternativ Resend, siehe C3). |
| R2 | **CRM-/Lead-Tracking** (Interesse an Kategorien tracken, Abbruch-Mails): Konzept besprochen, Umsetzung nach Livegang und nur mit Datenschutz-Klärung. |
| R3 | **Anreiz-System** (Geschenke/Vorteile ab Umsatzziel, z. B. 10.000 €): Idee von Jan fürs Dashboard — braucht die Msoft-Daten (M1) als Grundlage. |
