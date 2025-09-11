"use client";

import * as React from "react";

export default function ContactForm() {
  const [sending, setSending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    // Simple mailto fallback. Replace with API route if you prefer.
    const subject = encodeURIComponent(`Contact: ${fd.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("message")}`
    );
    window.location.href = `mailto:info@cleaningredients.com?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 400);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="rounded-xl bg-black px-5 py-2.5 text-white hover:bg-black/90 disabled:opacity-50"
      >
        {sending ? "Opening mail…" : "Send"}
      </button>
    </form>
  );
}

