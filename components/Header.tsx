"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Lang } from "@/lib/content";
import { locales, defaultLocale, faqPath } from "@/lib/content";
import Logo from "./Logo";
import { I } from "./icons";

const LANG_LABEL: Record<string, string> = { ro: "RO", en: "EN", ru: "RU" };

export default function Header({
  lang,
  t,
  alternates,
}: {
  lang: Lang;
  t: any;
  /* Doar pentru paginile care au adrese diferite pe limbă (ex. FAQ:
     /intrebari-frecvente în RO, /en/faq în EN). Pagina principală nu are nevoie. */
  alternates?: Partial<Record<Lang, string>>;
}) {
  const pathname = usePathname() || "/";
  const [headerState, setHeaderState] = useState<"top" | "over" | "light">("top");
  const [menuOpen, setMenuOpen] = useState(false);

  const isLight = headerState === "light";
  const isOver = headerState === "over";

  /* Header-ul și panoul de meniu împart aceeași suprafață. Cu meniul deschis,
     header-ul devine solid chiar dacă e sus de tot — altfel bara transparentă
     și lista solidă arată ca două componente diferite. */
  const headerSurface = isLight
    ? `border-line/70 ${menuOpen ? "bg-white/95" : "bg-white/85"}`
    : isOver || menuOpen
      ? `border-white/10 ${menuOpen ? "bg-ink/95" : "bg-ink/85"}`
      : "border-transparent bg-transparent";

  const panelSurface = isLight ? "border-line/70 bg-white/95" : "border-white/10 bg-ink/95";

  /* Pagina principală în limba curentă. Româna stă la rădăcină. */
  const home = lang === defaultLocale ? "/" : `/${lang}`;
  const onHome = pathname === home;

  /* Ancorele merg direct pe pagina principală; de pe alte pagini (FAQ, blog)
     trebuie să trimită mai întâi acolo. */
  const anchor = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);

  /* O singură listă de linkuri, folosită și pe desktop, și pe mobil.
     Pentru o pagină nouă adaugi un rând aici. */
  const navLinks = [
    { href: anchor("servicii"), label: t.nav.services },
    { href: anchor("proces"), label: t.nav.process },
    { href: anchor("despre"), label: t.nav.about },
    { href: faqPath[lang], label: t.nav.faq },
    { href: anchor("contact"), label: t.nav.contact },
  ];

  /* Adresa aceleiași pagini în altă limbă.
     Paginile cu adrese diferite pe limbă (FAQ) sunt tratate separat —
     altfel comutatorul ar căuta „/en/intrebari-frecvente", care nu există. */
  const onFaq = Object.values(faqPath).includes(pathname);
  const bare = pathname.replace(/^\/(en|ru)(?=\/|$)/, "") || "/";
  const hrefFor = (l: Lang) =>
    alternates?.[l] ??
    (onFaq ? faqPath[l] : l === defaultLocale ? bare : `/${l}${bare === "/" ? "" : bare}`);
  const otherLangs = locales.filter((l) => l !== lang);

  /* Header în trei stări: transparent sus, închis peste hero, alb dedesubt.
     Pe paginile fără hero (FAQ, blog) rămâne mereu în varianta deschisă. */
  useEffect(() => {
    let threshold = 0;
    let hasHero = false;
    const measure = () => {
      const hero = document.getElementById("top");
      hasHero = !!hero;
      threshold = hero ? hero.offsetHeight - 72 : 0;
    };
    const apply = () => {
      if (!hasHero) { setHeaderState("light"); return; }
      const y = window.scrollY;
      if (y <= 8) setHeaderState("top");
      else if (y > threshold) setHeaderState("light");
      else setHeaderState("over");
    };
    const onResize = () => { measure(); apply(); if (window.innerWidth >= 768) setMenuOpen(false); };
    measure();
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  /* Meniul mobil se închide cu Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className={`sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${headerSurface}`}>
        <div className="container-x flex h-16 items-center justify-between">
          <Link href={home}>{isLight ? <Logo compact /> : <Logo dark compact />}</Link>

          <nav className={`hidden items-center gap-8 text-sm font-medium transition-colors duration-300 md:flex ${isLight ? "text-ink" : "text-white"}`}>
            {navLinks.map((l) => (
              <a key={l.href} className="transition-colors hover:text-cyan" href={l.href}>{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Comutatorul de limbă stă în bară doar pe desktop.
                Pe mobil ar aglomera-o (cu 3 limbi sunt 2 butoane în plus),
                așa că trece în meniul hamburger, mai jos. */}
            <div className="hidden items-center gap-2 md:flex">
              {otherLangs.map((l) => (
                <Link
                  key={l}
                  href={hrefFor(l)}
                  hrefLang={l}
                  aria-label={`Switch to ${LANG_LABEL[l]}`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 ${isLight ? "border-line text-ink hover:border-cyan" : "border-white/30 text-white hover:border-cyan"}`}
                >
                  {LANG_LABEL[l]}
                </Link>
              ))}
            </div>

            <a href={anchor("contact")} className="btn-primary whitespace-nowrap px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm">{t.cta}</a>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
              className={`rounded-lg border p-2 transition-colors duration-300 md:hidden ${isLight ? "border-line text-ink" : "border-white/30 text-white"}`}
            >
              {menuOpen ? I.close({ className: "h-5 w-5" }) : I.menu({ className: "h-5 w-5" })}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={`absolute inset-x-0 top-full border-b border-t shadow-lg shadow-ink/10 backdrop-blur md:hidden ${panelSurface}`}>
            <div className="container-x flex flex-col">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b py-4 text-base font-medium transition-colors last:border-b-0 ${isLight ? "border-line/60 text-ink hover:text-cyan-dark" : "border-white/10 text-white hover:text-cyan-light"}`}
                >
                  {l.label}
                </a>
              ))}

              {/* Limbile, în meniu. Se afișează toate, cu cea curentă marcată. */}
              <div className={`flex items-center gap-2 border-t py-4 ${isLight ? "border-line/60" : "border-white/10"}`}>
                {locales.map((l) => {
                  const current = l === lang;
                  return (
                    <Link
                      key={l}
                      href={hrefFor(l)}
                      hrefLang={l}
                      onClick={() => setMenuOpen(false)}
                      aria-current={current ? "true" : undefined}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        current
                          ? "border-cyan bg-cyan/10 text-cyan-dark"
                          : isLight
                            ? "border-line text-ink hover:border-cyan"
                            : "border-white/30 text-white hover:border-cyan"
                      }`}
                    >
                      {LANG_LABEL[l]}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Click oriunde în afara meniului îl închide */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} className="fixed inset-0 z-40 bg-ink/20 md:hidden" aria-hidden />
      )}
    </>
  );
}
