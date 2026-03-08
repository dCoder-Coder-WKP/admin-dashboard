import { createSupabaseServer } from '@/lib/supabaseServer';
import ConfigEditor from './ConfigEditor';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createSupabaseServer();
  const { data: configs, error } = await supabase
    .from('site_config')
    .select('*')
    .order('key');

  if (error || !configs) {
    return <div>Failed to load settings: {error?.message}</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif italic text-[#E8540A]">Live Config Editor</h1>
      </div>
      <p className="text-sm text-[#8C7E6A]">Settings changed here will update globally across both the admin dashboard and the main website immediately.</p>
      
      <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden mt-6">
        <div className="divide-y divide-[#E5E5E0]">
          {configs.map((config) => (
            <ConfigEditor key={config.key} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
}
