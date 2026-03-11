async function run() {
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });

  const { createClient } = await import('@supabase/supabase-js');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase.from('site_config').upsert([
    { key: 'logo_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/logo.png', label: 'Brand Logo URL', type: 'text' },
    { key: 'hero_bg_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/hero-bg.jpg', label: 'Hero Background Image URL', type: 'text' },
    { key: 'dough_img_url', value: 'https://lrrrapitaqfvrxqkcoac.supabase.co/storage/v1/object/public/brand-assets/artisanal-dough.jpg', label: 'Artisanal Dough Image URL', type: 'text' }
  ], { onConflict: 'key' });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Inserted config values successfully');
  }
}

run();
