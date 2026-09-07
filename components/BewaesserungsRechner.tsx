'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/Eyebrow';
import {
  berechneEmpfehlung,
  QUELLE_LABEL,
  type Flaechentyp,
  type Quelle,
  type Steuerung,
} from '@/lib/konfigurator';
import { useCart } from '@/store/cart';
import { oeffneAnfrage } from '@/lib/anfrage';
import { AnfrageFallback } from '@/components/AnfrageFallback';
import { priceFor, priceLabel } from '@/lib/pricing';
import { formatEURRound, cn } from '@/lib/utils';

const QUELLEN: Quelle[] = ['leitung', 'zisterne', 'brunnen'];
const BEREICHE: { value: Flaechentyp; label: string }[] = [
  { value: 'rasen', label: 'Rasenfläche' },
  { value: 'beete', label: 'Beetfläche' },
];

/**
 * Kompaktversion der Planung auf der Landing — dieselben 3 Kernfragen plus
 * WLAN-Abfrage wie /planung, damit beide dieselbe Empfehlung ausgeben.
 */
export function BewaesserungsRechner() {
  const mode = useCart((s) => s.mode);
  const [flaeche, setFlaeche] = useState(450);
  const [quelle, setQuelle] = useState<Quelle>('leitung');
  const [bereiche, setBereiche] = useState<Flaechentyp[]>(['rasen']);
  const [steuerung, setSteuerung] = useState<Steuerung>('smart');
  // Feedback Jan 07.09.2026: mindestens Name und Telefon abfragen, damit
  // Green-Gard nachfassen kann — nicht nur die E-Mail.
  const [name, setName] = useState('');
  const [telefon, setTelefon] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState('');

  // Aufteilung der Gesamtfläche wie im Planungs-Assistenten: Beete ~25 %,
  // der Rest Rasen — gezählt wird nur, was bewässert werden soll. Der Rasen
  // ist die Differenz statt eigener Rundung, sonst summieren sich die
  // Teilflächen nicht zur Gartenfläche (450 → „451 m² bewässert“). Und wer
  // nur Beete wählt, bekommt den Beet-Anteil berechnet, nicht das ganze
  // Grundstück — genau wie die Vorbelegung auf /planung.
  const { rasenQm, beetQm } = useMemo(() => {
    const beet = Math.round(flaeche * 0.25);
    return {
      rasenQm: bereiche.includes('rasen') ? flaeche - beet : 0,
      beetQm: bereiche.includes('beete') ? beet : 0,
    };
  }, [flaeche, bereiche]);

  const empf = useMemo(
    () =>
      berechneEmpfehlung({
        flaecheQm: flaeche,
        quelle,
        bereiche,
        rasenQm,
        beetQm,
        steuerung,
      }),
    [flaeche, quelle, bereiche, rasenQm, beetQm, steuerung]
  );

  // Auf der Karte erklären, was die Zahlen bedeuten: Pumpen-Hinweis der
  // Wasserquelle plus „berechnet auf die bewässerte Fläche“, sobald nicht das
  // ganze Grundstück bewässert wird — sonst wirken 337 von 450 m² wie ein Fehler.
  const kartenHinweise = empf.hinweise.filter(
    (h) => h.startsWith('Pumpe') || h.includes('nicht enthalten') || h.startsWith('Berechnet auf')
  );

  function toggleBereich(v: Flaechentyp) {
    setBereiche((cur) => {
      // Mindestens ein Bereich muss gewählt bleiben.
      if (cur.includes(v)) return cur.length === 1 ? cur : cur.filter((x) => x !== v);
      return [...cur, v];
    });
  }

  return (
    <section className="border-t border-mist bg-paper py-24 md:py-32">
      <div className="container">
        <Eyebrow number="04">Planung</Eyebrow>
        <h2 data-reveal className="h-display mt-6 max-w-3xl text-balance text-4xl md:text-6xl">
          Drei Fragen. Ein <em className="italic">ehrlicher</em> Preisrahmen.
        </h2>

        {/* min-w-0 an beiden Grid-Items: sonst zieht die intrinsische Breite des
            E-Mail-Felds die Spalte auf 375px+ und die Seite scrollt horizontal. */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div data-reveal-group className="min-w-0 space-y-12 lg:col-span-7">
            <div>
              <div className="mb-4 flex items-baseline justify-between">
                <p className="eyebrow">I · Gartenfläche</p>
                <span className="num font-display text-xl">{flaeche} m²</span>
              </div>
              <Slider
                value={[flaeche]}
                min={50}
                max={2000}
                step={50}
                onValueChange={(v) => setFlaeche(v[0])}
                aria-label="Gartenfläche in Quadratmetern"
              />
              <div className="num font-mono mt-3 flex justify-between text-[10px] uppercase tracking-[0.18em] text-ink/50">
                <span>50 m²</span>
                <span>2.000 m²</span>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">II · Wasserquelle</p>
              <div className="flex flex-wrap gap-2">
                {QUELLEN.map((q) => (
                  <button
                    key={q}
                    data-cursor="hover"
                    onClick={() => setQuelle(q)}
                    className={cn(
                      'border px-5 py-2 text-sm transition-all',
                      quelle === q
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {QUELLE_LABEL[q]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">III · Was wird bewässert?</p>
              <div className="flex flex-wrap gap-2">
                {BEREICHE.map((b) => (
                  <button
                    key={b.value}
                    data-cursor="hover"
                    onClick={() => toggleBereich(b.value)}
                    className={cn(
                      'border px-5 py-2 text-sm transition-all',
                      bereiche.includes(b.value)
                        ? 'border-bronze bg-bronze text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p className="num font-mono mt-3 text-[10px] uppercase tracking-[0.18em] text-ink/50">
                {rasenQm > 0 && `Rasen ca. ${rasenQm} m²`}
                {rasenQm > 0 && beetQm > 0 && ' · '}
                {beetQm > 0 && `Beete ca. ${beetQm} m²`}
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4">IV · Steuerung per WLAN?</p>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { v: 'smart' as Steuerung, l: 'Ja, smart per App' },
                    { v: 'manuell' as Steuerung, l: 'Nein, manuell' },
                  ]
                ).map((o) => (
                  <button
                    key={o.v}
                    data-cursor="hover"
                    onClick={() => setSteuerung(o.v)}
                    className={cn(
                      'border px-5 py-2 text-sm transition-all',
                      steuerung === o.v
                        ? 'border-forest bg-forest text-linen'
                        : 'border-mist hover:border-ink/40'
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            key={empf.kitSlug + empf.gesamtNetto}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-w-0 bg-forest p-8 text-linen md:p-10 lg:col-span-5"
          >
            <p className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">Empfehlung</p>
            <h3 className="font-display mt-3 text-3xl tracking-tight md:text-4xl">{empf.kitName}</h3>
            <p className="mt-2 text-sm italic text-linen/70">
              {empf.bewaesserteFlaeche} m² bewässert · {QUELLE_LABEL[quelle]} ·{' '}
              {steuerung === 'smart' ? 'WLAN-Steuerung' : 'manuelle Steuerung'}
            </p>

            {/* Zahlen nach der Preisliste von Green-Gard: Material nach Fläche
                plus Zuschlag je Wasserquelle. */}
            <div className="mt-8 space-y-3 border-t border-linen/15 pt-6 text-sm">
              {empf.kosten.map((k) => (
                <div key={k.label} className="flex justify-between gap-4">
                  <span className="text-linen/70">{k.label}</span>
                  <span className="num font-display whitespace-nowrap">
                    {formatEURRound(priceFor(k.netto, mode))}
                  </span>
                </div>
              ))}
              <div className="flex items-baseline justify-between border-t border-linen/15 pt-4">
                <span className="eyebrow text-linen/60 [&>span:first-child]:bg-linen/30">
                  Materialkosten ca.
                </span>
                <span className="num font-display text-3xl">
                  {formatEURRound(priceFor(empf.gesamtNetto, mode))}
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-linen/50">
                {priceLabel(mode)} · unverbindlicher Richtwert, kein Angebot · ohne Montage und Erdarbeiten
              </p>
            </div>

            {kartenHinweise.map((h) => (
              <p key={h} className="mt-4 border-l-2 border-bronze/60 pl-3 text-xs leading-relaxed text-linen/65">
                {h}
              </p>
            ))}

            {/* „Kit ansehen“ entfernt (Kundenfeedback 18.08.2026) — der Weg
                führt in die Planung, nicht zu den Kits. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent">
                <Link href="/planung">Vollständige Planung →</Link>
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!name || !telefon || !email) return;
                // Go-Live ohne Backend: Anfrage als vorbefüllte Mail.
                // TODO: Resend + Supabase-Lead (UEBERGABE.md).
                const url = oeffneAnfrage(`Planungsanfrage: ${flaeche} m², ${QUELLE_LABEL[quelle]}`, [
                  'Planungsanfrage von der Startseite',
                  '',
                  `Grundstück: ${flaeche} m² (${QUELLE_LABEL[quelle]})`,
                  `Bereiche: ${bereiche.join(', ')} · Steuerung: ${steuerung}`,
                  '',
                  `Name: ${name}`,
                  `Telefon: ${telefon}`,
                  `E-Mail: ${email}`,
                ]);
                setMailtoUrl(url);
                setSent(true);
              }}
              className="mt-8 border-t border-linen/15 pt-6"
            >
              <p className="eyebrow mb-3 text-linen/60 [&>span:first-child]:bg-linen/30">
                Plan per Mail
              </p>
              {sent ? (
                <div className="space-y-3">
                  <p className="text-sm text-bronze">Mail vorbereitet — bitte im Mailprogramm senden.</p>
                  <AnfrageFallback mailtoUrl={mailtoUrl} dark />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Ihr Name"
                    className="h-10 w-full min-w-0 border-b border-linen/30 bg-transparent px-1 text-sm text-linen placeholder:text-linen/40 focus:border-linen focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Telefon *"
                    value={telefon}
                    onChange={(e) => setTelefon(e.target.value)}
                    aria-label="Ihre Telefonnummer"
                    className="h-10 w-full min-w-0 border-b border-linen/30 bg-transparent px-1 text-sm text-linen placeholder:text-linen/40 focus:border-linen focus:outline-none"
                  />
                  <div className="flex gap-3">
                    <input
                      type="email"
                      required
                      placeholder="E-Mail *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="E-Mail für den Plan"
                      className="h-10 min-w-0 flex-1 border-b border-linen/30 bg-transparent px-1 text-sm text-linen placeholder:text-linen/40 focus:border-linen focus:outline-none"
                    />
                    <button
                      data-cursor="hover"
                      type="submit"
                      className="inline-flex h-10 items-center gap-2 bg-bronze px-4 text-sm text-linen transition-colors hover:bg-[#9e6228]"
                    >
                      <Mail className="h-3.5 w-3.5" /> Senden
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-linen/50">
                    Name und Telefon, damit wir für die Planung persönlich zurückrufen können.
                  </p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
