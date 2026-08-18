import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Eyebrow } from '@/components/Eyebrow';
import { CONTACT } from '@/lib/contact';

const ITEMS = [
  {
    q: 'Wie schnell wird geliefert?',
    // Lieferzeit 2–3 Werktage (Meeting 12.08.2026).
    a: 'Lagerware versenden wir innerhalb von 24 Stunden. Lieferung deutschlandweit in 2–3 Werktagen. Im Großraum Wiesbaden bieten wir auf Wunsch eine Direktfahrt am selben Tag.',
  },
  // Starter-Kits-Eintrag entfernt — die Kits sind seit 18.08.2026 komplett raus.
  {
    q: 'Wer übernimmt die Installation?',
    a: 'Für die Installation empfehlen wir einen unserer Partnerbetriebe. Wer selbst Hand anlegt, bekommt von uns einen vollständigen Verlegeplan und telefonische Unterstützung.',
  },
  {
    q: 'Was kostet die Beratung?',
    // Regel aus dem Meeting: Gespräch kostenfrei, ausgearbeiteter Plan 120 €.
    a: 'Das Beratungsgespräch ist kostenfrei. Der ausgearbeitete Bewässerungsplan kostet 120 € und wird beim Kauf mit dem Material verrechnet.',
  },
  {
    q: 'Funktioniert ein Mähroboter wirklich ohne Begrenzungsdraht?',
    a: 'Ja. Die aktuelle Kress-RTK-Serie und Husqvarna EPOS arbeiten zentimetergenau ohne Draht. Voraussetzung ist freie Sicht auf das Satellitensignal — Bäume und Hauswände dämpfen, sind aber meist kein Hindernis.',
  },
  {
    q: 'Bekommen Gewerbekunden andere Preise?',
        a: 'Ja. GaLaBau-Betriebe, Architekten, Installateure und Fachhandel kaufen zu Nettopreisen auf Rechnung. Die Konditionen vereinbaren wir individuell — je nach Zusammenarbeit und Projektvolumen. Sprechen Sie uns an, wir melden uns persönlich.',
  },
  {
    q: 'Was passiert im Winter?',
    a: 'Wir bieten einen Einwinter-Service: Anlage entwässern, Steuergerät in den Frostmodus, Akkus aus Mährobotern entnehmen. Im Frühjahr nehmen wir die Anlage zum Festpreis wieder in Betrieb.',
  },
];

export function FAQ() {
  return (
    <section className="border-t border-mist py-24 md:py-32">
      <div className="container grid grid-cols-1 gap-12 md:grid-cols-12">
        <div data-reveal className="md:col-span-4">
          <Eyebrow number="09">Fragen</Eyebrow>
          <h2 className="h-display mt-6 text-4xl md:text-5xl">
            Häufig <em className="italic">gefragt</em>.
          </h2>
          <p className="mt-6 max-w-sm text-ink/70">
            Wenn etwas offenbleibt, rufen Sie uns einfach an — wir antworten lieber persönlich.
          </p>
          <p className="num font-mono mt-6 text-[11px] uppercase tracking-[0.18em]">
            <a href={CONTACT.phoneHref} data-cursor="hover" className="hover:text-bronze">
              {CONTACT.phoneDisplay}
            </a>
          </p>
        </div>
        <div data-reveal className="md:col-span-8">
          <Accordion type="single" collapsible className="border-b border-mist">
            {ITEMS.map((it, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{it.q}</AccordionTrigger>
                <AccordionContent>{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
