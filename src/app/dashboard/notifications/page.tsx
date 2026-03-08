import { createSupabaseServer } from '@/lib/supabaseServer';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const supabase = await createSupabaseServer();
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  return <NotificationsClient notifications={notifications || []} />;
}
