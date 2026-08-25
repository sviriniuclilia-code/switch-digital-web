"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Lead = { id: string; name: string; email: string; phone: string | null; message: string | null; status: string; createdAt: string };

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
    </label>
  );
}
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
    </label>
  );
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="mb-4 text-sm font-semibold text-cyan-dark">{title}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"content" | "leads">("content");
  const [loc, setLoc] = useState<"ro" | "en">("ro");
  const [draft, setDraft] = useState<any>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((j) => { if (j.ok) setDraft(j.data); });
    fetch("/api/admin/leads").then((r) => r.json()).then((j) => { if (j.ok) setLeads(j.leads); });
  }, []);

  function edit(mut: (d: any) => void) {
    setDraft((prev: any) => { const d = structuredClone(prev); mut(d); return d; });
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ro: draft.ro, en: draft.en, info: draft.info }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function setStatus(id: string, status: string) {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  if (!draft) return <main className="grid min-h-screen place-items-center bg-ground text-sm text-muted">Se încarcă…</main>;

  const c = draft[loc];

  return (
    <main className="min-h-screen bg-ground">
      <header className="sticky top-0 z-10 border-b border-line bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative grid h-8 w-8 place-items-center rounded-[9px] bg-ink"><span className="text-sm font-bold text-white">S</span><span className="absolute bottom-1 right-1 h-0.5 w-2 rounded-full bg-cyan" /></span>
            <span className="font-bold text-ink">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:border-cyan">Vezi site-ul</a>
            <button onClick={logout} className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink hover:border-cyan">Ieși</button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl gap-1 px-6">
          {(["content", "leads"] as const).map((tb) => (
            <button key={tb} onClick={() => setTab(tb)} className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium ${tab === tb ? "border-cyan text-ink" : "border-transparent text-muted hover:text-ink"}`}>
              {tb === "content" ? "Conținut" : `Mesaje (${leads.length})`}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {tab === "content" && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-line bg-white p-1">
                {(["ro", "en"] as const).map((l) => (
                  <button key={l} onClick={() => setLoc(l)} className={`rounded-md px-4 py-1.5 text-sm font-semibold ${loc === l ? "bg-ink text-white" : "text-muted"}`}>{l.toUpperCase()}</button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {saved && <span className="text-sm text-cyan-dark">✓ Salvat</span>}
                <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "..." : "Salvează"}</button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Card title="Hero">
                <TextInput label="Titlu" value={c.hero.title} onChange={(v) => edit((d) => (d[loc].hero.title = v))} />
                <TextArea label="Subtitlu" value={c.hero.sub} onChange={(v) => edit((d) => (d[loc].hero.sub = v))} />
              </Card>

              <Card title="Despre / Fondator">
                <TextArea label="Misiune" value={c.about.mission} onChange={(v) => edit((d) => (d[loc].about.mission = v))} />
                <TextInput label="Nume fondator" value={c.about.founderName} onChange={(v) => edit((d) => (d[loc].about.founderName = v))} />
                <TextInput label="Rol" value={c.about.founderRole} onChange={(v) => edit((d) => (d[loc].about.founderRole = v))} />
                <TextArea label="Bio fondator" value={c.about.founderBio} onChange={(v) => edit((d) => (d[loc].about.founderBio = v))} />
              </Card>

              <Card title="Servicii">
                <TextInput label="Titlu secțiune" value={c.services.title} onChange={(v) => edit((d) => (d[loc].services.title = v))} />
                <TextInput label="Subtitlu" value={c.services.sub} onChange={(v) => edit((d) => (d[loc].services.sub = v))} />
                {c.services.items.map((it: any, i: number) => (
                  <div key={i} className="rounded-lg bg-ground p-3">
                    <TextInput label={`Card ${i + 1} — titlu`} value={it.title} onChange={(v) => edit((d) => (d[loc].services.items[i].title = v))} />
                    <div className="mt-2"><TextArea label="Descriere" value={it.desc} onChange={(v) => edit((d) => (d[loc].services.items[i].desc = v))} /></div>
                  </div>
                ))}
              </Card>

              <Card title="Valori">
                <TextInput label="Titlu secțiune" value={c.values.title} onChange={(v) => edit((d) => (d[loc].values.title = v))} />
                {c.values.items.map((it: any, i: number) => (
                  <div key={i} className="rounded-lg bg-ground p-3">
                    <TextInput label={`Valoare ${i + 1}`} value={it.title} onChange={(v) => edit((d) => (d[loc].values.items[i].title = v))} />
                    <div className="mt-2"><TextArea label="Descriere" value={it.desc} onChange={(v) => edit((d) => (d[loc].values.items[i].desc = v))} /></div>
                  </div>
                ))}
              </Card>

              <Card title="Proces">
                <TextInput label="Titlu secțiune" value={c.process.title} onChange={(v) => edit((d) => (d[loc].process.title = v))} />
                {c.process.steps.map((it: any, i: number) => (
                  <div key={i} className="rounded-lg bg-ground p-3">
                    <TextInput label={`Pasul ${it.n} — titlu`} value={it.title} onChange={(v) => edit((d) => (d[loc].process.steps[i].title = v))} />
                    <div className="mt-2"><TextArea label="Descriere" value={it.desc} onChange={(v) => edit((d) => (d[loc].process.steps[i].desc = v))} /></div>
                  </div>
                ))}
              </Card>

              <Card title="Contact & Date (comun RO/EN)">
                <TextInput label="Titlu secțiune contact" value={c.contact.title} onChange={(v) => edit((d) => (d[loc].contact.title = v))} />
                <TextInput label="Subtitlu contact" value={c.contact.sub} onChange={(v) => edit((d) => (d[loc].contact.sub = v))} />
                <div className="my-2 border-t border-line" />
                <TextInput label="Email" value={draft.info.email} onChange={(v) => edit((d) => (d.info.email = v))} />
                <TextInput label="Telefon" value={draft.info.phone} onChange={(v) => edit((d) => (d.info.phone = v))} />
                <TextInput label="Locație" value={draft.info.location} onChange={(v) => edit((d) => (d.info.location = v))} />
                <TextInput label="Facebook (link)" value={draft.info.facebook} onChange={(v) => edit((d) => (d.info.facebook = v))} />
                <TextInput label="LinkedIn (link)" value={draft.info.linkedin} onChange={(v) => edit((d) => (d.info.linkedin = v))} />
              </Card>
            </div>
          </>
        )}

        {tab === "leads" && (
          <div className="overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="p-3">Data</th><th className="p-3">Nume</th><th className="p-3">Contact</th><th className="p-3">Mesaj</th><th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted">Niciun mesaj încă.</td></tr>}
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-line/70 align-top">
                    <td className="p-3 text-muted">{new Date(l.createdAt).toLocaleString("ro-RO")}</td>
                    <td className="p-3 font-medium text-ink">{l.name}</td>
                    <td className="p-3 text-muted"><div>{l.email}</div>{l.phone && <div>{l.phone}</div>}</td>
                    <td className="p-3 max-w-xs text-muted">{l.message}</td>
                    <td className="p-3">
                      <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)} className="rounded-lg border border-line px-2 py-1 text-sm">
                        <option value="new">nou</option>
                        <option value="contacted">contactat</option>
                        <option value="done">finalizat</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
