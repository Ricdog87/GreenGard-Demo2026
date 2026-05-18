import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';

export function Footer() {
  return (
    <footer className="bg-forest text-linen mt-32">
      <div className="container py-24">
        <Eyebrow number="∞" className="text-linen/70 [&>span:first-child]:bg-linen/30">Kontakt</Eyebrow>
        <h2 className="h-display text-5xl md:text-7xl mt-6 max-w-3xl">
          Wir hören gerne <span className="italic">zu</span>.
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 text-sm">
          <div className="md:col-span-4">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Studio</p>
            <p className="mt-3 leading-relaxed">
              Green-Gard GmbH<br />
              Mainzer Straße 142<br />
              65189 Wiesbaden
            </p>
            <p className="mt-4 leading-relaxed">
              <a className="border-b border-linen/30 hover:border-linen" href="tel:+496118000000" data-cursor="hover">0611 8000000</a><br />
              <a className="border-b border-linen/30 hover:border-linen" href="mailto:info@green-gard.de" data-cursor="hover">info@green-gard.de</a>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] mt-6 text-linen/60">
              Mo–Fr · 8:00 – 17:00
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Disziplinen</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/kollektion?cat=bewaesserung" data-cursor="hover" className="hover:text-bronze transition-colors">Bewässerung</Link></li>
              <li><Link href="/kollektion?cat=steuerung" data-cursor="hover" className="hover:text-bronze transition-colors">Steuerung</Link></li>
              <li><Link href="/kollektion?cat=pumpentechnik" data-cursor="hover" className="hover:text-bronze transition-colors">Pumpentechnik</Link></li>
              <li><Link href="/kollektion?cat=beleuchtung" data-cursor="hover" className="hover:text-bronze transition-colors">Beleuchtung</Link></li>
              <li><Link href="/kollektion?cat=maehroboter" data-cursor="hover" className="hover:text-bronze transition-colors">Robotik</Link></li>
              <li><Link href="/kollektion?cat=zubehoer" data-cursor="hover" className="hover:text-bronze transition-colors">Zubehör</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Service</p>
            <ul className="mt-3 space-y-2">
              <li><Link href="/planung" data-cursor="hover" className="hover:text-bronze transition-colors">Planung</Link></li>
              <li><Link href="/atelier" data-cursor="hover" className="hover:text-bronze transition-colors">Atelier · Termin</Link></li>
              <li><Link href="/systeme" data-cursor="hover" className="hover:text-bronze transition-colors">Systeme</Link></li>
              <li><Link href="/handwerk" data-cursor="hover" className="hover:text-bronze transition-colors">Handwerk · Gewerblich</Link></li>
              <li><Link href="/manifest" data-cursor="hover" className="hover:text-bronze transition-colors">Manifest</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Sozial</p>
            <ul className="mt-3 space-y-2">
              <li><a href="#" data-cursor="hover" className="hover:text-bronze">Instagram</a></li>
              <li><a href="#" data-cursor="hover" className="hover:text-bronze">LinkedIn</a></li>
              <li><a href="#" data-cursor="hover" className="hover:text-bronze">Vimeo</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-linen/15">
        <div className="container py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-linen/55">
          <p>© {new Date().getFullYear()} Green-Gard GmbH · Est. 2004</p>
          <div className="flex gap-6">
            <Link href="#" data-cursor="hover" className="hover:text-linen">Impressum</Link>
            <Link href="#" data-cursor="hover" className="hover:text-linen">Datenschutz</Link>
            <Link href="#" data-cursor="hover" className="hover:text-linen">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
