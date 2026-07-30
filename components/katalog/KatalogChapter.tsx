import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { KatalogPrice } from '@/components/katalog/KatalogPrice';
import type { Category, Product } from '@/lib/data';

/**
 * Ein Katalog-Kapitel als Doppelseite: links das Disziplinenbild, das beim
 * Scrollen stehen bleibt, rechts die Artikel als Registerzeilen. Jede Zeile
 * trägt ihre laufende Nummer, die technische Kernangabe und den Preis —
 * lesbar wie ein gedruckter Katalog, klickbar wie ein Shop.
 */
export function KatalogChapter({
  category,
  products,
  index,
}: {
  category: Category;
  products: Product[];
  index: number;
}) {
  return (
    <section
      id={`kapitel-${category.slug}`}
      className="scroll-mt-24 border-t border-mist py-16 first:border-t-0 md:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Bildspalte — bleibt beim Durchblättern der Artikel stehen */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/5] overflow-hidden bg-linen">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                data-parallax="5"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/85 to-transparent p-6 pt-16">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-linen/70">
                  Kapitel {category.roman}
                </p>
                <h2 className="font-display mt-1 text-3xl tracking-tight text-linen md:text-4xl">
                  {category.name}
                </h2>
                <p className="font-display mt-1 text-sm italic text-linen/75">
                  {category.manifest}
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70">{category.blurb}</p>

            <div className="font-mono mt-5 flex items-center gap-5 text-[10px] uppercase tracking-[0.18em] text-ink/45">
              <span className="num">
                {String(products.length).padStart(2, '0')} Artikel
              </span>
              <span className="num">
                ab {category.abPreis.toFixed(2).replace('.', ',')} €
              </span>
              <Link
                href={`/produkte?cat=${category.slug}`}
                data-cursor="hover"
                className="ml-auto inline-flex items-center gap-1.5 text-ink/70 transition-colors hover:text-bronze"
              >
                Filtern <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Artikelregister */}
        <div className="lg:col-span-8">
          <ol data-reveal-group className="border-t border-mist">
            {products.map((p, i) => {
              // Erste technische Angabe als Kurzcharakteristik der Zeile.
              const [specKey, specValue] = Object.entries(p.specs)[0] ?? [];
              return (
                <li key={p.slug} className="border-b border-mist">
                  {/* Registerzeile: Nummer · Artikel mit technischer Kurzangabe ·
                      Preis. Die Spec steht unter dem Namen statt in einer eigenen
                      Spalte — sonst bleibt für den Namen zu wenig Breite. */}
                  <Link
                    href={`/produkte/${p.slug}`}
                    data-cursor="hover"
                    className="group flex items-start gap-4 py-5 transition-colors hover:bg-linen/60 md:gap-6"
                  >
                    <span className="num font-mono w-9 shrink-0 pt-1 text-[10px] tracking-[0.16em] text-ink/35 md:w-11">
                      {String(index + 1)}.{String(i + 1).padStart(2, '0')}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="font-mono block text-[10px] uppercase tracking-[0.18em] text-moss">
                        {p.brand}
                        {p.bestseller && <span className="ml-2 text-bronze">· Bestseller</span>}
                      </span>
                      <span className="font-display mt-0.5 block text-lg leading-snug tracking-tight transition-colors group-hover:text-bronze">
                        {p.name}
                      </span>
                      <span className="num font-mono mt-1.5 block text-[10px] uppercase tracking-[0.14em] text-ink/45">
                        {specKey ? `${specKey}: ${specValue}` : p.shortDesc}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-baseline gap-3 pt-4">
                      <KatalogPrice netPrice={p.netPrice} />
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 self-center text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-bronze" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
