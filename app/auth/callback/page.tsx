// app/auth/callback/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = supabaseBrowser();
      const url = new URL(window.location.href);

      // We'll populate this with whatever flow we're in
      let session: NonNullable<
        Awaited<ReturnType<typeof supabase.auth.getSession>>
      >['data']['session'] | null = null;

      try {
        // A) OAuth / PKCE ?code=...
        if (url.searchParams.get('code')) {
          const { error } = await supabase.auth.exchangeCodeForSession(url.href);
          if (error) throw error;
          session = (await supabase.auth.getSession()).data.session;
        }
        // B) Magic link ?token_hash=...&type=magiclink|recovery|invite|email_change
        else if (url.searchParams.get('token_hash')) {
          const token_hash = url.searchParams.get('token_hash')!;
          const typeParam =
            (url.searchParams.get('type') as
              | 'magiclink'
              | 'recovery'
              | 'invite'
              | 'email_change') || 'magiclink';
          const { data, error } = await supabase.auth.verifyOtp({
            type: typeParam,
            token_hash,
          });
          if (error) throw error;
          session = data.session ?? (await supabase.auth.getSession()).data.session;
        }
        // C) Legacy hash fragment #access_token=...&refresh_token=...
        else {
          const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
          const access_token = hash.get('access_token');
          const refresh_token = hash.get('refresh_token');
          if (access_token && refresh_token) {
            await supabase.auth.setSession({ access_token, refresh_token });
            session = (await supabase.auth.getSession()).data.session;
          }
        }

        if (!session) throw new Error('No session in callback');

        // Sync browser session -> server cookies
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          }),
        });

        if (!cancelled) router.replace('/account');
      } catch (err) {
        console.error('auth callback error:', err);
        if (!cancelled) router.replace('/signin');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return <div className="p-6">Signing you in…</div>;
}
