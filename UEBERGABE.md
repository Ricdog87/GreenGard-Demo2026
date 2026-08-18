# Übergabe & Go-Live — Green-Gard Website

Stand: **12.08.2026** · Go-Live geplant: **13.08.2026**
Live-Stand: https://green-gard-demo2026.vercel.app

---

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
| Alte Bestellbestätigungen | Historie für Pilotkunden |
| 5–10 Pilotkunden benennen | Freischaltung der Konten (mit Supabase) |
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
strukturierter Inhalt, der Besucher tippt nur auf Senden:

- Beratungstermin (inkl. echter Kalenderdatei zum Vormerken)
- Konditionskatalog-Anfrage (/profi)
- Planungsanfrage aus beiden Rechnern (inkl. Bitte, Pläne anzuhängen)
- Kit-Anfrage, Nachbestellung, Schnellbestellung (Konto)
- Pflanzenkölle-Projektformular
- Gießbert („Frage senden“)

Sobald Office 365 oder Resend angebunden ist, werden daraus echte
Server-Submits — die Formulare selbst bleiben unverändert (`lib/anfrage.ts`
ist die einzige Stelle).

## Bekannte Grenzen (bewusst, nicht vergessen)

- **Login ist Pilotphase:** Jede Anmeldung zeigt das Beispielkonto
  (Musterbau GmbH) — als solches gekennzeichnet, auf Login und im Dashboard.
  Echte Zugänge kommen mit Supabase + Pilotkunden.
- **Schulungen:** „Termine auf Anfrage“, bis Jan Termine liefert — dann wird
  die Buchung über den Warenkorb aktiv (nur JSON-Eintrag).
- **SHOP_URL** zeigt auf green-gard.de, bis der neue Shop live ist
  (`lib/links.ts`).
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
