import { supabaseServer } from '@/lib/supabaseServer';

export async function getServerUser() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}
