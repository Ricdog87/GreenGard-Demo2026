'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Download } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CONTACT } from '@/lib/contact';
import { PLANUNGSGEBUEHR } from '@/lib/planungspakete';
import { team } from '@/lib/data';

// Nur wer tatsächlich berät: Jan (Vertrieb, Beleuchtung) und Nicolas
// (Bewässerung). Thomas Gerhardt steht hier bewusst NICHT — die Geschäfts-
// führung übernimmt keine Beratungstermine (Kundenhinweis 05.08.2026).
const BERATER_MAILS = ['j.leifermann@green-gard.de', 'n.ohl@green-gard.de'];
const BERATER = BERATER_MAILS.map((mail) => team.find((m) => m.email === mail)).filter(
  (m): m is (typeof team)[number] => Boolean(m)
);

/** Mo–Fr, die nächsten zehn Werktage. */
function buildDates() {
  const out: { iso: string; day: string; date: string }[] = [];
  const cursor = new Date();
  while (out.length < 10) {
    cursor.setDate(cursor.getDate() + 1);
    const wd = cursor.getDay();
    if (wd === 0 || wd === 6) continue;
    out.push({
      iso: cursor.toISOString().slice(0, 10),
      day: cursor.toLocaleDateString('de-DE', { weekday: 'short' }),
      date: cursor.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }),
    });
  }
  return out;
}

const TIMES = ['09:00', '10:30', '13:00', '14:30', '16:00'];

/**
 * Themenauswahl aus dem Termin vom 31.07.2026. Intern ist geregelt, wer welches
 * Thema betreut — nach außen geht jede Anfrage an die zentrale Adresse, damit
 * niemand auf einen Urlaub oder Außendiensttag wartet.
 */
const THEMEN = [
  'Bewässerung',
  'Beleuchtung',
  'Pumpentechnik',
  'Pool',
  'Mähroboter',
  'Etwas anderes',
] as const;

const schema = z.object({
  name: z.string().min(2, 'Bitte Namen angeben'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  phone: z.string().min(5, 'Bitte Telefonnummer angeben'),
  flaeche: z.string().optional(),
  message: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function BeratungBooking() {
  // Termine erst nach dem Mount berechnen: im statischen HTML steckt sonst das
  // Build-Datum, der Client rechnet mit dem Besuchsdatum — Hydration-Mismatch.
  const [dates, setDates] = useState<ReturnType<typeof buildDates>>([]);
  const [berater, setBerater] = useState(BERATER[0].email);
  const [date, setDate] = useState('');
    const [time, setTime] = useState(TIMES[2]);
  const [thema, setThema] = useState<string>(THEMEN[0]);
  const [done, setDone] = useState<FormValues | null>(null);

  useEffect(() => {
    const next = buildDates();
    setDates(next);
    setDate((cur) => cur || next[0].iso);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const chosen = BERATER.find((b) => b.email === berater)!;
  const dateLabel = dates.find((d) => d.iso === date);

  if (done) {
    return (
      <div className="container max-w-2xl py-24 md:py-40">
        <Eyebrow>Termin bestätigt</Eyebrow>
        <h1 className="h-display mt-6 text-5xl md:text-6xl">
          Danke, <em className="italic">{done.name.split(' ')[0]}</em>.
        </h1>
        <p className="mt-6 text-lg text-ink/70">
          Wir haben{' '}
          <span className="font-medium">
            {dateLabel?.day}, {dateLabel?.date} · {time}
          </span>{' '}
          mit{' '}
          <span className="font-medium">
            {chosen.first} {chosen.last}
          </span>{' '}
          reserviert. Die Bestätigung geht an {done.email}.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => alert('Demo: hier würde die ICS-Datei heruntergeladen.')}
          >
            <Download className="h-4 w-4" /> Termin im Kalender speichern
          </Button>
          <Button variant="outline" onClick={() => setDone(null)}>
            Weiteren Termin vereinbaren
          </Button>
        </div>
        <p className="font-mono mt-8 text-[10px] uppercase tracking-[0.16em] text-ink/50">
          Demo · es wurde keine Mail versendet
        </p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="D">Beratung</Eyebrow>
        {/* „Systemplanung — kostenfrei“ stimmte so nicht: kostenfrei ist das
            Gespräch, der ausgearbeitete Plan kostet 120 € und wird mit dem
            Material verrechnet. */}
        <h1 className="h-display mt-6 max-w-3xl text-balance text-5xl md:text-7xl">
          Beratung — <em className="italic">kostenfrei</em>.
        </h1>
        <p className="mt-6 max-w-xl text-ink/70">
          30 Minuten, vor Ort in Wiesbaden oder per Video. Wir hören zu, stellen die richtigen Fragen und senden danach eine erste Skizze mit belastbarem Preisrahmen.
        </p>
        <p className="mt-4 max-w-xl text-sm text-ink/55">
          Der ausgearbeitete Bewässerungsplan kostet {PLANUNGSGEBUEHR.betrag} € und{' '}
          {PLANUNGSGEBUEHR.regel}.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-5">
            <div>
              <p className="eyebrow mb-4">I · Ansprechpartner</p>
              <div className="space-y-3">
                {BERATER.map((b) => (
                  <button
                    key={b.email}
                    data-cursor="hover"
                    onClick={() => setBerater(b.email)}
                    className={cn(
                      'flex w-full items-center gap-4 border p-3 text-left transition-all',
                      berater === b.email
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <Image
                      src={b.photo}
                      alt={`${b.first} ${b.last}`}
                      width={56}
                      height={56}
                      className="h-14 w-14 object-cover grayscale"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg tracking-tight">
                        {b.first} {b.last}
                      </p>
                      <p
                        className={cn(
                          'font-mono mt-0.5 truncate text-[10px] tracking-[0.12em]',
                          berater === b.email ? 'text-linen/65' : 'text-ink/55'
                        )}
                      >
                        {b.email}
                      </p>
                    </div>
                    {berater === b.email && <Check className="h-5 w-5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">II · Datum</p>
              <div className="grid grid-cols-5 gap-2">
                {dates.length === 0 &&
                  Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-[62px] animate-pulse border border-mist bg-linen" />
                  ))}
                {dates.map((d) => (
                  <button
                    key={d.iso}
                    data-cursor="hover"
                    onClick={() => setDate(d.iso)}
                    className={cn(
                      'flex flex-col items-center border py-3 text-xs transition-all',
                      date === d.iso
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em]">{d.day}</span>
                    <span className="font-display mt-1 text-base">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">III · Uhrzeit</p>
              <div className="flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    data-cursor="hover"
                    onClick={() => setTime(t)}
                    className={cn(
                      'num border px-4 py-2 text-sm transition-all',
                      time === t
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                Sprechzeiten {CONTACT.hours}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((values) => {
              // TODO: Termin in Supabase ablegen + Bestätigungsmail (Resend).
                            // Geht bewusst an die zentrale Adresse — intern wird nach Thema verteilt.
              console.info('[green-gard mock] Beratungsanfrage an ' + CONTACT.email, {
                ...values,
                thema,
                berater,
                date,
                time,
              });
              setDone(values);
            })}
            className="space-y-6 border-mist lg:col-span-7 lg:border-l lg:pl-12"
          >
                        <fieldset>
              <legend className="eyebrow mb-3">IV · Worum geht es?</legend>
              <div className="flex flex-wrap gap-2">
                {THEMEN.map((t) => (
                  <button
                    key={t}
                    type="button"
                    data-cursor="hover"
                    aria-pressed={thema === t}
                    onClick={() => setThema(t)}
                    className={cn(
                      'border px-4 py-2 text-sm transition-all',
                      thema === t
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <p className="eyebrow">V · Kontaktdaten</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="eyebrow mb-2 block" htmlFor="b-name">
                  Name
                </label>
                <Input id="b-name" placeholder="Vor- und Nachname" {...register('name')} />
                {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
              </div>
              <div>
                <label className="eyebrow mb-2 block" htmlFor="b-phone">
                  Telefon
                </label>
                <Input id="b-phone" placeholder="0151 …" {...register('phone')} />
                {errors.phone && <p className="mt-1 text-xs text-red-700">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="eyebrow mb-2 block" htmlFor="b-email">
                  E-Mail
                </label>
                <Input id="b-email" type="email" placeholder="ihre@email.de" {...register('email')} />
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>}
              </div>
              <div>
                <label className="eyebrow mb-2 block" htmlFor="b-flaeche">
                  Gartenfläche ca.
                </label>
                <Input id="b-flaeche" placeholder="z. B. 450 m²" {...register('flaeche')} />
              </div>
            </div>
            <div>
              <label className="eyebrow mb-2 block" htmlFor="b-message">
                Worum geht es?
              </label>
              <Textarea
                id="b-message"
                rows={5}
                placeholder="Kurzer Hinweis zu Wunsch, Standort, Zeitrahmen …"
                {...register('message')}
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Termin bestätigen →
            </Button>
                        <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
              Ihre Anfrage landet bei {CONTACT.email} — so ist immer jemand dran, auch bei
              Urlaub oder Außendienst. Antwort innerhalb von vier Werktagsstunden.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
