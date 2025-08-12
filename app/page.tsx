export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is working!
      </h1>
      <p className="mt-4 text-gray-600">Next.js + Tailwind v4</p>
    </main>
  );
}
"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Saving…");
    const r = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "homepage" }),
    });
    const j = await r.json();
    setMsg(j.ok ? (j.duplicate ? "Already on the list 👍" : "You're in! ✅") : "Error – try again");
    if (j.ok) setEmail("");
  }

  return (
    <main className="min-h-screen p-8">
      <form onSubmit={onSubmit} className="flex gap-3 max-w-lg">
        <input
          type="email" required value={email} onChange={e=>setEmail(e.target.value)}
          placeholder="you@brand.com"
          className="flex-1 rounded-xl border px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <button className="rounded-xl bg-blue-600 text-white px-5 py-3 font-medium">Join</button>
      </form>
      {msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}
    </main>
  );
}

