'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Eyebrow } from '@/components/Eyebrow';
import { berechneEmpfehlung, type Bewässert, type Quelle } from '@/lib/konfigurator';
import { formatEUR, cn } from '@/lib/utils';

const QUELLEN: { value: Quelle; label: string }[] = [
  { value: 'leitung', label: 'Leitungswasser' },
  { value: 'zisterne', label: 'Zisterne' },
  { value: 'brunnen', label: 'Brunnen' },
];

const BEWAESSERT: { value: Bewässert; label: string }[] = [
  { value: 'rasen', label: 'Rasen' },
  { value: 'beete', label: 'Beete' },
  { value: 'hecken', label: 'Hecken' },
  { value: 'hochbeet', label: 'Hochbeete' },
];

export function BewaesserungsRechner() {
  const [flaeche, setFlaeche] = useState(450);
  const [quelle, setQuelle] = useState<Quelle>('leitung');
  const [bew, setBew] = useState<Bewässert[]>(['rasen', 'beete']);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const empf = useMemo(
    () => berechneEmpfehlung({ flaecheQm: flaeche, quelle, bewaessert: bew }),
    [flaeche, quelle, bew]
  );

  const paketName =
    empf.paketSlug === 'starter'
      ? 'System I · Sereno'
      : empf.paketSlug === 'pro'
        ? 'System II · Cortile'
        : 'System III · Sovereign';

  function toggleBew(v: Bewässert) {
    setBew((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));
  }

  return (
    <section className="border-t border-mist bg-paper py-24 md:py-32">
      <div className="container">
        <Eyebrow number="03">System · Planung in drei Fragen</Eyebrow>
        <h2 className="h-display text-balance text-4xl md:text-6xl mt-6 max-w-3xl">
          In drei Fragen zu deinem <span className="italic">System</span>.
        </h2>

        <div className="mt-16 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <p className="eyebrow">I · Gartenfläche</p>
                <span className="num font-display text-xl">{flaeche} m²</span>
              </div>
              <Slider value={[flaeche]} min={50} max={2000} step={50} onValueChange={(v) => setFlaeche(v[0])} />
              <div className="num mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
                <span>50 m²</span><span>2.000 m²</span>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">II · Wasserquelle</p>
              <div className="flex flex-wrap gap-2">
                {QUELLEN.map((q) => (
                  <button
                    key={q.value}
                    data-cursor="hover"
                    onClick={() => setQuelle(q.value)}
                    className={cn(
                      'px-5 py-2 text-sm border transition-all',
                      quelle === q.value
                        ? 'bg-forest text-linen border-forest'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">III · Was bewässert?</p>
              <div className="flex flex-wrap gap-2">
                {BEWAESSERT.map((b) => {
                  const active = bew.includes(b.value);
                  return (
                    <button
                      key={b.value}
                      data-cursor="hover"
                      onClick={() => toggleBew(b.value)}
                      className={cn(
                        'px-5 py-2 text-sm border transition-all',
                        active
                          ? 'bg-bronze text-linen border-bronze'
                          : 'border-mist hover:border-ink/40'
                      )}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <motion.div
            key={paketName + empf.gesamt}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 bg-forest text-linen p-8 md:p-10"
          >
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Empfehlung</p>
            <h3 className="font-display text-3xl md:text-4xl tracking-tight mt-3">{paketName}</h3>
            <p className="text-sm text-linen/70 mt-2 italic">
              ca. {flaeche} m² · {QUELLEN.find((q) => q.value === quelle)!.label}
            </p>

            <div className="mt-8 space-y-3 text-sm border-t border-linen/15 pt-6">
              <div className="flex justify-between">
                <span className="text-linen/70">Basis-System</span>
                <span className="num font-display">{formatEUR(empf.basisPreis)}</span>
              </div>
              {empf.addOns.map((a) => (
                <div key={a.label} className="flex justify-between gap-4">
                  <span className="text-linen/70">+ {a.label}</span>
                  <span className="num font-display whitespace-nowrap">{formatEUR(a.preis)}</span>
                </div>
              ))}
              <div className="border-t border-linen/15 pt-4 flex items-baseline justify-between">
                <span className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Gesamt</span>
                <span className="num font-display text-3xl">{formatEUR(empf.gesamt)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="md">
                <Link href={`/systeme#${empf.paketSlug}`}>System ansehen →</Link>
              </Button>
              <Button asChild variant="ghost" size="md" className="text-linen hover:bg-linen/10">
                <Link href="/planung">Detail-Planung</Link>
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              className="mt-8 border-t border-linen/15 pt-6"
            >
              <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30 mb-3">
                Plan per Mail · kostenfrei
              </p>
              {sent ? (
                <p className="text-sm text-bronze">
                  Wir senden den Plan an {email}.
                </p>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="email"
                    required
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 h-10 bg-transparent border-b border-linen/30 px-1 text-sm text-linen placeholder:text-linen/40 focus:outline-none focus:border-linen"
                  />
                  <button data-cursor="hover" type="submit" className="px-4 h-10 bg-bronze hover:bg-[#9e6228] text-linen text-sm inline-flex items-center gap-2 transition-colors">
                    <Mail className="h-3.5 w-3.5" /> Senden
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
