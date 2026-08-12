import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/data';
import { markenFuer } from '@/lib/marken';
import { SHOP_URL } from '@/lib/links';

/**
 * Sortiment als Schaufenster — bewusst ohne Artikel und ohne Preise.
 *
 * Beschluss aus dem Meeting mit Jan Leifermann (12.08.2026): Preise und
 * Produktdetails werden ausschließlich im Webshop gepflegt, um doppelte
 * Preispflege zwischen den Systemen zu vermeiden. Diese Seite zeigt, WAS
 * Green Gard kann — gekauft wird im Shop, geplant wird hier.
 */

export const metadata = {
  title: 'Sortiment · Green-Gard',
  description:
    'Sieben Disziplinen für den Garten: Bewässerung, Steuerung, Pumpentechnik, Beleuchtung, Robotik, Pool und Zubehör. Preise und Bestellung im Shop, Planung und Beratung hier.',
};

export default function SortimentPage() {
  return (
    <>
      <section className="border-b border-mist bg-paper">
        <div className="container py-24 md:py-36">
          <Eyebrow number="A">Sortiment</Eyebrow>
          <h1 className="hero-h mt-8 max-w-[16ch]">
            Sieben Disziplinen. <em className="italic">Ein Garten.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
            Hier sehen Sie, was wir können — Preise und Bestellung finden Sie tagesaktuell
            in unserem Shop, die Planung und Beratung bei uns.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="accent" size="lg">
              <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                Zum Shop <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/planung">Planung starten</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Eine Sektion je Disziplin — Inhalte von green-gard.de, Fotos vom Kunden. */}
      {categories.map((c, i) => {
        const marken = markenFuer(c.slug);
        const gedreht = i % 2 === 1;
        return (
          <section
            key={c.slug}
            id={c.slug}
            className={`scroll-mt-20 border-t border-mist py-20 md:py-28 ${gedreht ? 'bg-linen' : ''}`}
          >
            <div className="container grid items-start gap-10 lg:grid-cols-12">
              <div className={`lg:col-span-5 ${gedreht ? 'lg:order-2' : ''}`}>
                <div data-reveal className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className={`min-w-0 lg:col-span-7 ${gedreht ? 'lg:order-1' : ''}`}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                  {c.roman} · {c.name}
                </p>
                <h2 className="h-display mt-4 max-w-[24ch] text-balance text-3xl md:text-4xl">
                  {c.intro ?? c.manifest}
                </h2>

                {c.vorteile && c.vorteile.length > 0 && (
                  <ul data-reveal-group className="mt-8 space-y-2.5">
                    {c.vorteile.map((v) => (
                      <li key={v} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                        <span aria-hidden className="mt-[0.6rem] h-px w-4 shrink-0 bg-moss/60" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {c.themen && c.themen.length > 0 && (
                  <div className="mt-8 grid gap-6 border-t border-mist pt-7 sm:grid-cols-2">
                    {c.themen.map((th) => (
                      <div key={th.title} className="min-w-0">
                        <h3 className="font-display text-lg tracking-tight">{th.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{th.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {marken.length > 0 && (
                  <p className="font-mono mt-8 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                    Marken · {marken.map((m) => m.name).join(' · ')}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                      Im Shop ansehen <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/beratung">Beraten lassen</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-t border-mist bg-forest py-20 text-linen md:py-28">
        <div className="container grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Eyebrow className="text-linen/70 [&>span:first-child]:bg-linen/30">
              Nicht gefunden?
            </Eyebrow>
            <h2 className="h-display mt-6 text-balance text-3xl md:text-5xl">
              Fast jeden Artikel der Bewässerungswelt <em className="italic">besorgen wir</em>.
            </h2>
            <p className="mt-6 max-w-xl text-linen/75">
              Was nicht im Shop steht, bekommen wir über unser Einkaufsnetz — fragen Sie
              einfach an.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-4 lg:justify-end">
            <Button asChild variant="accent">
              <Link href="/beratung">Anfrage stellen</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
