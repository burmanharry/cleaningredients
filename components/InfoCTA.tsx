"use client";
import { useState } from "react";

export default function InfoCTA() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/lead", { // assumes you already have this route
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email, source: "info-cta" })
    });
    if (res.ok) setOk(true);
  }

  if (ok) return <div className="not-prose mt-8 rounded-xl border p-4">Thanks — we’ll be in touch.</div>;

  return (
    <form onSubmit={submit} className="not-prose mt-8 rounded-xl border p-4">
      <div className="font-medium">Need verified suppliers?</div>
      <p className="text-sm text-neutral-600">Get 1–2 intros or request a quote.</p>
      <div className="mt-3 flex gap-2">
        <input
          type="email" required value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-xl ring-1 ring-neutral-300 px-3 py-2"
        />
        <button className="rounded-xl bg-black text-white px-4">Send</button>
      </div>
    </form>
  );
}
