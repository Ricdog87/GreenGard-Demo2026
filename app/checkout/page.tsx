'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, CreditCard, FileText, Building2, Wallet } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCart } from '@/store/cart';
import { lineTotal, priceFor, VAT_RATE } from '@/lib/pricing';
import { formatEUR, cn } from '@/lib/utils';

const SHIPPING = [
  { id: 'paket', label: 'DHL Paket', detail: '1–3 Werktage', price: 6.9 },
  { id: 'direkt', label: 'Direktfahrt Wiesbaden', detail: 'Heute, im 80 km Umkreis', price: 19 },
  { id: 'abholung', label: 'Abholung Studio', detail: 'Mainzer Straße 142', price: 0 },
];

const schema = z.object({
  name: z.string().min(2, 'Name fehlt'),
  street: z.string().min(2, 'Straße fehlt'),
  zip: z.string().min(4, 'PLZ fehlt'),
  city: z.string().min(2, 'Stadt fehlt'),
  email: z.string().email('E-Mail-Format'),
});
type FormValues = z.infer<typeof schema>;

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const mode = useCart((s) => s.mode);
  const clear = useCart((s) => s.clear);

  const [shipping, setShipping] = useState('paket');
  const [payment, setPayment] = useState<'card' | 'sepa' | 'invoice' | 'prepay'>('card');
  const [successOpen, setSuccessOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const subtotal = items.reduce((s, l) => s + lineTotal(l.netPrice, l.qty, mode), 0);
  const shippingPrice = SHIPPING.find((s) => s.id === shipping)?.price ?? 0;
  const total = subtotal + shippingPrice;
  const vat = mode === 'b2c' ? total - total / (1 + VAT_RATE) : total * VAT_RATE;
  const net = mode === 'b2c' ? total - vat : total;

  function onSubmit(_values: FormValues) {
    // TODO: Stripe Payment Intent hier — STRIPE_SECRET_KEY env var.
    // Für die Demo öffnen wir einen Success-Dialog und leeren die Mappe.
    setSuccessOpen(true);
  }

  if (items.length === 0 && !successOpen) {
    return (
      <div className="container py-32 text-center">
        <Eyebrow>Mappe</Eyebrow>
        <h1 className="h-display text-5xl md:text-6xl mt-6">Noch <em className="italic">leer</em>.</h1>
        <p className="text-ink/70 mt-6 max-w-md mx-auto">
          Lege Stücke aus der Kollektion oder ein System in die Mappe, um zur Kasse zu gehen.
        </p>
        <div className="mt-10">
          <Button asChild variant="primary" size="lg">
            <Link href="/kollektion">Kollektion entdecken</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="K">Kasse</Eyebrow>
        <h1 className="h-display text-5xl md:text-7xl mt-6">Abschluss.</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-16 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            <section>
              <p className="eyebrow mb-5">I · Lieferadresse</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-2">Name</label>
                  <Input placeholder="Vor- und Nachname" {...register('name')} />
                  {errors.name && <p className="text-xs text-red-700 mt-1">{errors.name.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-2">Straße & Nr.</label>
                  <Input placeholder="Musterstraße 12" {...register('street')} />
                </div>
                <div>
                  <label className="eyebrow block mb-2">PLZ</label>
                  <Input placeholder="65189" {...register('zip')} />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Stadt</label>
                  <Input placeholder="Wiesbaden" {...register('city')} />
                </div>
                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-2">E-Mail</label>
                  <Input type="email" placeholder="deine@email.de" {...register('email')} />
                  {errors.email && <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>}
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
                      'w-full flex items-center justify-between p-4 border transition-all text-left',
                      shipping === s.id ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <div>
                      <p className="font-display text-lg tracking-tight">{s.label}</p>
                      <p className={cn('font-mono text-[10px] uppercase tracking-[0.18em] mt-1', shipping === s.id ? 'text-linen/65' : 'text-ink/55')}>
                        {s.detail}
                      </p>
                    </div>
                    <span className="num font-display text-lg">{s.price === 0 ? 'kostenfrei' : formatEUR(s.price)}</span>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <p className="eyebrow mb-5">III · Zahlung</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {([
                  { id: 'card', label: 'Karte', icon: CreditCard, b2bOnly: false },
                  { id: 'sepa', label: 'SEPA', icon: Wallet, b2bOnly: false },
                  { id: 'prepay', label: 'Vorkasse', icon: FileText, b2bOnly: false },
                  { id: 'invoice', label: 'Rechnung', icon: Building2, b2bOnly: true },
                ] as const).map((p) => {
                  if (p.b2bOnly && mode !== 'b2b') return null;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      data-cursor="hover"
                      onClick={() => setPayment(p.id)}
                      className={cn(
                        'flex flex-col items-start gap-2 p-4 border transition-all',
                        payment === p.id ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                      )}
                    >
                      <p.icon className="h-5 w-5" />
                      <span className="font-display text-base tracking-tight">{p.label}</span>
                    </button>
                  );
                })}
              </div>
              {payment === 'card' && (
                <div className="mt-4 p-4 bg-linen text-sm border-l-2 border-bronze font-mono uppercase tracking-[0.12em] text-[10px]">
                  Demo · echter Stripe-Flow folgt im Live-Setup
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-5 bg-linen p-8 lg:p-10 border border-mist h-fit lg:sticky lg:top-24">
            <p className="eyebrow mb-5">Zusammenfassung</p>
            <div className="space-y-4 text-sm">
              {items.map((l) => (
                <div key={l.slug} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 bg-paper overflow-hidden">
                    <Image src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm leading-tight">{l.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/55 num mt-1">{l.qty} × {formatEUR(priceFor(l.netPrice, mode))}</p>
                  </div>
                  <span className="num font-display text-sm whitespace-nowrap">{formatEUR(lineTotal(l.netPrice, l.qty, mode))}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-mist mt-6 pt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Zwischensumme</span><span className="num">{formatEUR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ink/60">Versand</span><span className="num">{shippingPrice === 0 ? '—' : formatEUR(shippingPrice)}</span></div>
              <div className="flex justify-between"><span className="text-ink/60">{mode === 'b2c' ? `enthaltene MwSt. (19%)` : `zzgl. MwSt. (19%)`}</span><span className="num">{formatEUR(vat)}</span></div>
              <div className="flex justify-between items-baseline border-t border-mist pt-4 mt-3">
                <span className="eyebrow">Gesamt</span>
                <span className="price text-2xl">{formatEUR(mode === 'b2c' ? total : net + vat)}</span>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full mt-8">
              Jetzt kaufen
            </Button>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 mt-4">
              Mock-Checkout · keine Zahlung wird tatsächlich abgewickelt.
            </p>
          </aside>
        </form>
      </div>

      <Dialog open={successOpen} onOpenChange={(o) => { if (!o) { setSuccessOpen(false); clear(); } }}>
        <DialogContent>
          <div className="grid h-14 w-14 place-items-center rounded-full bg-forest text-linen mb-4">
            <Check className="h-6 w-6" />
          </div>
          <DialogTitle>Bestellung aufgenommen.</DialogTitle>
          <DialogDescription>
            Wir senden dir eine Bestätigung per E-Mail. Lagerware versendet
            innerhalb von 24 Stunden. <span className="font-mono text-[10px] uppercase tracking-[0.18em] block mt-2">Hinweis: Dies ist eine Demo — keine Zahlung wurde durchgeführt.</span>
          </DialogDescription>
          <div className="mt-4 flex gap-3">
            <Button asChild variant="primary"><Link href="/">Zurück zur Startseite</Link></Button>
            <Button asChild variant="outline"><Link href="/kollektion">Weiter stöbern</Link></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
