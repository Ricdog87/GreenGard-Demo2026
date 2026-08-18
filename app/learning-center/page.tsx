import Link from 'next/link';
import { PhoneCall, Smartphone, Wrench } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { LearningGrid } from '@/components/learning/LearningGrid';
import { FaqAccordion } from '@/components/learning/FaqAccordion';
import { CONTACT } from '@/lib/contact';
import videosJson from '@/data/videos.json';
import faqJson from '@/data/faq.json';

export const metadata = {
  title: 'Learning Center · Green-Gard',
  description:
    'Erklärvideos vom Green-Gard-Kanal und ausgeschriebene Antworten zu Bewässerung, Hydrawise, Pumpentechnik, Gartenbeleuchtung, Mährobotern und Poolpflege — praxisnah und auf dem Handy abrufbar.',
};

const VIDEO_COUNT = videosJson.videos.length;
const FAQ_COUNT = faqJson.eintraege.length;

const PRINZIPIEN = [
  {
    icon: Smartphone,
    title: 'Für die Baustelle gemacht',
    body: 'Alle Videos laufen auf dem Handy — ohne Login, ohne Formular, ohne Wartezeit. Link öffnen, ansehen, weiterarbeiten.',
  },
  {
    icon: Wrench,
    title: 'Handgriffe statt Hochglanz',
    body: 'Aufgenommen an echten Geräten, von den Leuten, die sie täglich beraten. Jedes Video beantwortet genau eine Frage.',
  },
  {
    icon: PhoneCall,
    title: 'Und wenn es dann klemmt',
    body: 'Rufen Sie an. Wir sprechen dann über Ihren Fall — und nicht mehr über die Grundlagen.',
  },
];

/**
 * FAQPage-Markup für Google. Die 139 Antworten sind der stärkste SEO-Bestand
 * des Kunden — ohne dieses Schema tauchen sie in der Suche nicht als Rich
 * Result auf. Inhalt identisch zur sichtbaren Fassung.
 */
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqJson.eintraege.map((e) => ({
    '@type': 'Question',
    name: e.frage,
    acceptedAnswer: { '@type': 'Answer', text: e.antwort.join(' ') },
  })),
};

export default function LearningCenterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <section className="py-16 md:py-24">
        <div className="container">
          <Eyebrow number="L">Learning Center</Eyebrow>
          <h1 className="h-display mt-8 max-w-[16ch] text-balance text-5xl md:text-7xl">
            Erst schauen. Dann <em className="italic">anrufen</em>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
            <span className="num">{VIDEO_COUNT}</span> Anleitungsvideos von unserem YouTube-Kanal —
            von der Hydrawise-Einrichtung über Regensensoren und PE-Rohr bis zur
            In-Lite-Leuchte. Dazu{' '}
            <a href="#fragen" data-cursor="hover" className="border-b border-mist hover:border-ink">
              <span className="num">{FAQ_COUNT}</span> ausgeschriebene Antworten
            </a>{' '}
            zu allem, was sonst am Telefon landet: Ventil, Vordruck, Zisterne, Einwinterung.
          </p>

          <div
            data-reveal-group
            className="mt-16 grid gap-10 border-t border-mist pt-12 md:grid-cols-3 md:gap-12"
          >
            {PRINZIPIEN.map((p) => (
              <div key={p.title} className="min-w-0">
                <p.icon className="h-5 w-5 text-moss" aria-hidden />
                <h2 className="font-display mt-4 text-xl tracking-tight">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LearningGrid />

      <FaqAccordion />

      <section className="border-t border-mist bg-forest py-24 text-linen md:py-32">
        <div data-reveal className="container grid items-end gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper">
              Frage nicht beantwortet?
            </p>
            <h2 className="h-display mt-6 text-balance text-4xl md:text-6xl">
              Dann sind wir <em className="italic">dran</em>.
            </h2>
            <p className="mt-6 max-w-xl text-linen/70">
              Ein Anruf, ein Foto per Mail, eine kurze Beschreibung der Anlage — meistens
              reicht das. Sie erreichen jemanden, der die Technik selbst verbaut hat.
            </p>
            {/* CONTACT.hours ist als Label gesetzt (»Mo–Fr · 8:00 – 17:00«) und
                bricht im Fließtext — deshalb als eigene Zeile. */}
            <p className="font-mono num mt-5 text-[11px] uppercase tracking-[0.18em] text-linen/55">
              Sprechzeiten {CONTACT.hours}
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5 lg:items-end">
            <a
              href={CONTACT.phoneHref}
              data-cursor="hover"
              className="font-display num text-3xl tracking-tight transition-colors hover:text-copper md:text-4xl"
              aria-label={`Green-Gard anrufen: ${CONTACT.phoneDisplay}`}
            >
              {CONTACT.phoneDisplay}
            </a>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Button asChild variant="accent" size="lg">
                <Link href="/beratung">Beratung vereinbaren →</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-linen/30 text-linen hover:border-linen hover:bg-transparent"
              >
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
