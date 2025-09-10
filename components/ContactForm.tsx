"use client";

import * as React from "react";

export default function ContactForm() {
  const [state, setState] = React.useState<"idle"|"sending"|"sent"|"error">("idle");
  const [err, setErr] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErr(null);

    const fd = new FormData(e.currentTarget);
    // Honeypot: if filled, drop it.
    if (fd.get("website")) { setState("sent"); return; }

    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setState("sent");
      e.currentTarget.reset();
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* honeypot */}
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-600">Name</label>
          <input name="name" type="text" className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-neutral-600">Company</label>
          <input name="company" type="text" className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-600">Email*</label>
        <input name="email" type="email" required className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-neutral-600">Subject</label>
          <input name="subject" type="text" className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-neutral-600">Category</label>
          <select name="category" className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2 bg-white">
            <option value="">Choose…</option>
            <option>Buyer question</option>
            <option>Supplier onboarding</option>
            <option>Order/escrow</option>
            <option>Technical issue</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-600">Message*</label>
        <textarea name="message" required rows={6} className="mt-1 w-full rounded-xl ring-1 ring-neutral-300 px-3 py-2" />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {state === "sent" && (
        <p className="text-sm text-green-700">Thanks! We’ll get back to you shortly.</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-white font-medium disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
