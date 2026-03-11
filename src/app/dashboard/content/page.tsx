import { createSupabaseServer } from '@/lib/supabaseServer';
import ContentManagementClient from './ContentManagementClient';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Content Management | WKP Admin',
  description: 'Manage website content, pages, and media',
};

export default async function ContentManagementPage() {
  const supabase = await createSupabaseServer();

  // Fetch all content types
  const [
    { data: siteConfig },
    { data: contentBlocks },
    { data: testimonials },
    { data: gallery },
    { data: banners },
    { data: faq },
    { data: teamMembers }
  ] = await Promise.all([
    supabase.from('site_config').select('*').order('key'),
    supabase.from('content_blocks').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
    supabase.from('gallery').select('*').order('sort_order'),
    supabase.from('promotional_banners').select('*').order('sort_order'),
    supabase.from('faq').select('*').order('sort_order'),
    supabase.from('team_members').select('*').order('sort_order')
  ]);

  return (
    <ContentManagementClient
      siteConfig={siteConfig || []}
      contentBlocks={contentBlocks || []}
      testimonials={testimonials || []}
      gallery={gallery || []}
      banners={banners || []}
      faq={faq || []}
      teamMembers={teamMembers || []}
    />
  );
}
