import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { KatalogChapter } from '@/components/katalog/KatalogChapter';
import { KatalogIndex } from '@/components/katalog/KatalogIndex';
import { KatalogActions } from '@/components/katalog/KatalogActions';
import { EPaperKatalog } from '@/components/katalog/EPaperKatalog';
import { brands, categories, products } from '@/lib/data';
import { CONTACT } from '@/lib/contact';

export const metadata = {
  title: 'Katalog 2026 · Green-Gard',
  description:
    'Das komplette Sortiment in sieben Kapiteln: Bewässerung, Steuerung, Pumpentechnik, Beleuchtung, Robotik, Pool und Zubehör — digital, durchsuchbar und tagesaktuell.',
};

const EDITION = 'Ausgabe 2026';

export default function KatalogPage() {
  // Kapitel in der Reihenfolge der Disziplinen, jeweils mit ihren Artikeln.
  const chapters = categories.map((category) => ({
    category,
    products: products.filter((p) => p.category === category.slug),
  }));

  const counts = Object.fromEntries(chapters.map((c) => [c.category.slug, c.products.length]));

  const KENNZAHLEN = [
    { value: products.length, label: 'Artikel' },
    { value: categories.length, label: 'Kapitel' },
    { value: brands.length, label: 'Marken' },
  ];

  return (
    <>
      {/* ---------- Katalogkopf ---------- */}
      <section className="relative overflow-hidden border-b border-mist bg-linen text-ink">
        {/* Feines Raster als technische Anmutung */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
                        backgroundImage:
              'linear-gradient(to right, #0F1B14 1px, transparent 1px), linear-gradient(to bottom, #0F1B14 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="container relative py-24 md:py-32">
          <div className="flex flex-wrap items-center justify-between gap-6">
                        <Eyebrow>
              {EDITION} · {CONTACT.city}
            </Eyebrow>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
              Digital · tagesaktuell · ohne Druckdatum
            </p>
          </div>

          <h1 className="hero-h mt-8 max-w-[14ch]">
            Der <em className="italic">Katalog</em>.
          </h1>

                    <p className="mt-8 max-w-xl leading-relaxed text-ink/70">
            Das komplette Sortiment in sieben Kapiteln — von der Düse bis zum Poolroboter.
            Durchsuchbar in Sekunden, mit Preisen, die immer stimmen, weil sie nicht
            gedruckt sind.
          </p>

          <div className="mt-10">
            <KatalogActions />
          </div>

          {/* Kennzahlen */}
                    <div className="mt-14 grid max-w-2xl grid-cols-3 gap-8 border-t border-mist pt-8">
            {KENNZAHLEN.map((k) => (
              <div key={k.label}>
                <p className="num font-display text-4xl tracking-tight md:text-5xl">{k.value}</p>
                                <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/55">
                  {k.label}
                </p>
              </div>
            ))}
          </div>

          {/* Kapitelübersicht als Sprungmarken */}
                    <div data-reveal-group className="mt-14 grid gap-px border border-mist bg-mist sm:grid-cols-2 lg:grid-cols-4">
            {chapters.map(({ category, products: items }) => (
              <a
                key={category.slug}
                href={`#kapitel-${category.slug}`}
                data-cursor="hover"
                                className="group flex items-baseline justify-between gap-3 bg-paper p-5 transition-colors hover:bg-linen"
              >
                <span>
                  <span className="font-mono block text-[10px] uppercase tracking-[0.18em] text-moss">
                    {category.roman}
                  </span>
                  <span className="font-display mt-1 block text-lg tracking-tight transition-colors group-hover:text-bronze">
                    {category.name}
                  </span>
                </span>
                                <span className="num font-mono text-[10px] text-ink/40">{items.length}</span>
              </a>
            ))}
          </div>

                    <p className="font-mono mt-12 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Blättern <ArrowDown className="h-3 w-3" />
          </p>
        </div>
      </section>

      {/* ---------- Kapitel ---------- */}
      <div className="container py-8 md:py-12">
        <div className="grid gap-12 xl:grid-cols-12">
          <aside className="xl:col-span-2">
            <div className="xl:sticky xl:top-24">
              <KatalogIndex counts={counts} />
            </div>
          </aside>

          <div className="xl:col-span-10">
            {chapters.map(({ category, products: items }, i) => (
              <KatalogChapter key={category.slug} category={category} products={items} index={i} />
            ))}
          </div>
        </div>
      </div>

            {/* ---------- Der gedruckte Katalog zum Blättern ---------- */}
      <EPaperKatalog />

      {/* ---------- Abschluss ---------- */}
      <section className="border-t border-mist bg-linen py-24 md:py-32">
        <div data-reveal-group className="container grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow number="∞">Nicht gefunden?</Eyebrow>
            <h2 className="h-display mt-6 text-balance text-4xl md:text-6xl">
              Wir beschaffen auch, was <em className="italic">nicht im Katalog</em> steht.
            </h2>
            <p className="mt-6 max-w-xl text-ink/70">
              Der Katalog zeigt, was wir am Lager haben. Über unsere Hersteller kommen wir an
              deutlich mehr — sagen Sie uns, was Sie brauchen.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
            <Button asChild variant="primary" size="lg">
              <Link href="/beratung">
                Artikel anfragen <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/produkte">Katalog filtern</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
