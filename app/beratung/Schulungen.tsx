'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Users } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { submitSchulungBuchung } from '@/lib/supabase';
import { useCart } from '@/store/cart';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEURRound, cn } from '@/lib/utils';
import { schulungen, type Schulung } from '@/lib/data';

const schema = z.object({
  name: z.string().min(2, 'Bitte Namen angeben'),
  firma: z.string().min(2, 'Bitte Firma angeben'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
  teilnehmer: z.coerce.number().int().min(1, 'Mindestens 1').max(20, 'Maximal 20'),
});
type FormValues = z.infer<typeof schema>;

export function Schulungen() {
  const mode = useCart((s) => s.mode);
  const [active, setActive] = useState<Schulung | null>(null);
  const [termin, setTermin] = useState<string>('');
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { teilnehmer: 1 },
  });

  function openBooking(s: Schulung, t: string) {
    setActive(s);
    setTermin(t);
    setSent(false);
    reset({ teilnehmer: 1 });
  }

  return (
    <section id="schulungen" className="border-t border-mist bg-linen py-24 md:py-32">
      <div className="container">
        <Eyebrow number="S">Schulungen</Eyebrow>
        <h2 className="h-display mt-6 max-w-3xl text-balance text-4xl md:text-6xl">
          Wissen, das <em className="italic">auf der Baustelle</em> hält.
        </h2>
        <p className="mt-6 max-w-2xl text-ink/70">
          Praxisnahe Schulungen in Wiesbaden — für GaLaBau-Betriebe, Installateure und
          Planungsbüros. Kleine Gruppen, echte Anlagen, kein Folienvortrag.
        </p>

        <div data-reveal-group className="mt-14 grid gap-6 lg:grid-cols-3">
          {schulungen.map((s) => (
            <article key={s.slug} className="flex flex-col border border-mist bg-paper p-8">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss">
                {s.roman}
              </span>
              <h3 className="font-display mt-2 text-2xl tracking-tight md:text-3xl">{s.title}</h3>
              <p className="font-mono mt-2 text-[11px] uppercase tracking-[0.16em] text-ink/60">
                {s.duration}
              </p>
              <p className="mt-4 text-sm italic text-moss">Für {s.audience}</p>

              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink/80">
                {s.content.map((c) => (
                  <li key={c} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-mist pt-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    ab
                  </span>
                  <span className="price text-3xl">
                    {formatEURRound(priceFor(s.abPreis, mode))}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                    {priceLabel(mode)} / Person
                  </span>
                </div>
                <p className="font-mono mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  <Users className="h-3.5 w-3.5" /> max. <span className="num">{s.plaetze}</span>{' '}
                  Plätze
                </p>

                <p className="eyebrow mt-5 mb-2">Termine</p>
                <div className="flex flex-wrap gap-2">
                  {s.termine.map((t) => (
                    <button
                      key={t}
                      data-cursor="hover"
                      onClick={() => openBooking(s, t)}
                      className={cn(
                        'num border border-mist px-3 py-1.5 text-xs transition-colors',
                        'hover:border-forest hover:bg-forest hover:text-linen'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <Button
                  variant="primary"
                  className="mt-6 w-full"
                  onClick={() => openBooking(s, s.termine[0])}
                >
                  Platz buchen
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono mt-10 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-ink/50">
          Inhouse-Schulung im eigenen Betrieb auf Anfrage · Zahlung per Rechnung oder
          Zahlungslink
        </p>
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          {sent ? (
            <>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-linen">
                <Check className="h-5 w-5" />
              </span>
              <DialogTitle>Platz ist reserviert.</DialogTitle>
              <DialogDescription>
                Wir haben Ihre Anmeldung für <span className="font-medium">{active?.title}</span> am{' '}
                <span className="num font-medium">{termin}</span> notiert. Den Zahlungslink
                senden wir per Mail — erst danach ist der Platz verbindlich gebucht.
                <span className="font-mono mt-3 block text-[10px] uppercase tracking-[0.18em]">
                  Demo: keine Mail, keine Zahlung.
                </span>
              </DialogDescription>
              <Button variant="outline" onClick={() => setActive(null)}>
                Schließen
              </Button>
            </>
          ) : (
            <>
              <p className="eyebrow">Platz buchen</p>
              <DialogTitle>{active?.title}</DialogTitle>
              <DialogDescription>
                Termin <span className="num">{termin}</span> · {active?.duration} · ab{' '}
                {active ? formatEURRound(priceFor(active.abPreis, mode)) : ''} pro Person
              </DialogDescription>
              <form
                className="mt-2 space-y-4"
                onSubmit={handleSubmit(async (values) => {
                  // TODO: Stripe Payment Links pro Termin, Konzept folgt in 2–4 Wochen vom Kunden.
                  await submitSchulungBuchung({
                    schulung: active?.title ?? '',
                    termin,
                    ...values,
                  });
                  setSent(true);
                })}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="s-name">
                      Name
                    </label>
                    <Input id="s-name" {...register('name')} />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="s-firma">
                      Firma
                    </label>
                    <Input id="s-firma" {...register('firma')} />
                    {errors.firma && (
                      <p className="mt-1 text-xs text-red-700">{errors.firma.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="s-email">
                      E-Mail
                    </label>
                    <Input id="s-email" type="email" {...register('email')} />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="eyebrow mb-2 block" htmlFor="s-teilnehmer">
                      Teilnehmer
                    </label>
                    <Input
                      id="s-teilnehmer"
                      type="number"
                      min={1}
                      max={active?.plaetze ?? 20}
                      {...register('teilnehmer')}
                    />
                    {errors.teilnehmer && (
                      <p className="mt-1 text-xs text-red-700">{errors.teilnehmer.message}</p>
                    )}
                  </div>
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  Anmeldung senden →
                </Button>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/50">
                  Zahlungslink folgt per Mail
                </p>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
