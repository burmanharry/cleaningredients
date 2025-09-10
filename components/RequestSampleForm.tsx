'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RequestSampleForm({ listingId }: { listingId: string }) {
  const [qty, setQty] = useState('1');
  const [shipTo, setShipTo] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMsg(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg('Please sign in first.'); setLoading(false); return; }

    const { error } = await supabase.from('sample_requests').insert({
      listing_id: listingId,
      buyer_id: user.id,               // RLS: must equal auth.uid()
      quantity_kg: Number(qty) || null,
      ship_to: shipTo || null,
      notes: notes || null,
    });

    setLoading(false);
    setMsg(error ? error.message : 'Sample request submitted!');
    if (!error) { setQty('1'); setShipTo(''); setNotes(''); }
  }

  return (
    <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-4 items-end">
      <div>
        <label className="block text-xs text-neutral-500">Qty (kg)</label>
        <input className="mt-1 w-full rounded-xl border p-2"
               type="number" min="0.1" step="0.1"
               value={qty} onChange={(e)=>setQty(e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs text-neutral-500">Ship to</label>
        <input className="mt-1 w-full rounded-xl border p-2"
               value={shipTo} onChange={(e)=>setShipTo(e.target.value)} />
      </div>
      <div className="sm:col-span-4">
        <label className="block text-xs text-neutral-500">Notes</label>
        <textarea className="mt-1 w-full rounded-xl border p-2"
                  rows={2} value={notes} onChange={(e)=>setNotes(e.target.value)} />
      </div>
      <button disabled={loading}
              className="rounded-xl bg-black px-4 py-2 text-white">
        {loading ? 'Submitting…' : 'Request sample'}
      </button>
      {msg && <div className={`sm:col-span-3 text-sm ${msg.includes('submitted')?'text-green-700':'text-red-600'}`}>{msg}</div>}
    </form>
  );
}
