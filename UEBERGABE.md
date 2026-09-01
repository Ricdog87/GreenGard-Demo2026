# Übergabe & Go-Live — Green-Gard Website

Stand: **18.08.2026**
Live-Stand: https://green-gard-demo2026.vercel.app

---

## Status der Meeting-Punkte vom 18.08. (Ricardo)

| Punkt | Status |
|---|---|
| Privat-Button entfernen | ✅ erledigt — Privat ist stille Standardansicht |
| Login/Registrierung komplett entfernt (Feedback 18.08. nachmittags) | ✅ erledigt — Profis stellen die Konditions-Anfrage auf /profi (Kontaktdaten Pflicht), Jan sendet das Konditionsblatt manuell zu |
| Shop-Buttons „Bald verfügbar", Verlinkung deaktiviert | ✅ erledigt — überall, Reaktivierung über `lib/links.ts` |
| YouTube: richtiger Kanal (@Green-GardGmbH) | ✅ erledigt — 14 echte Anleitungsvideos im Learning Center |
| Terminbuchung mit 2 Tagen Vorlauf | ✅ erledigt — erster wählbarer Termin frühestens übermorgen |
| Schulungstermine 2027 „Bald verfügbar" + Vormerk-Formular | ✅ erledigt |
| Kalkulator: Beetfläche 300–500 € je nach Größe | ✅ erledigt (bis 20 m² = 300 €, bis 50 m² = 400 €, darüber 500 €) |
| Team: Titel Thomas (Geschäftsführer) + Assistenz | ✅ erledigt — übrige weiterhin ohne Titel |
| Rainworks-Link (rainworks.eu) | ✅ erledigt — Footer + /rainworks |
| Social nur LinkedIn/Instagram/YouTube | ✅ erledigt — Facebook entfernt |
| Pflanzenkölle: Name, E-Mail, Plan-Upload Pflicht | ✅ erledigt |
| Starter Kits komplett entfernt | ✅ erledigt (Seite, Teaser, Links; /starter-kits → /planung; Rechner-Empfehlung heißt jetzt „…-System") |
| Sortiment nach neuen Screenshots | ⏳ wartet auf Screenshots (Ricardo) |
| Bilder neue Produkte + Beatbots | ⏳ liefert Jan |
| Office-365-/E-Mail-Weiterleitung | ⏳ braucht Zugangsdaten (siehe „Formulare" unten) |

## Status der Meeting-Punkte vom 12.08. (Ricardo)

| Punkt | Status |
|---|---|
| Preise aus dem Dashboard entfernen, Shop-Link rein | ✅ erledigt |
| Paketpreise aus der Kalkulationsseite entfernen | ✅ erledigt (Richtwert bleibt, mit Unverbindlichkeits-Disclaimer) |
| Stücklistenanzeige aus dem Kalkulator entfernen | ✅ erledigt |
| Upload-Funktion für Planungsdaten | ✅ erledigt (Dateiauswahl; echter Upload folgt mit Supabase Storage) |
| Logo korrigieren (Bögen) | ✅ erledigt — pixelgenau nach Originaldatei |
| Logo-Animation automatisch | ✅ erledigt (Bögen schwenken, reduced-motion respektiert) |
| Kundenstimmen höher + automatisch rotierend | ✅ erledigt |
| Samstags-Hinweis entfernen | ✅ erledigt (Footer, FAQ, Gießbert) |
| Lieferzeit 2–3 Tage | ✅ erledigt (überall inkl. FAQ) |
| Checkliste Pflanzenkölle an Jan | ⏳ **Ricardo:** Link senden — `…/pflanzenkoelle` (bewusst nirgends verlinkt) |
| Office-365-Anbindung | ⏳ braucht Zugangsdaten von Green-Gard (siehe „Formulare“ unten) |

## Was Jan liefert (aus dem Meeting)

| Punkt | Wofür |
|---|---|
| ~~YouTube-Kanal-Link~~ | ✅ selbst gefunden — alle 3 Videos sind eingebettet |
| Msoft-API prüfen | Bestellhistorie im Dashboard mit echten Daten |
| ~~Social-Media-Links~~ | ✅ selbst von der alten Website übernommen (Instagram, LinkedIn, Facebook, YouTube) |
| Fotos + Highlight-Infos | Sortiment-Schaufenster auf /produkte |

---

## Go-Live morgen — die Schritte

1. **Domain aufschalten** (z. B. `www.green-gard.de` oder Subdomain): In Vercel
   → Project → Domains hinzufügen, DNS beim Hoster auf Vercel zeigen lassen.
2. **Env-Variable setzen:** `NEXT_PUBLIC_SITE_URL=https://<domain>` (für
   robots.txt/sitemap.xml) — dann Redeploy.
3. **Produktions-Branch absichern:** Aktuell deployt jeder Push auf
   `claude/green-gard-sales-demo-vY3rg` direkt in Produktion. Nach Go-Live:
   `main`-Branch anlegen, in Vercel als Production Branch setzen — dann laufen
   Änderungen erst über eine Preview-URL.
4. **Google Search Console:** Property anlegen, `sitemap.xml` einreichen.
5. Alte Website: Weiterleitungen der wichtigsten Pfade auf die neuen Routen
   (learningcenter → /learning-center, rainworks → /rainworks, team →
   /warum-green-gard …) beim bisherigen Hoster einrichten.

## So funktionieren die Formulare ab Go-Live (wichtig!)

Es gibt **noch keinen Server-Mailversand** (Office 365/Resend offen). Damit
trotzdem keine Anfrage verloren geht, öffnen alle Formulare eine **fertig
vorbefüllte E-Mail** im Mailprogramm des Besuchers — Empfänger info@,
strukturierter Inhalt, der Besucher tippt nur auf Senden.

**Neu (18.08.):** Öffnet sich kein Mailfenster (kein Mailprogramm mit dem
Browser verknüpft — beim Übergabe-Test passiert), zeigt jeder
Erfolgsbildschirm zusätzlich: **Mit Gmail senden**, **Mit Outlook senden**
(Web-Compose im Browser, fertig vorbefüllt) und **Text kopieren** — damit
kommt die Anfrage von jedem Gerät durch (`components/AnfrageFallback.tsx`).

Die Formulare im Einzelnen:

- Beratungstermin (inkl. echter Kalenderdatei zum Vormerken)
- Konditions-Anfrage (/profi) — Jan sendet das Konditionsblatt manuell zu
- Planungsanfrage aus beiden Rechnern (inkl. Bitte, Pläne anzuhängen)
- Pflanzenkölle-Projektformular
- Gießbert („Frage senden“)

Sobald Office 365 oder Resend angebunden ist, werden daraus echte
Server-Submits — die Formulare selbst bleiben unverändert (`lib/anfrage.ts`
ist die einzige Stelle).

## Bekannte Grenzen (bewusst, nicht vergessen)

- **Kein Login/Konto mehr** (Beschluss 18.08. nachmittags): Der Pilotzugang
  samt Dashboard ist komplett entfernt. /login und /konto leiten auf /profi
  um — dort läuft die Konditions-Anfrage, das Konditionsblatt versendet
  Green-Gard manuell.
- **Schulungen:** „Termine auf Anfrage“, bis Jan Termine liefert — dann wird
  die Buchung über den Warenkorb aktiv (nur JSON-Eintrag).
- **Shop noch nicht live** (Meeting 18.08.2026): Alle Shop-Buttons stehen
  bewusst ohne Link auf „Bald verfügbar". Zum Shop-Start die Adresse in
  `lib/links.ts` (`SHOP_URL`) eintragen und die Buttons wieder verlinken —
  die Suche nach „bald verfügbar“ findet alle Stellen.
- **Datenschutzerklärung** ist 1:1 von der alten Seite übernommen. Sie passt
  weitgehend, sollte aber auf die neue Technik durchgesehen werden (kein
  Cookie-Tracking mehr, YouTube-nocookie-Embeds, Vercel-Hosting). Kein
  Blocker — aber ein Punkt für den Datenschutzbeauftragten.
- **Impressum** 1:1 übernommen (HRB 27876, USt-ID etc.) — bitte von Green-Gard
  kurz bestätigen lassen, dass alles aktuell ist.

## Rechtliches — heute ergänzt

- `/impressum` und `/datenschutz` mit den Inhalten der alten Website; im
  Footer verlinkt. AGB-Link entfernt (es gibt keine AGB-Seite).
- Social-Links korrigiert: die bisherigen Handles waren falsch. Jetzt die
  echten Profile (Instagram `green_gard.gmbh`, LinkedIn, Facebook, YouTube).
