import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Eyebrow } from '@/components/Eyebrow';

const ITEMS = [
  {
    q: 'Wie schnell wird geliefert?',
    a: 'Lagerware versenden wir innerhalb von 24 Stunden. Lieferung deutschlandweit in 1–3 Werktagen. Im Großraum Wiesbaden bieten wir auf Wunsch eine Direktfahrt am selben Tag.',
  },
  {
    q: 'Verlegt ihr selbst — oder muss ich einen GaLaBauer suchen?',
    a: 'Wir empfehlen für die Installation einen unserer Partner-GaLaBauer. Für Privatkunden, die selbst Hand anlegen, liefern wir einen vollständigen Verlegeplan und stehen telefonisch zur Seite.',
  },
  {
    q: 'Ist die Beratung kostenlos?',
    a: 'Eine erste telefonische Beratung ist kostenfrei. Eine ausgearbeitete schriftliche Planung kostet 120 € — die wir bei Auftragserteilung vollständig verrechnen.',
  },
  {
    q: 'Funktioniert ein Mähroboter wirklich ohne Begrenzungsdraht?',
    a: 'Ja. Die aktuelle Kress-RTK-Serie und Husqvarna EPOS arbeiten zentimetergenau ohne Draht. Voraussetzung ist eine freie Sicht auf das Satelliten-Signal — Bäume und Hauswände dämpfen, sind aber meist kein Hindernis.',
  },
  {
    q: 'Kann ich später erweitern?',
    a: 'Alle unsere Systeme sind modular. Eine Anlage, die heute 4 Zonen steuert, lässt sich morgen auf 12 erweitern — ohne Austausch der Hauptkomponenten.',
  },
  {
    q: 'Was passiert im Winter?',
    a: 'Wir bieten einen Einwinter-Service: Anlage entwässern, Steuergerät auf Frostmodus, Akkus aus Mährobotern entnehmen. Im Frühjahr inbetriebnehmen wir zum Festpreis.',
  },
];

export function FAQ() {
  return (
    <section className="border-t border-mist py-24 md:py-32">
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <Eyebrow number="07">Fragen</Eyebrow>
          <h2 className="h-display text-4xl md:text-5xl mt-6">
            Häufig <em className="italic">gefragt</em>.
          </h2>
          <p className="text-ink/70 mt-6 max-w-sm">
            Wenn etwas fehlt, ruf uns einfach an. Wir antworten lieber persönlich.
          </p>
        </div>
        <div className="md:col-span-8">
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
