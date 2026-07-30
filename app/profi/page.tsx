'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, FileText, GraduationCap, Percent, Truck } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitLead, type GewerbeArt } from '@/lib/supabase';
import { DISCOUNT_TIERS } from '@/lib/pricing';
import { CONTACT } from '@/lib/contact';
import { cn } from '@/lib/utils';

const USPS = [
  {
    icon: Percent,
    title: 'Nettopreise',
    body: 'Alle Preise netto, Staffelrabatt ab fünf Stück je Position — direkt im Shop sichtbar, sobald Sie auf Profi umstellen.',
  },
  {
    icon: FileText,
    title: 'Rechnungskauf',
    body: '30 Tage Zahlungsziel für etablierte Betriebe, ohne Vorkasse und ohne Kreditkarte.',
  },
  {
    icon: Truck,
    title: 'Direktlieferung',
    body: 'Im Großraum Wiesbaden liefern wir auf Wunsch am selben Tag direkt auf die Baustelle.',
  },
  {
    icon: GraduationCap,
    title: 'Schulungen',
    body: 'Hydrawise, Kress-RTK und In-Lite-Lichtplanung — bei uns im Studio oder inhouse in Ihrem Betrieb.',
  },
];

const GEWERBE: { value: GewerbeArt; label: string }[] = [
  { value: 'galabau', label: 'GaLaBau' },
  { value: 'installateur', label: 'Installateur' },
  { value: 'fachhandel', label: 'Fachhandel' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

const PARTNER = [
  'Eichel GaLaBau',
  'Gartenbau Gängel',
  'Schmitz & Sohn',
  'Hofgarten Mainz',
  'GBK Wiesbaden',
  'Birkenhof Landschaft',
];

const schema = z.object({
  firma: z.string().min(2, 'Bitte Firmennamen angeben'),
  name: z.string().min(2, 'Bitte Ansprechpartner angeben'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  telefon: z.string().min(5, 'Bitte Telefonnummer angeben'),
});
type FormValues = z.infer<typeof schema>;

export default function ProfiPage() {
  const [gewerbe, setGewerbe] = useState<GewerbeArt>('galabau');
  const [done, setDone] = useState(false);

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
            src="/img/kits/bewaesserung-komfort.svg"
            alt=""
            fill
            sizes="100vw"
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
            Den vollständigen Konditionskatalog senden wir Ihnen zu.
          </p>
        </div>
      </section>

      <section className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container">
          <Eyebrow number="01">Leistungen</Eyebrow>
          <h2 className="h-display mt-6 max-w-3xl text-4xl md:text-6xl">
            Vier <em className="italic">Vorteile</em>.
          </h2>
          <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
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

      <section id="staffelrabatt" className="border-t border-mist bg-linen py-24 md:py-32">
        <div className="container grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow number="02">Staffelrabatt</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-5xl">
              Staffelpreise <em className="italic">automatisch</em>.
            </h2>
            <p className="mt-6 text-ink/70">
              Der Rabatt wird je Position automatisch berechnet, sobald die Preisansicht
              oben rechts auf Profi steht. Größere Projektmengen kalkulieren wir
              individuell.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-mist bg-paper">
              {DISCOUNT_TIERS.map((r, i) => (
                <div
                  key={r.range}
                  className={cn(
                    'flex items-baseline justify-between p-6',
                    i !== DISCOUNT_TIERS.length - 1 && 'border-b border-mist'
                  )}
                >
                  <div>
                    <p className="eyebrow">Stückzahl je Position</p>
                    <p className="num font-display mt-1 text-2xl tracking-tight">{r.range}</p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow">Rabatt</p>
                    <p className="num font-display mt-1 text-5xl tracking-tight text-bronze">
                      −{r.percent}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-mist py-24 md:py-32">
        <div className="container">
          <Eyebrow number="03">Partner</Eyebrow>
          <h2 className="h-display mt-6 text-4xl md:text-5xl">
            Diese Betriebe arbeiten mit uns.
          </h2>
          <div className="mt-12 border-y border-mist py-6">
            <div className="font-display flex flex-wrap gap-x-10 gap-y-4 text-3xl md:text-4xl">
              {PARTNER.map((p, i) => (
                <span key={p} className="inline-flex items-center gap-10 text-ink/80">
                  {p}
                  {i !== PARTNER.length - 1 && <span className="text-bronze">·</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lead-Gate: Konditionskatalog gegen Kontaktdaten */}
      <section id="katalog" className="border-t border-mist bg-paper py-24 md:py-32">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow number="04">Konditionskatalog</Eyebrow>
            <h2 className="h-display mt-6 text-4xl md:text-5xl">
              Katalog <em className="italic">anfordern</em>.
            </h2>
            <p className="mt-6 text-ink/70">
              Sie erhalten die vollständige Konditionsübersicht als PDF: Nettopreise je
              Warengruppe, Staffeln, Projektkonditionen und Schulungstermine. Wir melden
              uns innerhalb von zwei Werktagen persönlich.
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
                  Ihr Konditionskatalog ist unterwegs.
                </p>
                <p className="mt-3 text-ink/70">
                  Wir haben Ihre Anfrage aufgenommen und melden uns innerhalb von zwei
                  Werktagen. In der Zwischenzeit können Sie die Preisansicht oben rechts
                  auf <span className="font-medium">Profi</span> stellen — dann sehen Sie
                  im Shop bereits Nettopreise inklusive Staffelrabatt.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild variant="primary">
                    <Link href="/produkte">Sortiment mit Nettopreisen</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/beratung#schulungen">Schulungstermine</Link>
                  </Button>
                </div>
                <p className="font-mono mt-8 text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Demo · es wurde keine Mail versendet
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(async (values) => {
                  // TODO: Supabase leads-Tabelle + Email-Trigger (Resend) —
                  // solange keine Keys gesetzt sind, landet das im Mock-Zweig.
                  await submitLead({ ...values, gewerbe_art: gewerbe });
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
                        onClick={() => setGewerbe(g.value)}
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
                  Konditionskatalog anfordern →
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
