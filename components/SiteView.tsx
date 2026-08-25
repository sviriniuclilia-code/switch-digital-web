"use client";

import { useState } from "react";
import type { Lang } from "@/lib/content";

/* ---------- icons ---------- */
const I = {
  search: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
  layers: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 13 9 5 9-5" /></svg>),
  bolt: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" /></svg>),
  headset: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" /></svg>),
  mail: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>),
  phone: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.8 3.5h3.2l1.4 3.9-2 1.3a12 12 0 0 0 5.1 5.1l1.3-2 3.9 1.4v3.2a1.9 1.9 0 0 1-2.1 1.9A17 17 0 0 1 4.9 5.6 1.9 1.9 0 0 1 6.8 3.5Z" /></svg>),
  pin: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.4" /></svg>),
  globe: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></svg>),
  check: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>),
  arrow: (p: any) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
};

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-[10px] bg-ink">
        <span className="text-lg font-bold leading-none text-white">S</span>
        <span className="absolute bottom-1.5 right-1.5 h-1 w-2.5 rounded-full bg-cyan" />
      </span>
      <span className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        Switch <span className="text-cyan-dark">Digital</span>
      </span>
    </span>
  );
}

type Info = { email: string; phone: string; location: string; facebook: string; linkedin: string };

export default function SiteView({ data }: { data: { ro: any; en: any; info: Info } }) {
  const [lang, setLang] = useState<Lang>("ro");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const t = data[lang];
  const info = data.info;

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
      <header className="sticky top-0 z-50 border-b border-line/70 bg-white/85 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <a href="#top"><Logo /></a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink md:flex">
            <a className="hover:text-cyan-dark" href="#servicii">{t.nav.services}</a>
            <a className="hover:text-cyan-dark" href="#despre">{t.nav.about}</a>
            <a className="hover:text-cyan-dark" href="#proces">{t.nav.process}</a>
            <a className="hover:text-cyan-dark" href="#contact">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "ro" ? "en" : "ro")} className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:border-cyan" aria-label="Change language">
              {lang === "ro" ? "EN" : "RO"}
            </button>
            <a href="#contact" className="btn-primary hidden sm:inline-flex">{t.cta}</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-ink text-white">
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
                  <div className="text-xl font-bold text-cyan-light">{s.k}</div>
                  <div className="mt-1 text-xs text-muted2">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="mx-auto grid aspect-square max-w-sm place-items-center rounded-[2rem] border border-white/10 bg-white/[0.02]">
              <svg viewBox="0 0 200 120" className="w-2/3">
                <rect x="6" y="24" width="188" height="72" rx="36" fill="#1e293b" stroke="#334155" />
                <circle cx="150" cy="60" r="34" fill="#06b6d4" />
                <text x="150" y="73" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="34" fill="#0f172a">S</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicii" className="bg-ground">
        <div className="container-x py-20 md:py-24">
          <span className="eyebrow">{t.services.eyebrow}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.services.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{t.services.sub}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.items.map((s: any) => {
              const Icon = (I as any)[s.icon] || I.bolt;
              return (
                <div key={s.title} className="rounded-xl2 border border-line bg-white p-7 transition hover:shadow-lg hover:shadow-ink/5">
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.values.title}</h2>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.values.items.map((v: any) => (
              <div key={v.title} className="flex gap-4">
                <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan/10 text-cyan-dark">{I.check({ className: "h-4 w-4" })}</div>
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{t.process.title}</h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {t.process.steps.map((s: any) => (
              <div key={s.n} className="border-t border-white/15 pt-6">
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
          <div>
            <span className="eyebrow">{t.about.eyebrow}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.about.title}</h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{t.about.mission}</p>
            <div className="mt-8"><Logo /></div>
          </div>
          <div className="rounded-xl2 border border-line bg-white p-8 shadow-lg shadow-ink/5">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan/10 text-lg font-bold text-cyan-dark">LS</div>
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
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink md:text-4xl">{t.contact.title}</h2>
          <p className="mt-3 text-muted">{t.contact.sub}</p>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <form onSubmit={onSubmit} className="rounded-xl2 border border-line bg-white p-7 shadow-sm">
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

            <div className="rounded-xl2 bg-ink p-8 text-white">
              <div className="text-lg font-semibold">{t.contact.detailsTitle}</div>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-center gap-3">{I.mail({ className: "h-5 w-5 text-cyan-light" })}<a className="hover:text-cyan-light" href={`mailto:${info.email}`}>{info.email}</a></li>
                <li className="flex items-center gap-3">{I.phone({ className: "h-5 w-5 text-cyan-light" })}<a className="hover:text-cyan-light" href={`tel:${info.phone.replace(/\s/g, "")}`}>{info.phone}</a></li>
                <li className="flex items-center gap-3">{I.globe({ className: "h-5 w-5 text-cyan-light" })}<span>switchdigital.md</span></li>
                <li className="flex items-center gap-3">{I.pin({ className: "h-5 w-5 text-cyan-light" })}<span>{info.location}</span></li>
              </ul>
              <div className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted2">{t.contact.follow}</div>
              <div className="mt-3 flex gap-3">
                <a href={info.facebook} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:border-cyan">Facebook</a>
                <a href={info.linkedin} className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:border-cyan">LinkedIn</a>
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
