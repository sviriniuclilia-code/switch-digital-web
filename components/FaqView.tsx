"use client";

import { useState } from "react";
import type { Lang } from "@/lib/content";
import { defaultLocale } from "@/lib/content";
import Header from "./Header";
import Footer from "./Footer";
import { I } from "./icons";

export default function FaqView({ data, lang }: { data: any; lang: Lang }) {
  const t = data[lang];
  /* null = niciun răspuns deschis. Deschiderea uneia o închide pe cealaltă. */
  const [open, setOpen] = useState<number | null>(null);

  const home = lang === defaultLocale ? "/" : `/${lang}`;

  return (
    <main className="bg-white" lang={lang}>
      <Header lang={lang} t={t} />

      {/* Bandă de titlu. `id="top"` nu e decorativ: bara de sus îl caută
          ca să știe cât ține fundalul închis. Fără el, ar trece direct în alb. */}
      <section id="top" className="relative -mt-16 overflow-hidden bg-ink pt-16 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan/10 blur-2xl" />
        <div className="container-x py-16 md:py-20">
          <span className="eyebrow text-cyan-light">{t.faq.eyebrow}</span>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">{t.faq.title}</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted2">{t.faq.sub}</p>
        </div>
      </section>

      {/* Întrebările */}
      <section className="bg-ground">
        <div className="container-x py-16 md:py-20">
          <div className="max-w-3xl divide-y divide-line overflow-hidden rounded-xl2 border border-line bg-white">
            {t.faq.items.map((item: any, i: number) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors hover:bg-ground/70"
                  >
                    <span className="font-semibold text-ink">{item.q}</span>
                    <span className={`shrink-0 text-cyan-dark transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                      {I.plus({ className: "h-5 w-5" })}
                    </span>
                  </button>

                  {/* Răspunsul e mereu prezent în pagină — se ascunde doar vizual,
                      prin înălțime zero. Așa motoarele de căutare și cele AI îl pot citi
                      chiar și când e închis. Dacă l-am randa doar la click, ar fi invizibil. */}
                  <div
                    id={`faq-a-${i}`}
                    className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-muted">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Închidere: cine a citit răspunsurile e cel mai aproape de decizie. */}
      <section className="bg-white">
        <div className="container-x flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <h2 className="max-w-lg text-2xl font-bold tracking-tight text-ink md:text-3xl">{t.contact.title}</h2>
          <a href={`${home}#contact`} className="btn-primary shrink-0">
            {t.cta} {I.arrow({ className: "h-4 w-4" })}
          </a>
        </div>
      </section>

      <Footer t={t} />
    </main>
  );
}
