import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import { KitCard } from '@/components/KitCard';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { starterKits } from '@/lib/data';

export const metadata = {
  title: 'Starter Kits · Green-Gard',
  description:
    'Vier bewährte Zusammenstellungen für Bewässerung, Beleuchtung und Robotik — mit passender Systemplanung. Preise im Shop.',
};

const COMPARE_ROWS: { label: string; values: string[] }[] = [
  {
    label: 'Empfohlene Fläche',
    values: ['bis 300 m²', 'bis 800 m²', 'Wege & Akzente', '500 – 2.200 m²'],
  },
  {
    label: 'Zonen / Leuchten',
    values: ['4 Zonen', '6 Zonen + Tropf', '8 Leuchten', '1 Mähzone (Sperrflächen frei)'],
  },
  {
    label: 'Steuerung',
    values: ['Standard, WLAN-fähig', 'Hydrawise WLAN', 'Smart-Trafo mit App', 'Kress-App + RTK'],
  },
  {
    label: 'Erweiterbar',
    values: ['ja', 'ja', 'ja', 'ja'],
  },
  {
    label: 'Installation enthalten',
    values: ['optional', 'optional', 'inklusive', 'inklusive'],
  },
  {
    label: 'Planung',
    values: ['kostenfrei', 'kostenfrei', 'kostenfrei', 'kostenfrei'],
  },
];

function CompareValue({ value }: { value: string }) {
  if (value === 'inklusive' || value === 'ja' || value === 'kostenfrei') {
    return (
      <span className="inline-flex items-center gap-2">
        <Check className="h-4 w-4 text-forest" />
        {value}
      </span>
    );
  }
  if (value === 'optional') {
    return (
      <span className="inline-flex items-center gap-2 text-ink/55">
        <Minus className="h-4 w-4" />
        {value}
      </span>
    );
  }
  return <>{value}</>;
}

export default function StarterKitsPage() {
  const list = starterKits;

  return (
    <>
      <section className="bg-paper py-20 md:py-32">
        <div className="container">
          <Eyebrow number="B">Starter Kits</Eyebrow>
          <h1 data-reveal className="h-display mt-6 max-w-4xl text-balance text-5xl md:text-7xl lg:text-8xl">
            Vier Kits. <em className="italic">Ein Ausgangspunkt.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink/70">
            Zusammenstellungen, die sich in hunderten Projekten bewährt haben. Was am Ende
            verbaut wird, entscheidet die Systemplanung — die Preise finden Sie tagesaktuell
            im Shop.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/planung">Planung starten →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/beratung">Termin für Systemplanung</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div data-reveal-group className="container grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {list.map((k) => (
            <KitCard key={k.slug} kit={k} />
          ))}
        </div>
      </section>

      <section className="border-t border-mist py-24 md:py-32">
        <div className="container">
          <Eyebrow number="V">Vergleich</Eyebrow>
          <h2 className="h-display mt-6 text-4xl md:text-6xl">
            Auf einen <em className="italic">Blick</em>.
          </h2>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <caption className="sr-only">Vergleich der vier Starter Kits</caption>
              <thead>
                <tr className="border-b border-mist">
                  <th
                    scope="col"
                    className="font-mono w-1/5 py-5 text-left text-[11px] uppercase tracking-[0.18em] text-ink/60"
                  >
                    Eigenschaft
                  </th>
                  {list.map((k) => (
                    <th key={k.slug} scope="col" className="py-5 pl-6 text-left">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                        Kit {k.roman}
                      </p>
                      <p className="font-display mt-1 text-xl tracking-tight">{k.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-mist">
                    <th scope="row" className="py-5 text-left font-medium text-ink/80">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="num font-mono py-5 pl-6 text-sm text-ink/85">
                        <CompareValue value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Richtwert-Zeile entfernt — Preise pflegt allein der Shop
                    (Meeting 12.08.2026). */}
              </tbody>
            </table>
          </div>

          <p className="font-mono mt-6 text-[10px] uppercase tracking-[0.16em] text-ink/50">
            Alle Angaben sind Richtwerte · Endpreis nach der Systemplanung
          </p>
        </div>
      </section>

      {list.map((k, i) => (
        <section
          key={k.slug}
          className={`border-t border-mist py-24 md:py-32 ${i % 2 === 0 ? 'bg-paper' : 'bg-linen'}`}
        >
          <div className="container grid items-start gap-12 lg:grid-cols-12">
            <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <Eyebrow number={`0${i + 1}`}>Kit {k.roman}</Eyebrow>
              <h3 className="h-display mt-4 text-4xl md:text-5xl">{k.name}</h3>
              <p className="mt-2 italic text-moss">{k.tagline}</p>
              <p className="mt-6 text-ink/70">Ideal für: {k.ideal}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {k.components.map((c) => (
                  <li key={c} className="flex gap-3 text-ink/80">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-forest" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs leading-relaxed text-ink/55">{k.note}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary">
                  <Link href="/planung">Planung starten →</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/beratung">Termin vereinbaren</Link>
                </Button>
              </div>
            </div>
            <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="overflow-hidden" data-cursor="view">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={k.image} alt={k.name} className="w-full object-cover" data-parallax="5" />
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
