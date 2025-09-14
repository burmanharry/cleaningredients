// app/api/workers/drain-queue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { run } from "@/workers/parse-coa";

export const runtime = "nodejs";
export const maxDuration = 300;

const BATCH_SIZE = parseInt(process.env.COA_QUEUE_BATCH_SIZE ?? "3", 10);

export async function GET(req: NextRequest) {
  // Simple auth so only your cron (or you) can hit this
  const secret = req.headers.get("x-worker-secret");
  if (secret !== process.env.COA_WORKER_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Service-role: needed to bypass RLS and access jobs/storage
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1) Claim a batch atomically
  const { data: claimed, error: claimErr } = await admin.rpc("claim_coa_jobs", {
    batch_size: BATCH_SIZE,
  });
  if (claimErr) {
    return NextResponse.json({ error: claimErr.message }, { status: 500 });
  }
  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ ok: true, claimed: 0, done: 0, failed: 0 });
  }

  // 2) Process each job
  let done = 0,
    failed = 0;

  for (const job of claimed as any[]) {
    try {
      await run(job.submission_id); // your parser in workers/parse-coa.ts
      await admin.from("coa_jobs").update({ status: "done" }).eq("id", job.id);
      done++;
    } catch (err: any) {
      failed++;
      // Backoff or fail
      const { error: retryErr } = await admin.rpc("retry_or_fail_job", {
        job_id: job.id,
        err: String(err?.message ?? err),
      });
      if (retryErr) {
        await admin
          .from("coa_jobs")
          .update({ status: "failed", last_error: String(err?.message ?? err) })
          .eq("id", job.id);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    claimed: claimed.length,
    done,
    failed,
  });
}
