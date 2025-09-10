'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function UnlockButton() {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      const supabase = supabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert('Please sign in first');
        return;
      }
      const res = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: session.access_token })
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else alert(json.error ?? 'Could not start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
    >
      {loading ? 'Redirecting…' : 'Unlock full supplier details'}
    </button>
  );
}
