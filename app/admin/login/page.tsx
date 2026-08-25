"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin");
    else setErr("Email sau parolă greșite.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ground px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-lg shadow-ink/5">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="relative grid h-9 w-9 place-items-center rounded-[10px] bg-ink">
            <span className="text-lg font-bold text-white">S</span>
            <span className="absolute bottom-1.5 right-1.5 h-1 w-2.5 rounded-full bg-cyan" />
          </span>
          <span className="text-lg font-bold text-ink">Switch <span className="text-cyan-dark">Digital</span></span>
        </div>
        <h1 className="text-xl font-bold text-ink">Autentificare</h1>
        <p className="mt-1 text-sm text-muted">Panou de administrare</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input name="email" type="email" required className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Parolă</label>
            <input name="password" type="password" required className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20" />
          </div>
        </div>
        {err && <p className="mt-4 text-sm text-red-500">{err}</p>}
        <button disabled={loading} className="btn-primary mt-6 w-full justify-center disabled:opacity-60">
          {loading ? "..." : "Intră în cont"}
        </button>
      </form>
    </main>
  );
}
