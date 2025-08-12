"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("Saving…");

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      const j = await r.json();

      if (j.ok) {
        // Plausible conversion event (optional)
        (window as any).plausible?.("JoinWaitlist", { props: { source: "homepage" } });
        setMsg(j.duplicate ? "Already on the list 👍" : "You're in! ✅");
        setEmail("");
      } else {
        setMsg("Error – try again");
      }
    } catch {
      setMsg("Network error – try again");
    }
  }

  return (
    <main className="min-h-screen p-8">
      <form onSubmit={onSubmit} className="flex gap-3 max-w-lg">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@brand.com"
