'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, FileText, GraduationCap, Percent, Truck } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitLead, type GewerbeArt } from '@/lib/supabase';
import { sendeAnfrage, ANFRAGE_HINWEIS } from '@/lib/anfrage';
import { AnfrageFallback } from '@/components/AnfrageFallback';
import { CONTACT } from '@/lib/contact';
import { AUDIENCES } from '@/lib/audience';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

// Angaben wie auf green-gard.de/galabauer-installateure und im Learning
// Center: Lieferzeit, Zahlungsregel und Vor-Ort-Hilfe stehen dort konkret.
const USPS = [
  {
    icon: Percent,
    title: 'Nettopreise',
    body: 'Alle Preise netto. Ihre persönlichen Konditionen vereinbaren wir individuell und hinterlegen sie in Ihrem Konto.',
  },
  {
    icon: FileText,
    title: 'Rechnungskauf',
    body: 'Ab der zweiten Bestellung ist Kauf auf Rechnung möglich. Die erste läuft per Vorkasse, bei Abholung bar oder mit Karte.',
  },
  {
    icon: Truck,
    title: 'Lieferung auf die Baustelle',
    body: 'Lagerware in der Regel in 2 – 3 Werktagen — per Paketdienst oder Direktfahrt im Umkreis von Wiesbaden.',
  },
  {
    icon: GraduationCap,
    title: 'Vor-Ort-Service',
    body: 'Auf Wunsch kommen unsere Leute zur Montage dazu. Und was wir nicht führen, besorgen wir über unser Einkaufsnetz.',
  },
];

const GEWERBE: { value: GewerbeArt; label: string }[] = [
  { value: 'galabau', label: 'GaLaBau' },
  { value: 'installateur', label: 'Installateur' },
  { value: 'fachhandel', label: 'Fachhandel' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

/**
 * Herstellerliste laut Learning Center auf green-gard.de. Vorher standen hier
 * erfundene Betriebsnamen — teils an echte Kundennamen angelehnt. Referenzen
 * dürfen nur mit Freigabe genannt werden, Hersteller sind belegbar.
 */
const HERSTELLER = [
  'Rain Bird',
  'Hunter',
  'Rain',
  'Netafim',
  'Pedrollo',
  'Speck',
  'Grundfos',
  'Kress',
  'Husqvarna',
  'In-Lite',
];

const schema = z.object({
  firma: z.string().min(2, 'Bitte Firmennamen angeben'),
  name: z.string().min(2, 'Bitte Ansprechpartner angeben'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  telefon: z.string().min(5, 'Bitte Telefonnummer angeben'),
});
type FormValues = z.infer<typeof schema>;

export default function ProfiPage() {
  // Die Gewerbe-Art kommt aus der Auswahl im Entry-Fenster: Händler müssen
  // nicht noch einmal angeben, was sie schon gesagt haben.
  const audience = useCart((s) => s.audience);
  const [gewerbe, setGewerbe] = useState<GewerbeArt>(AUDIENCES[audience].gewerbe);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [serverOk, setServerOk] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  // Nachziehen, wenn der Store hydriert ist — solange niemand selbst geklickt hat.
  useEffect(() => {
    if (!touched) setGewerbe(AUDIENCES[audience].gewerbe);
  }, [audience, touched]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-linen">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/img/gate/galabau.svg"
            alt=""
            fill
            sizes="100vw"
            data-parallax="8"
            className="object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest" />
        <div className="container relative py-32 md:py-48">
          <Eyebrow number="P" className="text-linen/70 [&>span:first-child]:bg-linen/30">
            Profi
          </Eyebrow>
          <h1 className="hero-h mt-6 max-w-4xl">
            Konditionen für <em className="italic">Profis</em>.
          </h1>
          <p className="mt-8 max-w-xl leading-relaxed text-linen/80">
            Wir führen GaLaBau-Betriebe, Installateure und Fachhändler als Partner.
            Sie übernehmen Beratung und Ausführung — wir Beschaffung, Lager und Schulung.
            Stellen Sie Ihre Konditions-Anfrage, wir senden Ihnen das Konditionsblatt
            persönlich zu.
          </p>
        </div>
      </section>

      <section className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container">
          <Eyebrow number="01">Leistungen</Eyebrow>
          <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-6xl">
            Vier <em className="italic">Vorteile</em>.
          </h2>
          <div data-reveal-group className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {USPS.map((u) => (
              <div key={u.title} className="border-t border-mist pt-6">
                <u.icon className="h-5 w-5 text-forest" />
                <h3 className="font-display mt-4 text-2xl tracking-tight">{u.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="konditionen" className="border-t border-mist bg-linen py-24 md:py-32">
        <div className="container grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow number="02">Konditionen</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-5xl">
              Persönlich <em className="italic">vereinbart</em>.
            </h2>
            <p className="mt-6 text-ink/70">
              Wir veröffentlichen keine Preislisten mit Nachlässen. Ihre Konditionen
              entstehen aus der Zusammenarbeit — Sortimentsbreite, Projektvolumen und
              Kooperationsvereinbarung. Deshalb besprechen wir sie mit Ihnen und
              hinterlegen sie anschließend in Ihrem Konto.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ol className="border-t border-mist">
              {[
                {
                  titel: 'Sie stellen sich vor',
                  text: 'Ein kurzes Formular mit Firma und Gewerbe-Art genügt — den Rest klären wir im Gespräch.',
                },
                {
                  titel: 'Wir stimmen die Konditionen ab',
                  text: 'Je nach Sortiment, Projektvolumen und Zusammenarbeit. Auf Wunsch als Kooperationsvereinbarung.',
                },
                {
                  titel: 'Ihre Preise stehen im Konto',
                  text: 'Nach der Freischaltung sehen Sie Ihre Einkaufspreise, Bestellhistorie und Projekte — nur Sie.',
                },
              ].map((s2, i) => (
                <li key={s2.titel} className="flex gap-6 border-b border-mist py-6">
                  <span className="num font-mono pt-1 text-[10px] tracking-[0.16em] text-moss">
                    0{i + 1}
                  </span>
                  <span>
                    <span className="font-display block text-2xl tracking-tight">{s2.titel}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink/70">{s2.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-mist py-24 md:py-32">
        <div className="container">
          <Eyebrow number="03">Hersteller</Eyebrow>
          <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-5xl">
            Diese Marken haben wir <em className="italic">am Lager</em>.
          </h2>
          <p className="mt-6 max-w-2xl text-ink/70">
            Was Sie hier nicht finden, besorgen wir. Fast jeden Artikel der
            Bewässerungswelt bekommen wir über unser Einkaufsnetz.
          </p>
          {/* Ruhiges Hairline-Raster statt der großen Serif-Zeile — die brach
              auf Mobile unschön um (Feedback Jan, 18.08.2026). */}
          <div data-reveal-group className="mt-12 grid grid-cols-2 gap-px border border-mist bg-mist sm:grid-cols-3 lg:grid-cols-5">
            {HERSTELLER.map((p) => (
              <div key={p} className="bg-paper px-4 py-6 text-center">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/75">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Konditions-Anfrage (18.08.2026): kein Login, keine Registrierung —
          Profis stellen eine Anfrage mit vollständigen Kontaktdaten, und
          Green-Gard sendet das Konditionsblatt persönlich zu. */}
      <section id="katalog" className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow number="04">Konditions-Anfrage</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-5xl">
              Konditionen <em className="italic">anfragen</em>.
            </h2>
            <p className="mt-6 text-ink/70">
              Kein Login, keine Registrierung: Sie senden uns Ihre Anfrage mit
              vollständigen Kontaktdaten, und wir senden Ihnen das Konditionsblatt
              persönlich zu — mit Nettopreisen je Warengruppe und Lieferbedingungen.
              Ihre individuellen Konditionen besprechen wir direkt mit Ihnen, in der
              Regel innerhalb von zwei Werktagen.
            </p>
            <p className="font-mono mt-10 text-[10px] uppercase tracking-[0.18em] text-ink/60">
              Lieber direkt sprechen?
              <a
                href={CONTACT.phoneHref}
                className="num mt-1 block text-base text-ink hover:text-bronze"
              >
                {CONTACT.phoneDisplay}
              </a>
            </p>
          </div>

          <div className="lg:col-span-7">
            {done ? (
              <div className="border border-mist bg-linen/60 p-10">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-linen">
                  <Check className="h-5 w-5" />
                </span>
                <p className="font-display mt-5 text-3xl tracking-tight">
                  {serverOk ? 'Ihre Anfrage ist eingegangen.' : 'Ihre Anfrage ist vorbereitet.'}
                </p>
                <p className="mt-3 text-ink/70">
                  {!serverOk && `${ANFRAGE_HINWEIS} `}Wir senden Ihnen das Konditionsblatt
                  innerhalb von zwei Werktagen persönlich zu und besprechen Ihre
                  individuellen Konditionen.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="primary">
                    <Link href="/produkte">Sortiment im Überblick</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/beratung#schulungen">Schulungstermine</Link>
                  </Button>
                </div>
                {!serverOk && <AnfrageFallback mailtoUrl={mailtoUrl} className="mt-8" />}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(async (values) => {
                  // Lead-Insert bleibt parallel (Mock ohne Keys). Versand läuft
                  // über Office 365; als Fallback öffnet sich das Mailprogramm.
                  await submitLead({ ...values, gewerbe_art: gewerbe });
                  const { ok, mailtoUrl: url } = await sendeAnfrage(
                    `Konditions-Anfrage: ${values.firma}`,
                    [
                      'Konditions-Anfrage über die Website — bitte Konditionsblatt zusenden',
                      '',
                      `Firma: ${values.firma}`,
                      `Gewerbe: ${gewerbe}`,
                      `Ansprechpartner: ${values.name}`,
                      `Telefon: ${values.telefon}`,
                      `E-Mail: ${values.email}`,
                    ],
                    { replyTo: values.email }
                  );
                  setMailtoUrl(url);
                  setServerOk(ok);
                  setDone(true);
                })}
                className="space-y-6 border border-mist p-8 md:p-10"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="p-firma">
                      Firmenname
                    </label>
                    <Input id="p-firma" {...register('firma')} />
                    {errors.firma && (
                      <p className="mt-1 text-xs text-red-700">{errors.firma.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="p-name">
                      Ansprechpartner
                    </label>
                    <Input id="p-name" {...register('name')} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="p-email">
                      E-Mail
                    </label>
                    <Input id="p-email" type="email" {...register('email')} />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="p-telefon">
                      Telefon
                    </label>
                    <Input id="p-telefon" {...register('telefon')} />
                    {errors.telefon && (
                      <p className="mt-1 text-xs text-red-700">{errors.telefon.message}</p>
                    )}
                  </div>
                </div>

                <fieldset>
                  <legend className="eyebrow mb-3">Gewerbe-Art</legend>
                  <div className="flex flex-wrap gap-2">
                    {GEWERBE.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        data-cursor="hover"
                        aria-pressed={gewerbe === g.value}
                        onClick={() => {
                          setTouched(true);
                          setGewerbe(g.value);
                        }}
                        className={cn(
                          'border px-5 py-2 text-sm transition-all',
                          gewerbe === g.value
                            ? 'border-forest bg-forest text-linen'
                            : 'border-mist hover:border-ink/40'
                        )}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                  Konditionen anfragen →
                </Button>
                <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
                  Ihre Daten nutzen wir ausschließlich zur Bearbeitung dieser Anfrage
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
