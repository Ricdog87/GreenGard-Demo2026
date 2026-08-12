'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { formatEURRound } from '@/lib/utils';
import { SERVICES } from '@/lib/services';

/**
 * Saison-Modul — die Landing lebt mit dem Gartenjahr, ohne dass jemand sie
 * pflegt. Der Inhalt hängt am Monat:
 *
 *   Feb – Apr   Planungsvorlauf: wer jetzt plant, bewässert ab Mai
 *   Mai – Aug   Hauptsaison: Wissen gegen Support-Anrufe (gießen, Recht, Zeiten)
 *   Sep – Nov   Einwinterung + Winterservice Mähroboter (235 €)
 *   Dez – Jan   Werkstatt-Winter: Service-Slots frei, Planung fürs Frühjahr
 *
 * Hydration: der Server backt den Build-Monat ein; nach dem Mount korrigiert
 * ein setState auf den echten Monat. Kein Mismatch, kein Layout-Sprung —
 * die Sektion hat in allen Varianten dieselbe Struktur.
 */

interface Saison {
  id: string;
  eyebrow: string;
  titel: React.ReactNode;
  text: string;
  punkte: string[];
  cta: { label: string; href: string };
  ctaZweit?: { label: string; href: string };
}

const WINTERSERVICE_PREIS = SERVICES.find((s) => s.slug === 'winterservice')?.preis ?? 235;

function saisonFuer(monat: number): Saison {
  // monat: 0 = Januar … 11 = Dezember
  if (monat >= 1 && monat <= 3) {
    return {
      id: 'fruehjahr',
      eyebrow: 'Jetzt im Frühjahr',
      titel: (
        <>
          Wer jetzt plant, bewässert <em className="italic">ab Mai</em>.
        </>
      ),
      text: 'Die Planung dauert 1–3 Werktage, die Lieferung 1–3 — aber die Einbautermine der Fachbetriebe füllen sich ab April. Der beste Zeitpunkt für Ihre Anlage ist vor der Saison.',
      punkte: [
        'Planung jetzt, Einbau vor dem ersten Hitzesommer-Wochenende',
        'Mähroboter-Start: Winterservice vor der ersten Mahd',
        'Steuerung und Sensorik vor der Saison in Ruhe einrichten',
      ],
      cta: { label: 'Planung starten', href: '/planung' },
      ctaZweit: { label: 'Beratungstermin', href: '/beratung' },
    };
  }
  if (monat >= 4 && monat <= 7) {
    return {
      id: 'sommer',
      eyebrow: 'Jetzt im Sommer',
      titel: (
        <>
          Richtig gießen, wenn es <em className="italic">zählt</em>.
        </>
      ),
      text: 'Morgens zwischen vier und sechs, lieber selten und durchdringend als täglich kurz — und bei über 30 Grad bis zu dreimal pro Woche. Die häufigsten Sommerfragen sind im Learning Center beantwortet.',
      punkte: [
        'Wann und wie viel wässern — die Faustregeln',
        'Ist Gartenbewässerung erlaubt? Was bei Trockenheit gilt',
        'Smarte Steuerung: Wetterdaten statt Gießkanne',
      ],
      cta: { label: 'Antworten im Learning Center', href: '/learning-center#fragen' },
      ctaZweit: { label: 'Nachrüsten planen', href: '/planung' },
    };
  }
  if (monat >= 8 && monat <= 10) {
    return {
      id: 'herbst',
      eyebrow: 'Jetzt im Herbst',
      titel: (
        <>
          Einwintern, bevor der <em className="italic">Frost</em> es tut.
        </>
      ),
      text: `Eine nicht ausgeblasene Anlage ist der teuerste Winterschaden im Garten. Und der Mähroboter? Kommt zum Winterservice — Durchsicht, Messertausch, Firmware, Prüfbericht für ${formatEURRound(WINTERSERVICE_PREIS)}.`,
      punkte: [
        'Bewässerung ausblasen: die Anleitung steht im Learning Center',
        `Winterservice Mähroboter zum Festpreis ${formatEURRound(WINTERSERVICE_PREIS)} — Kress und Husqvarna`,
        'Frühjahrs-Projekte jetzt planen, vor der Werkstatt-Hochsaison',
      ],
      cta: { label: 'Winterservice ansehen', href: '/beratung#service' },
      ctaZweit: { label: 'Einwinterungs-Anleitung', href: '/learning-center#fragen' },
    };
  }
  return {
    id: 'winter',
    eyebrow: 'Jetzt im Winter',
    titel: (
      <>
        Die Saison beginnt am <em className="italic">Reißbrett</em>.
      </>
    ),
    text: 'Im Winter ist die Werkstatt frei und die Planung ohne Wartezeit. Wer sein Frühjahrsprojekt jetzt zeichnet, hat Angebot und Material, bevor die Fachbetriebe ausgebucht sind.',
    punkte: [
      'Planung in 1–3 Werktagen — ganz ohne Saisonstau',
      `Mähroboter zum Winterservice bringen (${formatEURRound(WINTERSERVICE_PREIS)}, inkl. Prüfbericht)`,
      'Schulungstermine fürs Team sichern, bevor die Baustellen rufen',
    ],
    cta: { label: 'Planung starten', href: '/planung' },
    ctaZweit: { label: 'Winterservice', href: '/beratung#service' },
  };
}

export function SaisonModul() {
  // Erst Build-Monat (statisch vorgerendert), nach dem Mount der echte.
  const [monat, setMonat] = useState(7);
  useEffect(() => setMonat(new Date().getMonth()), []);
  const s = saisonFuer(monat);

  return (
    <section aria-label="Saisonale Empfehlung" className="border-t border-mist bg-forest py-20 text-linen md:py-28">
      <div className="container grid items-center gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow className="text-linen/70 [&>span:first-child]:bg-linen/30">{s.eyebrow}</Eyebrow>
          <h2 className="h-display mt-6 text-balance text-4xl md:text-5xl">{s.titel}</h2>
          <p className="mt-6 max-w-xl leading-relaxed text-linen/75">{s.text}</p>
        </div>
        <div className="min-w-0 lg:col-span-5">
          <ul className="space-y-3 border-t border-linen/15 pt-6">
            {s.punkte.map((p) => (
              <li key={p} className="flex gap-3 text-sm leading-relaxed text-linen/80">
                <span aria-hidden className="mt-[0.55rem] h-px w-5 shrink-0 bg-copper" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="accent">
              <Link href={s.cta.href}>
                {s.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {s.ctaZweit && (
              <Button
                asChild
                variant="outline"
                className="border-linen/30 text-linen hover:border-linen hover:bg-transparent"
              >
                <Link href={s.ctaZweit.href}>{s.ctaZweit.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
