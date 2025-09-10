import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function MembersPage() {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect('/signin');

  const { data: m } = await sb.from('memberships').select('is_active').eq('user_id', user.id).single();
  if (!m?.is_active) redirect('/account');

  return (
    <div className="container-page">
      <h1 className="mb-4 text-2xl font-semibold">Members</h1>
      <p>🎉 You have full supplier details unlocked.</p>
      {/* Your members-only UI here */}
    </div>
  );
}
