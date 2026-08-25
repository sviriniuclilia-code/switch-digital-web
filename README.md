# Switch Digital — Website (Modul 1)

Site custom construit în **Next.js 14 + TypeScript + Tailwind CSS**, cu brandul Switch Digital, conținut RO/EN și font Poppins auto-găzduit. Îl deții integral.

## Cum îl rulezi local
```bash
npm install
npm run dev
# deschide http://localhost:3000
```

## Cum îl publici GRATUIT
Momentan site-ul e **static** (`output: 'export'` în `next.config.mjs`), deci merge pe orice găzduire gratuită:

- **Vercel** (recomandat): urci proiectul pe GitHub → import în vercel.com → deploy automat. Plan gratuit.
- **Cloudflare Pages / Netlify**: la fel, conectezi repo-ul; build command `npm run build`, folder `out`.
- Apoi conectezi domeniul **switchdigital.md** din panoul găzduirii (DNS).

> Când adăugăm Modulul 2 (backend securizat + CMS + formular care salvează date), scoatem `output: 'export'` și rămânem pe Vercel (are și partea de server). Baza de date: Neon/Supabase (plan gratuit la început).

## Structura
```
app/
  layout.tsx      # font Poppins self-hosted, meta/SEO
  page.tsx        # toate secțiunile (Hero, Servicii, Valori, Proces, Despre, Contact, Footer)
  globals.css     # Tailwind + stiluri de bază
  fonts/          # Poppins (Regular, Medium, Bold)
lib/
  content.ts      # TOT textul, RO + EN (ușor de editat)
public/           # logo-uri SVG
tailwind.config.ts
```

## Ce editezi ușor
- **Texte**: `lib/content.ts` (RO și EN, într-un singur loc).
- **Culori**: `tailwind.config.ts` (ink, cyan etc.).
- **Linkuri social**: `contactInfo` din `lib/content.ts`.

## Note
- Formularul de contact afișează deocamdată o confirmare, dar **nu trimite date nicăieri** (sigur). Salvarea securizată vine în Modulul 2.
- Câmpurile colectate (nume, email, telefon, mesaj) sunt pregătite pentru exportul viitor în CRM Odoo (Modul 3).

## Roadmap
- **Modul 1** ✔ Website (acesta)
- **Modul 2** — Admin/CMS + bază de date + formular securizat (validare, rate-limit, protecție anti-spam, date needitabile din extern)
- **Modul 3** — API către Odoo (nume, telefon, cerință → CRM)
