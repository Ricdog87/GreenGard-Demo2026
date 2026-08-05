import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Check, Clock, PencilRuler } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { PlanungRechner } from './PlanungRechner';
import { IRRISKETCH_URL } from '@/lib/links';
import { CONTACT } from '@/lib/contact';
import { AUSSTATTUNGSSTUFEN, PLANUNGSDAUER, PLANUNGSGEBUEHR } from '@/lib/planungspakete';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Planung · Green-Gard',
  description:
    'Zeichnen Sie Ihren Garten selbst — wir legen die Bewässerung darüber. Fertige Planung inklusive Angebot innerhalb von 24 bis 48 Stunden.',
};

/**
 * Der Ablauf, wie Jan Leifermann ihn im Termin am 31.07.2026 beschrieben hat.
 * Reihenfolge und Fristen bewusst unverändert übernommen — das ist das
 * Verkaufsversprechen, mit dem er beim Kunden arbeitet.
 */
const ABLAUF = [
  {
    titel: 'Sie zeichnen Ihren Garten',
    text: 'Grundriss aufnehmen, Rasen, Beete und Hecken einzeichnen — direkt im Browser, ohne Installation.',
  },
  {
    titel: 'Sie geben uns die Eckdaten',
    text: 'Wasserquelle, verfügbare Wassermenge, gewünschtes Steuergerät. Fotos und vorhandene Pläne hängen Sie einfach an.',
  },
  {
    titel: 'Wir planen die Bewässerung',
    text: 'Unsere Techniker legen Regner, Rohrführung und Zonen auf Ihre Zeichnung — mit korrekter Hydraulik.',
  },
  {
    titel: 'Sie erhalten Schema und Angebot',
    text: 'Bewässerungsschema und passendes Angebot kommen per Mail. In der Regel binnen 24 bis 48 Stunden.',
  },
  {
    titel: 'Sie beauftragen',
    text: 'Passt alles, geben Sie das Angebot frei. Rückfragen entfallen, weil alle Daten schon vorliegen.',
  },
  {
    titel: 'Das Material kommt',
    text: 'Wenige Tage später steht Ihre Anlage komplett kommissioniert bei Ihnen auf dem Hof.',
  },
];

const VORTEILE = [
  { icon: Clock, wert: '24–48 h', label: 'bis zur fertigen Planung' },
  { icon: PencilRuler, wert: 'maßstabsgetreu', label: 'statt Skizze auf Papier' },
  { icon: Check, wert: 'ohne Rückfragen', label: 'alle Daten liegen vor' },
];

export default function PlanungPage() {
  return (
    <>
      {/* ---------- Planungstool: der schnellste Weg zur Anlage ---------- */}
      <section className="relative overflow-hidden bg-forest text-linen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #F5F1E8 1px, transparent 1px), linear-gradient(to bottom, #F5F1E8 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-forest/50" />

        <div className="container relative py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow className="text-linen/70 [&>span:first-child]:bg-linen/30">
                Planungstool
              </Eyebrow>
              <h1 className="hero-h mt-6 max-w-[16ch]">
                Zeichnen Sie. Wir <em className="italic">planen</em>.
              </h1>
              <p className="mt-8 max-w-xl leading-relaxed text-linen/80">
                Sie skizzieren Ihren Garten maßstabsgetreu im Browser — wir legen die
                Bewässerung darüber. Das spart beiden Seiten das Nachtelefonieren und
                bringt Ihre Planung in ein bis zwei Tagen zum Abschluss.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                {/* Öffnet IRRISketch in neuem Tab — jeder Aufruf startet ein neues Projekt. */}
                <Button asChild variant="accent" size="xl">
                  <a href={IRRISKETCH_URL} target="_blank" rel="noopener noreferrer">
                    Garten jetzt zeichnen <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="ghost" size="xl" className="text-linen hover:bg-linen/10">
                  <a href="#richtwert">
                    Erst Kosten schätzen <ArrowDown className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <p className="font-mono mt-6 text-[10px] uppercase leading-relaxed tracking-[0.18em] text-linen/50">
                Kostenfrei · ohne Anmeldung · Ergebnis geht direkt an unsere Technik
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="grid gap-px bg-linen/15 sm:grid-cols-3 lg:grid-cols-1">
                {VORTEILE.map((v) => (
                  <div key={v.label} className="bg-forest p-6">
                    <v.icon className="h-5 w-5 text-bronze" />
                    <p className="font-display mt-3 text-2xl tracking-tight">{v.wert}</p>
                    <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.18em] text-linen/55">
                      {v.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Ablauf in sechs Schritten ---------- */}
      <section className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container">
          <div data-reveal>
            <Eyebrow number="01">Ablauf</Eyebrow>
            <h2 className="h-display mt-6 max-w-3xl text-balance text-4xl md:text-6xl">
              Von der Skizze zur Anlage — in <em className="italic">sechs Schritten</em>.
            </h2>
          </div>

          <ol data-reveal-group className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {ABLAUF.map((s, i) => (
              <li key={s.titel} className="border-t border-mist pt-5">
                <span className="num font-mono text-[10px] uppercase tracking-[0.18em] text-moss">
                  Schritt {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-2 text-2xl leading-tight tracking-tight">
                  {s.titel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-mist pt-10">
            <Button asChild variant="primary" size="lg">
              <a href={IRRISKETCH_URL} target="_blank" rel="noopener noreferrer">
                Planung starten <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <p className="text-sm text-ink/60">
              Lieber persönlich?{' '}
              <Link href="/beratung" data-cursor="hover" className="border-b border-mist hover:border-ink">
                Termin vereinbaren
              </Link>{' '}
              oder anrufen:{' '}
              <a href={CONTACT.phoneHref} className="num border-b border-mist hover:border-ink">
                {CONTACT.phoneDisplay}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Ausstattungsstufen (Bronze/Silber/Gold vom Kunden) ---------- */}
      <section className="border-t border-mist py-16 md:py-24">
        <div className="container">
          <div data-reveal className="max-w-3xl">
            <Eyebrow number="02">Ausstattung</Eyebrow>
            <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">
              Sie entscheiden, wie <em className="italic">hochwertig</em> es wird.
            </h2>
            <p className="mt-6 text-ink/70">
              Dieselbe Planung, drei Materialstufen. Der Unterschied liegt in der Steuerung
              und in der Verteilung — nicht in der Qualität der Auslegung.
            </p>
          </div>

          <div data-reveal-group className="mt-12 grid gap-6 md:grid-cols-3">
            {AUSSTATTUNGSSTUFEN.map((stufe) => (
              <article
                key={stufe.id}
                className={cn(
                  'flex flex-col border p-8',
                  stufe.beliebt ? 'border-forest bg-linen' : 'border-mist bg-paper'
                )}
              >
                {stufe.beliebt && (
                  <span className="font-mono mb-4 self-start bg-forest px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-linen">
                    Am beliebtesten
                  </span>
                )}
                <h3 className="font-display text-2xl tracking-tight">{stufe.name}</h3>
                <p className="font-display mt-1 text-sm italic text-moss">{stufe.claim}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">{stufe.beschreibung}</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-mist pt-5 text-sm text-ink/80">
                  {stufe.merkmale.map((m) => (
                    <li key={m} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          {/* Die Planungsgebühr stand bisher nirgends — sie gehört sichtbar hierher. */}
          <div data-reveal className="mt-10 border-l-2 border-copper/50 bg-linen/60 py-4 pl-5">
            <p className="max-w-3xl text-sm leading-relaxed text-ink/75">
              <span className="price text-base">{PLANUNGSGEBUEHR.betrag} €</span> für den
              professionellen Bewässerungsplan samt Angebot — {PLANUNGSGEBUEHR.regel}. Bestellen
              Sie das Material bei uns, ist die Planung damit kostenlos. Bearbeitungszeit{' '}
              <span className="num">{PLANUNGSDAUER}</span>, sobald uns alle Angaben vorliegen.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Kostenschätzung ---------- */}
      <section id="richtwert" className="scroll-mt-20 border-t border-mist bg-linen py-16 md:py-20">
        <div className="container" data-reveal>
          <Eyebrow number="03">Kostenrahmen</Eyebrow>
          <h2 className="h-display mt-6 max-w-3xl text-balance text-4xl md:text-5xl">
            Was kostet das <em className="italic">ungefähr</em>?
          </h2>
          <p className="mt-6 max-w-2xl text-ink/70">
            Vier Fragen genügen für einen belastbaren Materialrichtwert. Die verbindliche
            Auslegung entsteht anschließend aus Ihrer Zeichnung.
          </p>
        </div>
      </section>

      <PlanungRechner />
    </>
  );
}
