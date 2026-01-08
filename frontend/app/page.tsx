'use client';

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/lib/translations";
export default function Home() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Hero – Focus on Varanasi */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Main hero background re-using the Varanasi primary tone */}
        <div className="absolute inset-0 bg-primary-blue" />
        {/* New subtle radial accents */}
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_#38bdf8_0,_transparent_55%),radial-gradient(circle_at_bottom,_#f97316_0,_transparent_55%)]" />

        {/* Website Name and Login at top */}
        <div className="absolute top-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between pt-4 sm:pt-7">
            {/* Website Name */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group transition-all duration-300 hover:scale-105 active:scale-95">
              {/* Logo - Spiritual Design with Sacred Geometry */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-temple flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/30 hover:ring-white/40">
                {/* Outer sacred glow - multiple layers for depth */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary-gold/40 via-primary-gold/20 to-transparent blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-white/40 via-white/20 to-transparent blur-[2px] opacity-50"></div>
                
                {/* Inner sacred mandala effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-primary-gold/20 to-transparent rounded-full"></div>
                <div className="absolute inset-1 rounded-full bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>
                
                {/* Sacred border pattern */}
                <div className="absolute inset-0 rounded-full border-2 border-white/40"></div>
                <div className="absolute inset-[3px] rounded-full border border-primary-gold/30"></div>
                
                {/* Om symbol - Large and prominent, spiritual presence */}
                <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative z-10 leading-none select-none filter brightness-110">🕉️</span>
                
                {/* Inner sacred light */}
                <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-white/20 via-transparent to-primary-gold/10 pointer-events-none"></div>
                
                {/* Subtle pulsing glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-primary-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
              </div>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight hidden sm:block drop-shadow-sm">
                Varanasi Tourism
              </span>
            </Link>

            {/* Spacer for alignment with FloatingButtonGroup */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 md:pt-24 lg:pt-20 md:pb-10 lg:pb-12 pb-6 sm:pb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Text side */}
          <div className="w-full md:w-3/5 space-y-4 sm:space-y-5 text-white">
             <p className="inline-flex items-center gap-2 text-sm sm:text-base font-medium tracking-[0.2em] uppercase text-sky-200/90 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur mt-2 sm:mt-0">
              <span className="text-lg">●</span>
               {t("home.hero.badge", language)}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight multilingual-text" style={{ lineHeight: '1.4' }}>
               {t("home.hero.title.main", language)}
              <span className="block mt-1 text-sky-100">
                 <span className="multilingual-text">
                   {t("home.hero.title.sub", language)}
                 </span>
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-sky-100/85 max-w-xl leading-relaxed multilingual-text">
               {t("home.hero.description", language)}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/city/varanasi"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base sm:text-lg font-semibold shadow-lg shadow-sky-900/40 bg-white text-slate-900 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-300 focus-visible:ring-offset-primary-blue transition-colors"
               >
                 {t("home.hero.cta.primary", language)}
                <span className="ml-2 text-xl" aria-hidden="true">
                  ↗
                </span>
              </Link>
              <a
                href="#varanasi-overview"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base sm:text-lg font-medium border border-sky-200/70 text-sky-50/90 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-200 focus-visible:ring-offset-primary-blue transition-colors"
               >
                 {t("home.hero.cta.secondary", language)}
              </a>
            </div>
          </div>

          {/* Highlight card side – merges stats + quick intro */}
          <div className="w-full md:w-1/2 lg:w-[52%] xl:w-[48%]">
            <div className="rounded-3xl bg-slate-950/70 border border-sky-500/40 shadow-[0_18px_60px_rgba(15,23,42,0.8)] backdrop-blur-xl p-4 sm:p-5 space-y-3 sm:space-y-4 overflow-hidden">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 mb-1.5 sm:mb-2">
                   {t("home.glance.title", language)}
                </p>
                 <p className="text-xs sm:text-sm text-slate-200 leading-relaxed multilingual-text">
                   {t("home.glance.description", language)}
                </p>
              </div>

               {/* Combined info row: 3 pillars in one card */}
               <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm">
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-sky-500/40 p-3 sm:p-4 flex flex-col gap-1 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1 w-full">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-500/15 text-lg flex-shrink-0" aria-hidden="true">
                      🌊
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight whitespace-nowrap flex-1">
                       {t("home.glance.ghats.title", language)}
                    </p>
                  </div>
                   <p className="text-slate-300/95 leading-snug multilingual-text">
                     {t("home.glance.ghats.description", language)}
                   </p>
                </div>
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-violet-400/40 p-3 sm:p-4 flex flex-col gap-1 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1 w-full">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 text-lg flex-shrink-0" aria-hidden="true">
                      🕉️
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight whitespace-nowrap flex-1">
                       {t("home.glance.temples.title", language)}
                    </p>
                  </div>
                   <p className="text-slate-300/95 leading-snug multilingual-text">
                     {t("home.glance.temples.description", language)}
                   </p>
                </div>
                 <div className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-emerald-400/45 p-3 sm:p-4 flex flex-col gap-1 shadow-[0_10px_30px_rgba(15,23,42,0.6)] transition-transform duration-200 hover:-translate-y-1 w-full">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 text-lg flex-shrink-0" aria-hidden="true">
                      🧭
                    </span>
                    <p className="font-semibold text-slate-50 tracking-tight whitespace-nowrap flex-1">
                       {t("home.glance.practical.title", language)}
                    </p>
                  </div>
                   <p className="text-slate-300/95 leading-snug multilingual-text">
                     {t("home.glance.practical.description", language)}
                   </p>
                </div>
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
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500 multilingual-text">
                {t("home.overview.badge", language)}
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 multilingual-text" style={{ lineHeight: '1.5' }}>
                {t("home.overview.title", language)}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-3xl multilingual-text">
                {t("home.glance.description", language)}
              </p>
            </header>

          {/* Three-in-one content row */}
          <div className="grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 multilingual-text">
                <span className="text-lg" aria-hidden="true">
                  📜
                </span>
                {t("home.overview.living.title", language)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed multilingual-text">
                {t("home.overview.living.description", language)}
              </p>
            </article>

            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 multilingual-text">
                <span className="text-lg" aria-hidden="true">
                  ☀️
                </span>
                {t("home.overview.seasons.title", language)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed multilingual-text">
                {t("home.overview.seasons.description", language)}
              </p>
            </article>

            <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-5 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 multilingual-text">
                <span className="text-lg" aria-hidden="true">
                  🧳
                </span>
                {t("home.overview.expect.title", language)}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed multilingual-text">
                {t("home.overview.expect.description", language)}
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
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-200 multilingual-text">
                 {t("home.experiences.badge", language)}
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-snug multilingual-text">
                 {t("home.experiences.title", language)}
              </h2>
              <p className="text-sm sm:text-base text-emerald-50/90 max-w-xl multilingual-text">
                 {t("home.hero.description", language)}
              </p>
            </div>

            <div className="relative grid gap-3 sm:grid-cols-3 mt-4 text-xs sm:text-sm">
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🚣
                </span>
                <p className="font-semibold multilingual-text">{t("home.experiences.river.title", language)}</p>
                <p className="text-emerald-50/80 multilingual-text">
                  {t("home.experiences.river.description", language)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🛕
                </span>
                <p className="font-semibold multilingual-text">{t("home.experiences.spiritual.title", language)}</p>
                <p className="text-emerald-50/80 multilingual-text">
                  {t("home.experiences.spiritual.description", language)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-emerald-400/40 px-3 py-3 flex flex-col gap-1">
                <span className="text-lg" aria-hidden="true">
                  🍛
                </span>
                <p className="font-semibold multilingual-text">{t("home.experiences.food.title", language)}</p>
                <p className="text-emerald-50/80 multilingual-text">
                  {t("home.experiences.food.description", language)}
                </p>
              </div>
            </div>
          </div>

          {/* Right: simple “how to use this guide” card */}
          <div className="rounded-3xl bg-white shadow-lg shadow-slate-900/5 border border-slate-200 p-6 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900 multilingual-text">
                 {t("home.howto.title", language)}
              </h3>
              <ol className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">1.</span>
                  <span className="multilingual-text">
                    {t("home.howto.step1", language)}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">2.</span>
                   <span className="multilingual-text">
                    {t("home.howto.step2", language)}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[2px] text-slate-400">3.</span>
                  <span className="multilingual-text">
                    {t("home.howto.step3", language)}
                  </span>
                </li>
              </ol>
            </div>

            <div>
              <Link
                href="/city/varanasi"
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 text-slate-50 text-sm sm:text-base font-semibold py-3.5 px-4 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
              >
                <span className="multilingual-text">
                  {t("home.howto.cta", language)}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA – only about viewing the Varanasi guide, no booking */}
      <section className="border-t border-slate-200/80 bg-white/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 multilingual-text">
               {t("home.final.title", language)}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 multilingual-text">
               {t("home.final.description", language)}
            </p>
          </div>

          <Link
            href="/city/varanasi"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm sm:text-base font-semibold bg-primary-blue text-white shadow-md hover:bg-primary-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors"
          >
            <span className="multilingual-text">
              {t("home.final.cta", language)}
            </span>
          </Link>
        </div>
      </section>

    </div>
  );
}

