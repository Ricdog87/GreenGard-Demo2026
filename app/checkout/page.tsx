'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Check, CreditCard, FileText, Wallet } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from '@/store/cart';
import { oeffneAnfrage } from '@/lib/anfrage';
import { AnfrageFallback } from '@/components/AnfrageFallback';
import { lineTotal, priceFor, VAT_RATE } from '@/lib/pricing';
import { formatEUR, cn } from '@/lib/utils';
import { CONTACT } from '@/lib/contact';

// Schulungen finden vor Ort statt — es gibt nichts zu versenden.
const SCHULUNGSORT = `${CONTACT.company}, ${CONTACT.street}, ${CONTACT.zip} ${CONTACT.city}`;

const schema = z.object({
  name: z.string().min(2, 'Bitte Namen angeben'),
  street: z.string().min(2, 'Bitte Straße angeben'),
  zip: z.string().min(4, 'Bitte PLZ angeben'),
  city: z.string().min(2, 'Bitte Ort angeben'),
  email: z.string().email('Bitte gültige E-Mail angeben'),
});
type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const mode = useCart((s) => s.mode);
  const clear = useCart((s) => s.clear);

    const [payment, setPayment] = useState<'card' | 'sepa' | 'invoice' | 'prepay'>('card');
  const [successOpen, setSuccessOpen] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const subtotal = items.reduce((s, l) => s + lineTotal(l.netPrice, l.qty, mode), 0);
  const grossTotal = mode === 'privat' ? subtotal : subtotal * (1 + VAT_RATE);
  const vat = mode === 'privat' ? grossTotal - grossTotal / (1 + VAT_RATE) : subtotal * VAT_RATE;

  function onSubmit(values: FormValues) {
    // Go-Live ohne Backend: Anmeldung als vorbefüllte Mail — der Platz wird
    // per Rechnung bzw. Zahlungslink bestätigt (kein Stripe nötig, siehe
    // UEBERGABE.md). TODO: Server-Versand, sobald Office 365/Resend steht.
    const url = oeffneAnfrage('Schulungsanmeldung', [
      'Schulungsanmeldung über die Website',
      '',
      ...items.map((l) => `${l.qty} × ${l.name}${l.termin ? ` — Termin ${l.termin}` : ''}`),
      '',
      `Name: ${values.name}`,
      `Anschrift: ${values.street}, ${values.zip} ${values.city}`,
      `E-Mail: ${values.email}`,
    ]);
    setMailtoUrl(url);
    setSuccessOpen(true);
  }

  if (items.length === 0 && !successOpen) {
    return (
      <div className="container py-32 text-center">
        <Eyebrow>Warenkorb</Eyebrow>
        <h1 className="h-display mt-6 text-5xl md:text-6xl">
          Noch <em className="italic">leer</em>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-ink/70">
          Hier buchen Sie Schulungsplätze. Produkte und Starter Kits bestellen Sie
          künftig in unserem neuen Shop — er ist bald verfügbar.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
                    <Button asChild variant="primary" size="lg">
            <Link href="/beratung#schulungen">Schulungen ansehen</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/planung">Planung beginnen →</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="K">Kasse</Eyebrow>
                <h1 className="h-display mt-6 text-5xl md:text-7xl">Schulung buchen.</h1>
        <p className="mt-6 max-w-xl text-ink/70">
          Schulungsort: {SCHULUNGSORT}. Die Anmeldebestätigung erhalten Sie per Mail,
          den Zahlungslink separat.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <section>
                            <p className="eyebrow mb-5">I · Teilnehmerdaten</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="eyebrow mb-2 block" htmlFor="c-name">
                    Name
                  </label>
                  <Input id="c-name" placeholder="Vor- und Nachname" {...register('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-700">{errors.name.message}</p>}
                </div>
                                <div className="sm:col-span-2">
                  <label className="eyebrow mb-2 block" htmlFor="c-street">
                    Firma / Straße
                  </label>
                  <Input id="c-street" placeholder="Firma, Musterstraße 12" {...register('street')} />
                  {errors.street && (
                    <p className="mt-1 text-xs text-red-700">{errors.street.message}</p>
                  )}
                </div>
                <div>
                  <label className="eyebrow mb-2 block" htmlFor="c-zip">
                    PLZ
                  </label>
                  <Input id="c-zip" placeholder="65189" {...register('zip')} />
                  {errors.zip && <p className="mt-1 text-xs text-red-700">{errors.zip.message}</p>}
                </div>
                <div>
                  <label className="eyebrow mb-2 block" htmlFor="c-city">
                    Ort
                  </label>
                  <Input id="c-city" placeholder="Wiesbaden" {...register('city')} />
                  {errors.city && <p className="mt-1 text-xs text-red-700">{errors.city.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="eyebrow mb-2 block" htmlFor="c-email">
                    E-Mail
                  </label>
                  <Input id="c-email" type="email" placeholder="ihre@email.de" {...register('email')} />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </section>

                        <section>
              <p className="eyebrow mb-5">II · Schulungsort</p>
              <div className="border border-mist p-5">
                <p className="font-display text-lg tracking-tight">{CONTACT.company}</p>
                <p className="mt-1 text-sm text-ink/70">
                  {CONTACT.street} · {CONTACT.zip} {CONTACT.city}
                </p>
                <p className="font-mono mt-3 text-[10px] uppercase tracking-[0.18em] text-ink/55">
                  Inhouse-Schulung im eigenen Betrieb? Sagen Sie uns Bescheid — wir kommen.
                </p>
              </div>
            </section>

            <section>
              <p className="eyebrow mb-5">III · Zahlung</p>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {(
                  [
                    { id: 'card', label: 'Karte', icon: CreditCard, profiOnly: false },
                    { id: 'sepa', label: 'SEPA', icon: Wallet, profiOnly: false },
                    { id: 'prepay', label: 'Vorkasse', icon: FileText, profiOnly: false },
                    { id: 'invoice', label: 'Rechnung', icon: Building2, profiOnly: true },
                  ] as const
                ).map((p) => {
                  if (p.profiOnly && mode !== 'profi') return null;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      data-cursor="hover"
                      onClick={() => setPayment(p.id)}
                      className={cn(
                        'flex flex-col items-start gap-2 border p-4 transition-all',
                        payment === p.id
                          ? 'border-forest bg-forest text-linen'
                          : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p.icon className="h-5 w-5" />
                      <span className="font-display text-base tracking-tight">{p.label}</span>
                    </button>
                  );
                })}
              </div>
              {mode === 'profi' && (
                <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.16em] text-ink/55">
                  Rechnungskauf mit 30 Tagen Zahlungsziel für freigeschaltete Profi-Kunden
                </p>
              )}
              {payment === 'card' && (
                <p className="font-mono mt-4 border-l-2 border-copper/50 bg-linen/60 py-3 pl-4 text-[10px] uppercase tracking-[0.16em] text-ink/60">
                  Demo · echter Stripe-Flow folgt im Live-Setup
                </p>
              )}
            </section>
          </div>

          <aside className="h-fit border border-mist bg-linen p-8 lg:sticky lg:top-24 lg:col-span-5 lg:p-10">
            <p className="eyebrow mb-5">Zusammenfassung</p>
            <div className="space-y-4 text-sm">
              {items.map((l) => (
                <div key={l.slug} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-paper">
                    <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                  </div>
                                    <div className="min-w-0 flex-1">
                    <p className="font-display text-sm leading-tight">{l.name}</p>
                    {l.termin && (
                      <p className="num font-mono mt-0.5 text-[10px] uppercase tracking-[0.16em] text-bronze">
                        {l.termin}
                      </p>
                    )}
                    <p className="font-mono num mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/55">
                      {l.qty} × {formatEUR(priceFor(l.netPrice, mode))}
                    </p>
                  </div>
                  <span className="num font-display whitespace-nowrap text-sm">
                    {formatEUR(lineTotal(l.netPrice, l.qty, mode))}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-mist pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Zwischensumme</span>
                <span className="num">{formatEUR(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-ink/60">
                  {mode === 'privat' ? 'enthaltene MwSt. (19%)' : 'zzgl. MwSt. (19%)'}
                </span>
                <span className="num">{formatEUR(vat)}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-mist pt-4">
                <span className="eyebrow">Gesamt</span>
                <span className="price text-2xl">{formatEUR(grossTotal)}</span>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" className="mt-8 w-full">
              Buchung abschließen
            </Button>
            <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.18em] text-ink/50">
              Demo-Checkout · es wird keine Zahlung ausgelöst
            </p>
          </aside>
        </form>
      </div>

      <Dialog
        open={successOpen}
        onOpenChange={(o) => {
          if (!o) {
            setSuccessOpen(false);
            clear();
          }
        }}
      >
        <DialogContent>
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-forest text-linen">
            <Check className="h-6 w-6" />
          </div>
                    <DialogTitle>Platz ist reserviert.</DialogTitle>
          <DialogDescription>
            Ihr Mailprogramm öffnet sich mit der fertigen Anmeldung — bitte dort auf
            Senden tippen. Wir bestätigen den Platz per E-Mail und senden die Rechnung
            bzw. den Zahlungslink separat. Erst danach ist der Platz verbindlich gebucht.
          </DialogDescription>
          <AnfrageFallback mailtoUrl={mailtoUrl} className="mt-2" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild variant="primary">
              <Link href="/">Zur Startseite</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/produkte">Weiter stöbern</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
