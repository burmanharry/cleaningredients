// app/error.tsx
'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Something went wrong</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error?.message}</pre>
        <button onClick={() => reset()} style={{ marginTop: 12 }}>Try again</button>
      </body>
    </html>
  );
}
