"use client";

import { useState, useEffect, useRef } from "react";
import type { Lang } from "@/lib/content";

/* ---------- icons ---------- */
const I = {
  search: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
  layers: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></svg>),
  bolt: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" /></svg>),
  sparkles: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" /></svg>),
  headset: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" /></svg>),
  mail: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>),
  phone: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.8 3.5h3.2l1.4 3.9-2 1.3a12 12 0 0 0 5.1 5.1l1.3-2 3.9 1.4v3.2a1.9 1.9 0 0 1-2.1 1.9A17 17 0 0 1 4.9 5.6 1.9 1.9 0 0 1 6.8 3.5Z" /></svg>),
  pin: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.4" /></svg>),
  globe: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></svg>),
  check: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>),
  arrow: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  menu: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>),
  close: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>),
};

function Logo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  // dark = pe fundal închis (pătrat alb, „S" închis, text alb)
  // compact = pe mobil se afișează doar pătratul cu „S", ca să rămână loc în bară
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`relative grid h-9 w-9 place-items-center rounded-[10px] transition-colors duration-300 ${dark ? "bg-white" : "bg-ink"}`}>
        <span className={`text-lg font-bold leading-none transition-colors duration-300 ${dark ? "text-ink" : "text-white"}`}>S</span>
        <span className="absolute bottom-1.5 right-1.5 h-1 w-2.5 rounded-full bg-cyan" />
      </span>
      <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${compact ? "hidden sm:inline" : ""} ${dark ? "text-white" : "text-ink"}`}>
        Switch <span className={`transition-colors duration-300 ${dark ? "text-cyan-light" : "text-cyan-dark"}`}>Digital</span>
      </span>
    </span>
  );
}

/* Numărătoare crescătoare pentru statistici (ex. 0 → 100%) */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const m = value.match(/^(\D*)(\d+)(.*)$/);
    if (!m) { setDisplay(value); return; }
    const prefix = m[1];
    const target = parseInt(m[2], 10);
    const suffix = m[3];
    if (target === 0) { setDisplay(value); return; }

    const reduce = typeof window !== "undefined" &&
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDisplay(value); return; }

    const el = ref.current;
    if (!el) return;

    setDisplay(prefix + "0" + suffix);
    let started = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const dur = 1300;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(prefix + Math.round(target * eased) + suffix);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.6 });

    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

type Info = { email: string; phone: string; location: string; facebook: string; linkedin: string };

export default function SiteView({ data }: { data: { ro: any; en: any; info: Info } }) {
  const [lang, setLang] = useState<Lang>("ro");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [headerState, setHeaderState] = useState<"top" | "over" | "light">("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = data[lang];
  const info = data.info;
  const isLight = headerState === "light";
  const isOver = headerState === "over";

  /* Linkurile din meniu — o singură listă pentru desktop și mobil.
     Ca să adaugi o pagină nouă (ex. /blog), adaugi un rând aici și apare în ambele. */
  const navLinks = [
    { href: "#servicii", label: t.nav.services },
    { href: "#proces", label: t.nav.process },
    { href: "#despre", label: t.nav.about },
    { href: "#contact", label: t.nav.contact },
  ];

  /* Meniul mobil se închide singur când ecranul devine destul de lat */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Meniul mobil se închide cu tasta Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Header în trei stări: transparent sus, închis peste Hero, alb dedesubt */
  useEffect(() => {
    const getThreshold = () => {
      const hero = document.getElementById("top");
      return hero ? hero.offsetHeight - 72 : 400;
    };
    let threshold = getThreshold();
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 8) setHeaderState("top");
      else if (y > threshold) setHeaderState("light");
      else setHeaderState("over");
    };
    const onResize = () => { threshold = getThreshold(); onScroll(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* Apariție lină la scroll pentru elementele marcate cu data-reveal */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      message: String(fd.get("message") || ""),
      company: String(fd.get("company") || ""),
    };
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        setState("sent");
        form.reset();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <main className="bg-white">
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${isLight ? "border-line/70 bg-white/85" : isOver ? "border-white/10 bg-ink/85" : "border-transparent bg-transparent"}`}>
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#top">{isLight ? <Logo compact /> : <Logo dark compact />}</a>
          <nav className={`hidden items-center gap-8 text-sm font-medium transition-colors duration-300 md:flex ${isLight ? "text-ink" : "text-white"}`}>
            {navLinks.map((l) => (
              <a key={l.href} className="transition-colors hover:text-cyan" href={l.href}>{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setLang(lang === "ro" ? "en" : "ro")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 ${isLight ? "border-line text-ink hover:border-cyan" : "border-white/30 text-white hover:border-cyan"}`} aria-label="Change language">
              {lang === "ro" ? "EN" : "RO"}
            </button>
            <a href="#contact" className="btn-primary whitespace-nowrap px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm">{t.cta}</a>
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
          <nav className={`border-t backdrop-blur md:hidden ${isLight ? "border-line/70 bg-white/95" : "border-white/10 bg-ink/95"}`}>
            <div className="container-x flex flex-col py-2">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 text-sm font-medium transition-colors hover:text-cyan ${isLight ? "text-ink" : "text-white"}`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Strat invizibil sub meniul mobil: click oriunde în afara meniului îl închide */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-ink/20 md:hidden"
          aria-hidden
        />
      )}

      {/* Hero */}
      <section id="top" className="relative -mt-16 overflow-hidden bg-ink pt-16 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-cyan/10 blur-2xl" />
        <div className="container-x grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs text-muted2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> {t.hero.badge}
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">{t.hero.title}</h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted2">{t.hero.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="btn-primary">{t.hero.primary} {I.arrow({ className: "h-4 w-4" })}</a>
              <a href="#servicii" className="btn-ghost border-white/20 text-white hover:border-white/40">{t.hero.secondary}</a>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {t.stats.map((s: any) => (
                <div key={s.k}>
                  <div className="text-xl font-bold text-cyan-light"><CountUp value={s.k} /></div>
                  <div className="mt-1 text-xs text-muted2">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div data-reveal className="switch-anim mx-auto flex aspect-square max-w-sm flex-col items-center justify-center gap-7 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8">
              <svg viewBox="0 0 200 120" className="w-3/5">
                <rect className="switch-track" x="6" y="24" width="188" height="72" rx="36" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <circle className="switch-ripple" cx="150" cy="60" r="34" fill="none" stroke="#06b6d4" strokeWidth="3" />
                <circle className="switch-glow" cx="150" cy="60" r="48" fill="#06b6d4" opacity="0" />
                <g className="switch-knob">
                  <circle cx="150" cy="60" r="34" fill="#06b6d4" />
                  <text x="150" y="73" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="34" fill="#0f172a">S</text>
                </g>
              </svg>
              <div className="flex w-full max-w-[230px] flex-col gap-3.5">
                {(lang === "ro"
                  ? ["Soluții digitale", "Optimizare", "Procese stabilite"]
                  : ["Digital solutions", "Optimization", "Established processes"]
                ).map((label) => (
                  <div key={label} className="switch-row flex items-center gap-2.5 text-sm">
                    <span className="switch-dot h-2.5 w-2.5 shrink-0 rounded-full" />
                    <span className="flex-1 text-left text-slate-300">{label}</span>
                    <span className="switch-chk text-cyan-light">✓</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicii" className="bg-ground">
        <div className="container-x py-20 md:py-24">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.services.title}</h2>
          <p data-reveal className="mt-3 max-w-xl text-muted">{t.services.sub}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {t.services.items.map((s: any, i: number) => {
              const Icon = (I as any)[s.icon] || I.bolt;
              return (
                <div key={s.title} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className={`rounded-xl2 border border-line bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/5 lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""}`}>
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan/10 text-cyan-dark"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white">
        <div className="container-x py-20 md:py-24">
          <span className="eyebrow">{t.values.eyebrow}</span>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.values.title}</h2>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-6">
            {t.values.items.map((v: any, i: number) => (
              <div key={v.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className={`flex gap-4 lg:col-span-2 ${i === 3 ? "lg:col-start-2" : ""}`}>
                <div className="value-badge mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan-dark">{I.check({ className: "h-4 w-4 value-check" })}</div>
                <div>
                  <h3 className="font-semibold text-ink">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="proces" className="bg-ink text-white">
        <div className="container-x py-20 md:py-24">
          <span className="eyebrow text-cyan-light">{t.process.eyebrow}</span>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{t.process.title}</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.steps.map((s: any, i: number) => (
              <div key={s.n} data-reveal style={{ transitionDelay: `${i * 100}ms` }} className="border-t border-white/15 pt-6">
                <div className="font-mono text-sm font-semibold text-cyan">{s.n}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="despre" className="bg-ground">
        <div className="container-x grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-24">
          <div data-reveal>
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.about.title}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{t.about.mission}</p>
            <div className="mt-8"><Logo /></div>
          </div>
          <div data-reveal style={{ transitionDelay: "120ms" }} className="rounded-xl2 border border-line bg-white p-8 shadow-lg shadow-ink/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/10">
            <div className="flex items-center gap-4">
              <img src="/lilia.jpg" alt="Lilia Sviriniuc" className="h-20 w-20 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-ink">{t.about.founderName}</div>
                <div className="text-sm text-cyan-dark">{t.about.founderRole}</div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted">{t.about.founderBio}</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-white">
        <div className="container-x py-20 md:py-24">
          <span className="eyebrow">{t.contact.eyebrow}</span>
          <h2 data-reveal className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.contact.title}</h2>
          <p data-reveal className="mt-3 text-muted">{t.contact.sub}</p>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <form data-reveal onSubmit={onSubmit} className="rounded-xl2 border border-line bg-white p-7 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.contact.name} ph={t.contact.namePh} name="name" required />
                <Field label={t.contact.email} ph={t.contact.emailPh} name="email" type="email" required />
              </div>
              <div className="mt-5"><Field label={t.contact.phone} ph={t.contact.phonePh} name="phone" type="tel" /></div>
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-ink">{t.contact.message}</label>
                <textarea name="message" rows={4} placeholder={t.contact.messagePh} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted2 focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
              </div>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <button type="submit" disabled={state === "sending"} className="btn-primary mt-6 disabled:opacity-60">
                {state === "sending" ? "..." : t.contact.send} {I.arrow({ className: "h-4 w-4" })}
              </button>
              {state === "sent" && <p className="mt-4 text-sm text-cyan-dark">✓ {lang === "ro" ? "Mesajul a fost trimis. Îți mulțumim!" : "Message sent. Thank you!"}</p>}
              {state === "error" && <p className="mt-4 text-sm text-red-500">{lang === "ro" ? "A apărut o eroare. Încearcă din nou." : "Something went wrong. Please try again."}</p>}
            </form>

            <div data-reveal style={{ transitionDelay: "120ms" }} className="rounded-xl2 bg-ink p-8 text-white">
              <div className="text-lg font-semibold">{t.contact.detailsTitle}</div>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-center gap-3">{I.mail({ className: "h-5 w-5 text-cyan-light" })}<a className="hover:text-cyan-light" href={`mailto:${info.email}`}>{info.email}</a></li>
                <li className="flex items-center gap-3">{I.phone({ className: "h-5 w-5 text-cyan-light" })}<a className="hover:text-cyan-light" href={`tel:${info.phone.replace(/\s/g, "")}`}>{info.phone}</a></li>
                <li className="flex items-center gap-3">{I.globe({ className: "h-5 w-5 text-cyan-light" })}<span>switchdigital.md</span></li>
                <li className="flex items-center gap-3">{I.pin({ className: "h-5 w-5 text-cyan-light" })}<span>{info.location}</span></li>
              </ul>
              <div className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted2">{t.contact.follow}</div>
              <div className="mt-3 flex gap-3">
                {info.facebook && (
                  <a href={info.facebook} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/15 px-4 py-2 text-sm transition hover:border-cyan">Facebook</a>
                )}
                {info.linkedin && (
                  <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/15 px-4 py-2 text-sm transition hover:border-cyan">LinkedIn</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-white">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
          <Logo dark />
          <p className="text-sm text-muted2">{t.footer.tagline}</p>
          <p className="text-xs text-muted2">© 2026 Switch Digital. {t.footer.rights}</p>
        </div>
      </footer>
    </main>
  );
}

function Field({ label, ph, name, type = "text", required }: { label: string; ph: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>
      <input name={name} type={type} placeholder={ph} required={required} className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted2 focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
    </div>
  );
}
