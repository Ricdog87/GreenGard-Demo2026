import Image from 'next/image';
import Link from 'next/link';
import { PaketCard } from '@/components/PaketCard';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import pakete from '@/data/pakete.json';
import { Check, Minus } from 'lucide-react';

const COMPARE_ROWS: Array<{ label: string; values: [string, string, string] }> = [
  { label: 'Empfohlene Fläche', values: ['bis 300 m²', 'bis 800 m²', 'bis 2.000 m²'] },
  { label: 'Zonen', values: ['4', '6 + Tropf', '12 (erweiterbar)'] },
  { label: 'Steuerung', values: ['Standard, optional WLAN', 'Hydrawise WLAN', 'Hydrawise Premium'] },
  { label: 'Pumpentechnik enthalten', values: ['optional', 'optional', 'inklusive'] },
  { label: 'Beleuchtung', values: ['add-on', 'add-on', 'inklusive (4 Leuchten)'] },
  { label: 'Mähroboter', values: ['add-on', 'add-on', 'Kress 1.500 m²'] },
  { label: 'Installation durch Partner', values: ['optional', 'optional', 'inklusive'] },
];

export default function SystemePage() {
  return (
    <>
      <section className="py-20 md:py-32 bg-paper">
        <div className="container">
          <Eyebrow number="B">Systeme</Eyebrow>
          <h1 className="h-display text-5xl md:text-7xl lg:text-8xl mt-6 max-w-4xl text-balance">
            Drei Systeme. <em className="italic">Drei Größen.</em>
          </h1>
          <p className="text-lg text-ink/70 mt-8 max-w-2xl">
            Vorgeplante Kompositionen für Reihenhaus bis Anwesen. Geliefert, auf
            Wunsch installiert — und stets modular erweiterbar.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-6">
            {pakete.map((p) => <PaketCard key={p.slug} p={p as any} />)}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-mist">
        <div className="container">
          <Eyebrow number="V">Vergleich</Eyebrow>
          <h2 className="h-display text-4xl md:text-6xl mt-6">Auf einen <em className="italic">Blick</em>.</h2>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-mist">
                  <th className="text-left py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 w-1/4">Eigenschaft</th>
                  {pakete.map((p) => (
                    <th key={p.slug} className="text-left py-5 pl-6">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">{p.slug}</p>
                      <p className="font-display text-xl tracking-tight mt-1">{p.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-mist">
                    <td className="py-5 font-medium text-ink/80">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="py-5 pl-6 num font-mono text-sm text-ink/85">
                        {v.startsWith('inklusive') || v === 'inklusive' || v === 'inkl' ? (
                          <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-forest" />{v}</span>
                        ) : v === 'add-on' || v === 'optional' ? (
                          <span className="inline-flex items-center gap-2 text-ink/55"><Minus className="h-4 w-4" />{v}</span>
                        ) : v}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="py-5 font-medium text-ink/80">Netto-Preis ab</td>
                  {pakete.map((p) => (
                    <td key={p.slug} className="py-5 pl-6 price text-2xl">{p.netPrice.toLocaleString('de-DE')} €</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {pakete.map((p, i) => (
        <section key={p.slug} className={`py-24 md:py-32 ${i % 2 === 0 ? 'bg-paper' : 'bg-linen'} border-t border-mist`}>
          <div className="container grid lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" data-cursor="view" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <Eyebrow number={`0${i + 1}`}>System</Eyebrow>
              <h3 className="h-display text-4xl md:text-5xl mt-4">{p.name}</h3>
              <p className="italic text-moss mt-2">{p.tagline}</p>
              <p className="text-ink/70 mt-6">Ideal für: {p.ideal}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {p.includes.map((inc) => (
                  <li key={inc} className="flex gap-3 text-ink/80">
                    <Check className="h-4 w-4 mt-1 shrink-0 text-forest" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="primary"><Link href={`/planung`}>Planung beginnen →</Link></Button>
                <Button asChild variant="outline"><Link href="/atelier">Termin im Atelier</Link></Button>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
