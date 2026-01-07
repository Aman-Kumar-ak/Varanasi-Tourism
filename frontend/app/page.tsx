import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Hero – Focus on Varanasi */}
      <section className="relative overflow-hidden">
        {/* Main hero background re-using the Varanasi primary tone */}
        <div className="absolute inset-0 bg-primary-blue" />
        {/* New subtle radial accents */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_#38bdf8_0,_transparent_55%),radial-gradient(circle_at_bottom,_#f97316_0,_transparent_55%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex flex-col md:flex-row items-center gap-10">
          {/* Text side */}
          <div className="w-full md:w-3/5 space-y-6 text-white">
            <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-sky-200/90 bg-white/5 rounded-full px-3 py-1 backdrop-blur">
              <span className="text-base">●</span>
              Eternal City on the Ganga
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Discover Varanasi,
              <span className="block mt-1 text-sky-100">
                the Spiritual Heart of India
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-sky-100/85 max-w-xl leading-relaxed">
              Walk along the ghats, experience the evening aarti, explore ancient
              lanes and temples – all in a single, carefully crafted city guide
              built just for Varanasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/city/varanasi"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-sky-900/40 bg-white text-slate-900 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 focus-visible:ring-offset-primary-blue transition-colors"
              >
                Explore Varanasi Guide
                <span className="ml-2 text-lg" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <a
                href="#varanasi-overview"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-medium border border-sky-200/70 text-sky-50/90 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-200 focus-visible:ring-offset-primary-blue transition-colors"
              >
                Why Varanasi?
              </a>
            </div>
          </div>

          {/* Highlight card side – merges stats + quick intro */}
          <div className="w-full md:w-1/2 lg:w-[46%] xl:w-[42%]">
            <div className="rounded-3xl bg-slate-950/70 border border-sky-500/40 shadow-[0_18px_60px_rgba(15,23,42,0.8)] backdrop-blur-xl p-5 sm:p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 mb-2">
                  Varanasi at a glance
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  One compact guide that covers ghats, temples, rituals, food,
                  stay options and how to get around – designed to work
                  beautifully on both phone and desktop.
                </p>
              </div>

               {/* Combined info row: 3 pillars in one card */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm md:text-sm">
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/40 p-3 sm:p-4 md:p-5 flex flex-col gap-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/15 text-lg" aria-hidden="true">
                      🌊
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight">
                      Ghats &amp; Aarti
                    </p>
                  </div>
                  <p className="text-slate-300/95 leading-snug">
                    Sunrise boat rides, important ghats and evening Ganga Aarti details.
                  </p>
                </div>
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-violet-400/40 p-3 sm:p-4 md:p-5 flex flex-col gap-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 text-lg" aria-hidden="true">
                      🕉️
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight">
                      Temples
                    </p>
                  </div>
                  <p className="text-slate-300/95 leading-snug">
                    Kashi Vishwanath and other key spiritual stops woven into one trail.
                  </p>
                </div>
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-400/45 p-3 sm:p-4 md:p-5 flex flex-col gap-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-lg" aria-hidden="true">
                      🧭
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight">
                      Practical
                    </p>
                  </div>
                  <p className="text-slate-300/95 leading-snug">
                    How to reach, move around, and stay comfortably without over-planning.
                  </p>
                </div>
              </div>

              {/* Small reassurance strip */}
              <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs text-slate-200/90">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-emerald-400/40 px-3 py-1 shadow-sm">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/30 text-[10px]" aria-hidden="true">
                    ✓
                  </span>
                  <span>Conversational &amp; easy to read</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-emerald-400/40 px-3 py-1 shadow-sm">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/30 text-[10px]" aria-hidden="true">
                    ✓
                  </span>
                  <span>Optimized for slow networks</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview card – history + best time + feel of the city merged */}
      <section
        id="varanasi-overview"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16"
      >
        <div className="rounded-3xl bg-white/80 sm:bg-white shadow-xl shadow-slate-900/5 border border-slate-200/80 p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <header className="space-y-2 sm:space-y-3">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
              About the guide
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Everything you need to feel prepared before you reach Varanasi
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
              Instead of overwhelming you with dozens of pages, this guide keeps
              Varanasi in a single flow – from first impression to deep
              spiritual experiences – so you can simply scroll and get ready.
            </p>
          </header>

          {/* Three-in-one content row */}
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  📜
                </span>
                Living history
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Learn why Varanasi is considered one of the oldest living
                cities, how the ghats evolved, and what makes this stretch of
                the Ganga so sacred.
              </p>
            </article>

            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  ☀️
                </span>
                Seasons &amp; mood
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Understand what Varanasi feels like in winter, summer and monsoon,
                with simple guidance on when the ghats and lanes are most
                pleasant to explore.
              </p>
            </article>

            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  🧳
                </span>
                What to expect
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get a realistic sense of crowds, sounds, early mornings and late
                evenings so you and your family know what the city&apos;s rhythm
                actually feels like.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Highlight experiences – still only about Varanasi */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-16">
        <div className="grid gap-5 lg:grid-cols-[1.4fr,1fr] items-stretch">
          {/* Left: combined experiences card */}
          <div className="rounded-3xl bg-slate-900 text-slate-50 shadow-2xl shadow-slate-900/40 p-6 sm:p-7 lg:p-8 space-y-5 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_#22c55e_0,_transparent_60%),radial-gradient(circle_at_bottom_right,_#f97316_0,_transparent_60%)]" />
            <div className="relative space-y-3">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-200">
                Experiences
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug">
                Ghats, temples, food and lanes – curated in one continuous
                Varanasi story.
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/90 max-w-xl">
                The Varanasi page walks you through a suggested flow for a
                one–three day visit – morning on the river, daytime temple and
                heritage walks, and evenings by the ghats.
              </p>
            </div>

            <div className="relative grid gap-3 sm:grid-cols-3 mt-4 text-xs sm:text-sm">
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🚣
                </span>
                <p className="font-semibold">River &amp; ghats</p>
                <p className="text-emerald-50/80">
                  Sunrise boat rides, important ghats and etiquette.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🛕
                </span>
                <p className="font-semibold">Spiritual trail</p>
                <p className="text-emerald-50/80">
                  Key temples, aartis and quiet corners for reflection.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🍛
                </span>
                <p className="font-semibold">Local flavours</p>
                <p className="text-emerald-50/80">
                  Street food, chai spots and simple sit-down meals nearby.
                </p>
              </div>
            </div>
          </div>

          {/* Right: simple “how to use this guide” card */}
          <div className="rounded-3xl bg-white shadow-lg shadow-slate-900/5 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                Use this guide like a companion, not a brochure.
              </h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">1.</span>
                  <span>
                    Start with the overview and history to tune in to the city&apos;s
                    pace.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">2.</span>
                  <span>
                    Scroll through suggested experiences and mark what fits your
                    days.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">3.</span>
                  <span>
                    Use the practical sections for transport, safety and stay
                    tips just before you travel.
                  </span>
                </li>
              </ol>
            </div>

            <div>
              <Link
                href="/city/varanasi"
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 text-slate-50 text-sm sm:text-base font-semibold py-3.5 px-4 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                Open the Varanasi guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA – only about viewing the Varanasi guide, no booking */}
      <section className="border-t border-slate-200/80 bg-white/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Ready to walk the lanes of Varanasi from your screen?
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              The full Varanasi guide is just one click away – simple,
              distraction-free and focused only on the city you care about right
              now.
            </p>
          </div>

          <Link
            href="/city/varanasi"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-semibold bg-primary-blue text-white shadow-md hover:bg-primary-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
          >
            Go to Varanasi guide
          </Link>
        </div>
      </section>
    </div>
  );
}

