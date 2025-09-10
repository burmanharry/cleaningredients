import { supabaseServer } from '@/lib/supabaseServer';

export async function requireMembership() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data, error } = await supabase
    .from('memberships')
    .select('is_active')
    .eq('user_id', user.id)
    .single();

  return { ok: !!data?.is_active && !error };
}
