'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Percent, FileText, Truck, GraduationCap, Check } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const USPS = [
  { icon: Percent, title: 'Netto-Konditionen', body: 'Alle Preise netto, Mengenrabatt ab 5 Stück pro Position.' },
  { icon: FileText, title: 'Rechnungskauf', body: '30 Tage Zahlungsziel für etablierte Betriebe.' },
  { icon: Truck, title: 'Direktlieferung Baustelle', body: 'Im Großraum Wiesbaden Lieferung am selben Tag.' },
  { icon: GraduationCap, title: 'Werkstattgespräche', body: 'Schulungen zu Hydrawise, Kress-RTK und In-Lite.' },
];

const RABATTE = [
  { range: '5 – 9', percent: 5 },
  { range: '10 – 24', percent: 10 },
  { range: '25 +', percent: 15 },
];

const PARTNER = ['Eichel GaLaBau', 'Gartenbau Gängel', 'Schmitz & Sohn', 'Hofgarten Mainz', 'GBK Wiesbaden', 'Birkenhof Landschaft'];

const schema = z.object({
  firma: z.string().min(2, 'Firmenname fehlt'),
  ustid: z.string().min(4, 'USt-ID fehlt'),
  ansprech: z.string().min(2, 'Ansprechpartner fehlt'),
  email: z.string().email('E-Mail-Format'),
  phone: z.string().min(5, 'Telefon fehlt'),
  nachricht: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function HandwerkPage() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <>
      <section className="relative bg-forest text-linen overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-forest" />
        <div className="container relative py-32 md:py-48">
          <Eyebrow number="H" className="text-linen/70 [&>span:first-child]:bg-linen/30">Handwerk</Eyebrow>
          <h1 className="hero-h mt-6 max-w-4xl">
            Mehr Marge, weniger Aufwand — Green-Gard für <em className="italic">Handwerk</em>.
          </h1>
          <p className="mt-8 max-w-xl text-linen/80 leading-relaxed">
            Wir führen GaLaBau-Betriebe, Installateure und Planer als Partner.
            Sie übernehmen Beratung und Ausführung — wir die Beschaffung, Lager
            und Schulungen.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-paper border-t border-mist">
        <div className="container">
          <Eyebrow number="01">Konditionen</Eyebrow>
          <h2 className="h-display text-4xl md:text-6xl mt-6 max-w-3xl">Vier <em className="italic">Vorteile</em>.</h2>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {USPS.map((u) => (
              <div key={u.title} className="border-t border-mist pt-6">
                <u.icon className="h-5 w-5 text-forest" />
                <h3 className="font-display text-2xl tracking-tight mt-4">{u.title}</h3>
                <p className="text-ink/70 mt-2 leading-relaxed">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mengenrabatt" className="py-24 md:py-32 bg-linen border-t border-mist">
        <div className="container grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-5">
            <Eyebrow number="02">Mengenrabatt</Eyebrow>
            <h2 className="h-display text-4xl md:text-5xl mt-6">Staffelpreise <em className="italic">automatisch</em>.</h2>
            <p className="text-ink/70 mt-6">
              Rabatt wird je Position automatisch im Warenkorb angewendet.
              Sichtbar nur im Handwerk-Modus (Schalter rechts oben).
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border border-mist bg-paper">
              {RABATTE.map((r, i) => (
                <div key={r.range} className={`flex items-baseline justify-between p-6 ${i !== RABATTE.length - 1 ? 'border-b border-mist' : ''}`}>
                  <div>
                    <p className="eyebrow">Stückzahl</p>
                    <p className="font-display text-2xl tracking-tight mt-1 num">{r.range}</p>
                  </div>
                  <div className="text-right">
                    <p className="eyebrow">Rabatt</p>
                    <p className="font-display text-5xl tracking-tight mt-1 num text-bronze">−{r.percent}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-mist">
        <div className="container">
          <Eyebrow number="03">Partner</Eyebrow>
          <h2 className="h-display text-4xl md:text-5xl mt-6">Diese Handwerker arbeiten mit uns.</h2>
          <div className="mt-12 border-y border-mist py-6">
            <div className="flex flex-wrap gap-x-10 gap-y-4 font-display text-3xl md:text-4xl">
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

      <section className="py-24 md:py-32 border-t border-mist bg-paper">
        <div className="container grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Eyebrow number="04">Partner werden</Eyebrow>
            <h2 className="h-display text-4xl md:text-5xl mt-6">Werkstattgespräch <em className="italic">beantragen</em>.</h2>
            <p className="text-ink/70 mt-6">
              Wir melden uns innerhalb von zwei Werktagen und legen einen ersten
              Termin fest — entweder bei Ihnen vor Ort oder im Atelier Wiesbaden.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 mt-10">
              Sie können uns auch direkt anrufen:
              <a href="tel:+496118000000" className="block text-ink hover:text-bronze mt-1 text-base">0611 8000000</a>
            </p>
          </div>
          <div className="lg:col-span-7">
            {done ? (
              <div className="border border-mist p-10">
                <Check className="h-6 w-6 text-forest" />
                <p className="font-display text-3xl tracking-tight mt-4">Vielen Dank.</p>
                <p className="text-ink/70 mt-3">Wir melden uns innerhalb von zwei Werktagen.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(() => setDone(true))} className="space-y-6 border border-mist p-8 md:p-10">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="eyebrow block mb-2">Firmenname</label>
                    <Input {...register('firma')} />
                    {errors.firma && <p className="text-xs text-red-700 mt-1">{errors.firma.message}</p>}
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">USt-ID</label>
                    <Input placeholder="DE123456789" {...register('ustid')} />
                    {errors.ustid && <p className="text-xs text-red-700 mt-1">{errors.ustid.message}</p>}
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Ansprechpartner</label>
                    <Input {...register('ansprech')} />
                    {errors.ansprech && <p className="text-xs text-red-700 mt-1">{errors.ansprech.message}</p>}
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Telefon</label>
                    <Input {...register('phone')} />
                    {errors.phone && <p className="text-xs text-red-700 mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="eyebrow block mb-2">E-Mail</label>
                    <Input type="email" {...register('email')} />
                    {errors.email && <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="eyebrow block mb-2">Nachricht (optional)</label>
                    <Textarea rows={4} {...register('nachricht')} />
                  </div>
                </div>
                <Button type="submit" variant="primary" size="lg">
                  Werkstattgespräch beantragen →
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
