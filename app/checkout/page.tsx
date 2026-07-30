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
import { lineTotal, priceFor, VAT_RATE } from '@/lib/pricing';
import { formatEUR, cn } from '@/lib/utils';
import { CONTACT } from '@/lib/contact';

const SHIPPING = [
  { id: 'paket', label: 'DHL Paket', detail: '1–3 Werktage', price: 6.9 },
  { id: 'direkt', label: 'Direktfahrt Wiesbaden', detail: 'Heute, im 80-km-Umkreis', price: 19 },
  { id: 'abholung', label: 'Abholung', detail: `${CONTACT.street}, ${CONTACT.city}`, price: 0 },
];

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

  const [shipping, setShipping] = useState('paket');
  const [payment, setPayment] = useState<'card' | 'sepa' | 'invoice' | 'prepay'>('card');
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const subtotal = items.reduce((s, l) => s + lineTotal(l.netPrice, l.qty, mode), 0);
  const shippingPrice = SHIPPING.find((s) => s.id === shipping)?.price ?? 0;
  const grossTotal =
    mode === 'privat' ? subtotal + shippingPrice : (subtotal + shippingPrice) * (1 + VAT_RATE);
  const vat = mode === 'privat' ? grossTotal - grossTotal / (1 + VAT_RATE) : (subtotal + shippingPrice) * VAT_RATE;

  function onSubmit(_values: FormValues) {
    // TODO: Stripe Payment Intent hier — STRIPE_SECRET_KEY env var.
    // Für die Demo öffnen wir ein Success-Modal und leeren den Warenkorb.
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
          Einzelprodukte legst du direkt in den Warenkorb. Ein komplettes System planen wir
          gemeinsam — Starter Kits sind Richtwerte und werden nicht direkt verkauft.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary" size="lg">
            <Link href="/produkte">Produkte ansehen</Link>
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
        <h1 className="h-display mt-6 text-5xl md:text-7xl">Abschluss.</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-7">
            <section>
              <p className="eyebrow mb-5">I · Lieferadresse</p>
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
                    Straße &amp; Nr.
                  </label>
                  <Input id="c-street" placeholder="Musterstraße 12" {...register('street')} />
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
                  <Input id="c-email" type="email" placeholder="deine@email.de" {...register('email')} />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-700">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </section>

            <section>
              <p className="eyebrow mb-5">II · Versand</p>
              <div className="space-y-3">
                {SHIPPING.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    data-cursor="hover"
                    onClick={() => setShipping(s.id)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 border p-4 text-left transition-all',
                      shipping === s.id
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <div>
                      <p className="font-display text-lg tracking-tight">{s.label}</p>
                      <p
                        className={cn(
                          'font-mono mt-1 text-[10px] uppercase tracking-[0.18em]',
                          shipping === s.id ? 'text-linen/65' : 'text-ink/55'
                        )}
                      >
                        {s.detail}
                      </p>
                    </div>
                    <span className="num font-display text-lg">
                      {s.price === 0 ? 'kostenfrei' : formatEUR(priceFor(s.price, mode))}
                    </span>
                  </button>
                ))}
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
                <span className="text-ink/60">Versand</span>
                <span className="num">
                  {shippingPrice === 0 ? '—' : formatEUR(priceFor(shippingPrice, mode))}
                </span>
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
              Jetzt kaufen
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
          <DialogTitle>Bestellung aufgenommen.</DialogTitle>
          <DialogDescription>
            Wir senden eine Bestätigung per E-Mail. Lagerware verlässt unser Haus innerhalb
            von 24 Stunden.
            <span className="font-mono mt-2 block text-[10px] uppercase tracking-[0.18em]">
              Demo — es wurde keine Zahlung durchgeführt.
            </span>
          </DialogDescription>
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
