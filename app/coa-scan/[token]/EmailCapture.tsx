"use client";
import React, { useState } from "react";

export default function EmailCapture({ token }: { token: string }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true); setErr(null); setMsg(null);
    try {
      const res = await fetch("/api/coa/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || `error ${res.status}`);
      setMsg("Done! We’ve emailed your report link.");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border p-4 space-y-3">
      <div className="text-sm font-medium">Send this report to your email</div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@domain.com"
          className="flex-1 rounded-xl border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Sending…" : "Send"}
        </button>
      </div>
      {msg && <div className="text-green-600 text-sm">{msg}</div>}
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <div className="text-xs text-neutral-500">We’ll only email you this report & occasional follow-ups.</div>
    </form>
  );
}
