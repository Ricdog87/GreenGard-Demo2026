import Image from 'next/image';
import Link from 'next/link';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/ui/button';

export default function ManifestPage() {
  return (
    <article>
      <section className="bg-paper border-b border-mist">
        <div className="container py-24 md:py-40">
          <Eyebrow number="00">Manifest</Eyebrow>
          <h1 className="hero-h mt-8 max-w-[18ch]">
            Über zwanzig Jahre <em className="italic">Hingabe</em>.
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss mt-12">
            Wiesbaden · Est. MMIV · Kapitel I – IV
          </p>
        </div>
      </section>

      <section className="container py-24 md:py-32 max-w-3xl">
        <p className="eyebrow">Kapitel I · Beginn</p>
        <h2 className="h-display text-4xl md:text-5xl mt-6 mb-10 text-balance">
          Eine kleine Werkstatt in Wiesbaden.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Als Felix Berger 2004 mit einer Werkbank, einem Telefon und drei Rainbird-Mustern
          die Geschäftstür aufschloss, war Smart Garden noch ein abstraktes Wort. Aber
          die Idee war schon da: dass Bewässerung kein Baumarkt-Thema sein muss, sondern
          handwerkliches Architektur. Dass ein Garten Atmosphäre braucht — und dass
          Technik dabei dienen muss, nicht dominieren. Zwei Jahrzehnte später ist der
          Anspruch unverändert. Nur der Lieferwagen ist neu.
        </p>
      </section>

      <section className="bg-linen border-y border-mist py-32 md:py-40">
        <div className="container">
          <blockquote className="font-display italic text-balance text-center mx-auto max-w-5xl text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
            „Wir sind nicht im Geschäft mit Sprinklern. Wir sind im Geschäft mit Stille,
            die ein gut gepflegter Garten erlaubt."
          </blockquote>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss mt-10 text-center">
            — Felix Berger
          </p>
        </div>
      </section>

      <section className="container py-24 md:py-32 max-w-3xl">
        <p className="eyebrow">Kapitel II · Auswahl</p>
        <h2 className="h-display text-4xl md:text-5xl mt-6 mb-10 text-balance">
          Wir wählen <em className="italic">streng</em>.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Im Sortiment ist nichts, was uns nicht selbst überzeugt hätte. Hunter und
          Rainbird haben sich über Jahrzehnte bewiesen — wir bieten beide, weil sie in
          unterschiedlichen Situationen unterschiedliche Stärken haben. Netafim ist die
          unbestrittene Referenz für druckkompensierten Tropfschlauch. Pedrollo bauen
          die zuverlässigsten Pumpen, die wir je in Bestand hatten. Kress hat die
          Robotik neu erfunden — keine Begrenzungsdrähte mehr, RTK-Satellitennavigation,
          53 dB Geräusch. Und In-Lite liefert mit ihrem 12V-Steckersystem das, was
          Beleuchtung sein sollte: schnell installiert, blendfrei, jahrelang dicht.
        </p>
      </section>

      <section className="container py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden bg-linen">
              <Image
                src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=85"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                data-cursor="view"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow">Bild · I</p>
            <p className="font-display italic text-xl text-moss mt-4">
              Bewässerung beginnt vor dem ersten Tropfen — beim Verstehen, was ein
              Garten braucht.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-24 md:py-32 max-w-3xl">
        <p className="eyebrow">Kapitel III · Handwerk</p>
        <h2 className="h-display text-4xl md:text-5xl mt-6 mb-10 text-balance">
          Mit GaLaBauern auf Augenhöhe.
        </h2>
        <p className="dropcap text-lg leading-[1.7] text-ink/85">
          Wir haben uns früh entschieden, nicht direkt auf den Endkunden zu schießen.
          Wer eine Anlage installieren lässt, soll einen GaLaBauer haben, der mit unseren
          Komponenten arbeitet und für sie einsteht. Wir liefern Lager, Schulungen,
          Direktfahrten — sie liefern Hände, Verstand und Verantwortung. Diese
          Arbeitsteilung ist das eigentliche Geschäftsmodell. 450 Projekte pro Jahr
          gehen so durch — ohne dass wir die Baustellen je selbst betreten.
        </p>
      </section>

      <section className="bg-forest text-linen py-24 md:py-32 border-y border-linen/10">
        <div className="container max-w-3xl">
          <Eyebrow number="IV" className="text-linen/70 [&>span:first-child]:bg-linen/30">Brief des Geschäftsführers</Eyebrow>
          <h2 className="h-display text-4xl md:text-5xl mt-6 mb-10 text-balance">An die, die das hier lesen.</h2>
          <p className="text-lg leading-[1.7] text-linen/85">
            Wenn Sie planen, in den nächsten Jahren etwas Festes anzulegen — sei es
            der erste Smart-Garden oder die Aufrüstung einer bestehenden Anlage —
            sprechen Sie mit uns. Wir empfehlen, was zu Ihrer Situation passt, auch
            wenn das bedeutet, weniger zu verkaufen. Wir sind Händler, ja. Aber
            erstens sind wir Gärtner — und das färbt ab.
          </p>
          <p className="font-display italic text-2xl text-linen mt-12">
            Felix Berger
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-linen/60 mt-1">
            Geschäftsführer · Green-Gard GmbH
          </p>
        </div>
      </section>

      <section className="container py-24 md:py-32 text-center">
        <h2 className="h-display text-4xl md:text-6xl text-balance">
          Lust auf ein <em className="italic">Gespräch</em>?
        </h2>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <Button asChild variant="primary" size="lg"><Link href="/atelier">Termin im Atelier →</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="/planung">Planung beginnen</Link></Button>
        </div>
      </section>
    </article>
  );
}
