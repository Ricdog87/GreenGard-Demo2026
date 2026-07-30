import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { ViewSwitchLink } from '@/components/ViewSwitchLink';
import { CONTACT } from '@/lib/contact';
import { categories } from '@/lib/data';

export function Footer() {
  return (
    <footer className="mt-32 bg-forest text-linen">
      <div className="container py-24">
        <Eyebrow number="∞" className="text-linen/70 [&>span:first-child]:bg-linen/30">
          Kontakt
        </Eyebrow>
        <h2 className="h-display mt-6 max-w-3xl text-5xl md:text-7xl">
          Sprechen wir über <span className="italic">Ihren Garten</span>.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-10 text-sm md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Studio</p>
            <p className="mt-3 leading-relaxed">
              {CONTACT.company}
              <br />
              {CONTACT.street}
              <br />
              {CONTACT.zip} {CONTACT.city}
            </p>
            {/* Eine zentrale Nummer — keine Durchwahlen mehr (Kundenwunsch). */}
            <p className="mt-4 leading-relaxed">
              <a
                className="num border-b border-linen/30 hover:border-linen"
                href={CONTACT.phoneHref}
                data-cursor="hover"
              >
                {CONTACT.phoneDisplay}
              </a>
              <br />
              <a
                className="border-b border-linen/30 hover:border-linen"
                href={`mailto:${CONTACT.email}`}
                data-cursor="hover"
              >
                {CONTACT.email}
              </a>
            </p>
            <p className="font-mono mt-6 text-[11px] uppercase tracking-[0.18em] text-linen/60">
              {CONTACT.hours}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Sortiment</p>
            <ul className="mt-3 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/produkte?cat=${c.slug}`}
                    data-cursor="hover"
                    className="transition-colors hover:text-bronze"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Service</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/planung" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Planung
                </Link>
              </li>
              <li>
                <Link href="/starter-kits" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Starter Kits
                </Link>
              </li>
              <li>
                <Link href="/beratung" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Beratung &amp; Schulungen
                </Link>
              </li>
              <li>
                <Link href="/profi" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Konditionen für Profis
                </Link>
              </li>
              <li>
                <Link href="/warum-green-gard" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Warum Green-Gard
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Konto</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Anmelden
                </Link>
              </li>
              <li>
                <Link href="/checkout" data-cursor="hover" className="transition-colors hover:text-bronze">
                  Warenkorb
                </Link>
              </li>
              <li>
                <ViewSwitchLink />
              </li>
            </ul>
            <p className="eyebrow mt-6 text-linen/60 [&>span:first-child]:bg-linen/30">Sozial</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#" data-cursor="hover" className="hover:text-bronze">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" data-cursor="hover" className="hover:text-bronze">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-linen/15">
        <div className="container flex flex-col items-start justify-between gap-4 py-6 font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {CONTACT.company} · Est. {CONTACT.foundedYear}
          </p>
          <div className="flex gap-6">
            <Link href="#" data-cursor="hover" className="hover:text-linen">
              Impressum
            </Link>
            <Link href="#" data-cursor="hover" className="hover:text-linen">
              Datenschutz
            </Link>
            <Link href="#" data-cursor="hover" className="hover:text-linen">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
