'use client';

import { useMemo, useState } from 'react';
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

const BERATER = [
  {
    id: 'felix',
    name: 'Felix Berger',
    role: 'Geschäftsführer · Systemplanung',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sina',
    name: 'Sina Wagner',
    role: 'Steuerung & Smart Home',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'pascal',
    name: 'Pascal Klotz',
    role: 'GaLaBau & Pumpentechnik',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
  },
];

function buildDates(): { iso: string; day: string; date: string }[] {
  const out: { iso: string; day: string; date: string }[] = [];
  const d = new Date();
  let cursor = new Date(d);
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

const schema = z.object({
  name: z.string().min(2, 'Name fehlt'),
  email: z.string().email('E-Mail-Format'),
  phone: z.string().min(5, 'Telefon fehlt'),
  flaeche: z.string().optional(),
  message: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AtelierPage() {
  const dates = useMemo(() => buildDates(), []);
  const [berater, setBerater] = useState(BERATER[0].id);
  const [date, setDate] = useState(dates[0].iso);
  const [time, setTime] = useState(TIMES[2]);
  const [done, setDone] = useState<FormValues | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  if (done) {
    const beraterObj = BERATER.find((b) => b.id === berater)!;
    return (
      <div className="container py-24 md:py-40 max-w-2xl">
        <Eyebrow>Termin bestätigt</Eyebrow>
        <h1 className="h-display text-5xl md:text-6xl mt-6">
          Danke, <em className="italic">{done.name.split(' ')[0]}</em>.
        </h1>
        <p className="text-lg text-ink/70 mt-6">
          Wir haben deinen Termin <span className="font-medium">{date} · {time}</span> mit{' '}
          <span className="font-medium">{beraterObj.name}</span> reserviert. Eine
          Bestätigung geht an {done.email}.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => alert('Mock — ICS-Datei würde hier heruntergeladen.')}>
            <Download className="h-4 w-4" /> ICS-Datei (Kalender)
          </Button>
          <Button variant="outline" onClick={() => setDone(null)}>Weiteren Termin buchen</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container">
        <Eyebrow number="D">Atelier</Eyebrow>
        <h1 className="h-display text-5xl md:text-7xl mt-6 max-w-3xl text-balance">
          Termin im <em className="italic">Atelier</em>.
        </h1>
        <p className="text-ink/70 mt-6 max-w-xl">
          30 Minuten, kostenfrei, vor Ort in Wiesbaden oder per Video. Wir hören zu,
          stellen Fragen und schicken anschließend eine erste Skizze.
        </p>

        <div className="mt-16 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <p className="eyebrow mb-4">I · Berater wählen</p>
              <div className="space-y-3">
                {BERATER.map((b) => (
                  <button
                    key={b.id}
                    data-cursor="hover"
                    onClick={() => setBerater(b.id)}
                    className={cn(
                      'w-full text-left flex items-center gap-4 border p-3 transition-all',
                      berater === b.id ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <Image src={b.avatar} alt={b.name} width={56} height={56} className="object-cover grayscale h-14 w-14" />
                    <div className="flex-1">
                      <p className="font-display text-lg tracking-tight">{b.name}</p>
                      <p className={cn('font-mono text-[10px] uppercase tracking-[0.18em] mt-0.5', berater === b.id ? 'text-linen/65' : 'text-ink/55')}>
                        {b.role}
                      </p>
                    </div>
                    {berater === b.id && <Check className="h-5 w-5" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">II · Datum</p>
              <div className="grid grid-cols-5 gap-2">
                {dates.slice(0, 10).map((d) => (
                  <button
                    key={d.iso}
                    data-cursor="hover"
                    onClick={() => setDate(d.iso)}
                    className={cn(
                      'flex flex-col items-center py-3 border transition-all text-xs',
                      date === d.iso ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                    )}
                  >
                    <span className="font-mono uppercase tracking-[0.18em] text-[9px]">{d.day}</span>
                    <span className="font-display text-base mt-1">{d.date}</span>
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
                      'num px-4 py-2 border text-sm transition-all',
                      time === t ? 'border-forest bg-forest text-linen' : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((values) => setDone(values))}
            className="lg:col-span-7 space-y-6 border-l border-mist lg:pl-12"
          >
            <p className="eyebrow">IV · Kontaktdaten</p>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="eyebrow mb-2 block">Name</label>
                <Input placeholder="Vor- und Nachname" {...register('name')} />
                {errors.name && <p className="text-xs text-red-700 mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="eyebrow mb-2 block">Telefon</label>
                <Input placeholder="0151 ..." {...register('phone')} />
                {errors.phone && <p className="text-xs text-red-700 mt-1">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="eyebrow mb-2 block">E-Mail</label>
                <Input type="email" placeholder="deine@email.de" {...register('email')} />
                {errors.email && <p className="text-xs text-red-700 mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="eyebrow mb-2 block">Gartenfläche ca.</label>
                <Input placeholder="z.B. 450 m²" {...register('flaeche')} />
              </div>
            </div>
            <div>
              <label className="eyebrow mb-2 block">Worum geht es?</label>
              <Textarea rows={5} placeholder="Kurzer Hinweis zu Wunsch, Standort, Zeithorizont …" {...register('message')} />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Termin bestätigen →
            </Button>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
              Wir antworten innerhalb von 4 Werktagsstunden.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
