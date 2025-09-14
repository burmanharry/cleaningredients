// app/api/workers/parse-coa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { run } from "@/workers/parse-coa"; // <-- your worker file

export const runtime = "nodejs";       // ensure Node (not Edge)
export const maxDuration = 300;        // allow long parse for big PDFs

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-worker-secret");
  if (secret !== process.env.COA_WORKER_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { submissionId } = await req.json();
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  // Run the heavy job here
  try {
    await run(submissionId);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "parse failed" }, { status: 500 });
  }
}
