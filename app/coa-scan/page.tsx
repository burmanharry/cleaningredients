"use client";

import React, { useRef, useState } from "react";

export default function CoaScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function pickFile() {
    inputRef.current?.click();
  }
  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || submitting) return;

    setSubmitting(true);
    setError(null);
    setResultUrl(null);

    try {
      // 1) Init on server (creates DB row + returns REST upload URL + headers)
      const initRes = await fetch("/api/coa/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, type: file.type }),
      });
      const initBody = await initRes.json().catch(() => ({}));
      if (!initRes.ok || !initBody?.uploadUrl) {
        throw new Error(
          `init failed: ${initRes.status} ${initBody?.error ?? ""}`.trim()
        );
      }

      // 2) Direct upload to Supabase Storage (POST)
      const uploadRes = await fetch(initBody.uploadUrl, {
        method: "POST",
        headers: initBody.uploadHeaders, // Authorization + apikey + x-upsert + Content-Type
        body: file,
      });
      if (!uploadRes.ok) {
        const txt = await uploadRes.text().catch(() => "");
        throw new Error(`upload failed: ${uploadRes.status} ${txt}`);
      }

      // 3) Enqueue verify/parse & get public token
      const submitRes = await fetch("/api/coa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: initBody.submissionId }),
      });
      const done = await submitRes.json().catch(() => ({}));
      if (!submitRes.ok || !done?.publicToken) {
        throw new Error(
          `submit failed: ${submitRes.status} ${done?.error ?? ""}`.trim()
        );
      }

      setResultUrl(`/coa-scan/${done.publicToken}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold">COA Scan</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* LEFT: Drop area + form */}
        <section className="relative">
          <div
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 sm:p-10"
          >
            <h2 className="mb-2 text-2xl font-semibold text-neutral-900">
              Drop your COA (PDF or photo)
            </h2>
            <p className="mb-6 text-sm text-neutral-600">
              We’ll extract key fields, run checks, and give you a trust score.
            </p>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              <div className="mb-4 rounded-full bg-neutral-100 p-3 text-neutral-600">
                <svg viewBox="0 0 24 24" className="h-6 w-6">
                  <path
                    d="M12 3v12m0-12 4 4m-4-4-4 4M6 21h12a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v2a3 3 0 0 0 3 3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="mb-5 text-lg font-medium">
                Drag a file here <span className="text-neutral-400">or</span>
              </p>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={pickFile}
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-neutral-800"
                >
                  Upload a file
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={onFileInput}
                  className="hidden"
                />
                <div className="text-xs text-neutral-500">
                  Maximum size 25MB · Supported: PDF, JPG, PNG
                </div>
                {file && (
                  <div className="mt-1 max-w-full truncate rounded-md bg-neutral-50 px-2 py-1 text-xs text-neutral-700 ring-1 ring-neutral-200">
                    {file.name}
                  </div>
                )}
              </div>

              <form onSubmit={onSubmit} className="mt-6">
                <button
                  type="submit"
                  disabled={!file || submitting}
                  className="rounded-2xl bg-black px-5 py-2.5 text-sm font-medium text-white shadow disabled:opacity-50"
                >
                  {submitting ? "Uploading…" : "Scan COA"}
                </button>
              </form>

              {error && (
                <p className="mt-4 max-w-full break-words text-sm text-red-600">
                  {error}
                </p>
              )}
              {resultUrl && (
                <p className="mt-4 text-sm">
                  View result:{" "}
                  <a className="underline" href={resultUrl}>
                    {resultUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT: Info stack */}
        <section className="flex flex-col gap-6">
          {/* What the scanner does */}
          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                Private
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                No sign-in required
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                PDF · JPG · PNG
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                Max 25MB
              </span>
            </div>

            <h3 className="mb-3 text-base font-semibold text-neutral-900">
              What the scanner does
            </h3>
            <ul className="space-y-3">
              {[
                <>
                  Extracts key fields: <span className="font-medium">Ingredient</span>,{" "}
                  <span className="font-medium">Batch/Lot</span>,{" "}
                  <span className="font-medium">Lab</span>,{" "}
                  <span className="font-medium">Report Date</span>.
                </>,
                <>
                  Runs consistency checks and assigns a{" "}
                  <span className="font-medium">Trust Score (0–100)</span>.
                </>,
                <>
                  Surfaces <span className="font-medium">flags</span> (e.g., missing batch,
                  no report date, unknown lab) with severity.
                </>,
                <>
                  Returns a <span className="font-medium">shareable result link</span> (no
                  login required).
                </>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                      <path d="M6.2 11.1 2.9 7.8l1.2-1.2 2.1 2.1 5-5L12.4 5l-6.2 6.1Z" />
                    </svg>
                  </span>
                  <span className="text-sm text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How files are handled */}
          <div className="rounded-3xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-3 text-base font-semibold text-neutral-900">
              How files are handled
            </h3>
            <ul className="space-y-3">
              {[
                <>
                  Supported formats: <span className="font-medium">PDF</span> and{" "}
                  <span className="font-medium">images</span> (JPG/PNG). Max{" "}
                  <span className="font-medium">25MB</span>.
                </>,
                <>
                  Your file is stored privately while we extract fields. The public link
                  shows fields & flags, not the raw file.
                </>,
                <>Anonymous scans are OK; saving history & updates can be added later.</>,
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-indigo-100 text-indigo-600 ring-1 ring-indigo-200">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
                      <path d="M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm1 8V7H7v1.5h1V11H7v1.5h3V11h-1Z" />
                    </svg>
                  </span>
                  <span className="text-sm text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>

           
            
          </div>
        </section>
      </div>
    </main>
  );
}
