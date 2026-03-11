import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const createFullBackup = async (source: string) => {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: toppings } = await supabase.from('toppings').select('*');
  const { data: sizes } = await supabase.from('sizes').select('*');
  const { data: pizzas } = await supabase.from('pizzas').select('*');
  const { data: pizzaPrices } = await supabase.from('pizza_prices').select('*');
  const { data: pizzaToppings } = await supabase.from('pizza_toppings').select('*');
  const { data: extras } = await supabase.from('extras').select('*');
  const { data: siteConfig } = await supabase.from('site_config').select('*');

  const backupData = {
    categories,
    toppings,
    sizes,
    pizzas,
    pizzaPrices,
    pizzaToppings,
    extras,
    siteConfig
  };

  const checksum = Buffer.from(JSON.stringify(backupData)).toString('base64').slice(0, 16);

  return {
    metadata: {
      version: '1.0',
      created: new Date().toISOString(),
      source,
      type: 'full',
      checksum
    },
    data: backupData
  };
};

export const createContentBackup = async (source: string) => {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: pizzas } = await supabase.from('pizzas').select('*');
  const { data: extras } = await supabase.from('extras').select('*');
  const { data: siteConfig } = await supabase.from('site_config').select('*');

  const backupData = {
    categories,
    pizzas,
    extras,
    siteConfig
  };

  const checksum = Buffer.from(JSON.stringify(backupData)).toString('base64').slice(0, 16);

  return {
    metadata: {
      version: '1.0',
      created: new Date().toISOString(),
      source,
      type: 'content',
      checksum
    },
    data: backupData
  };
};

export const createMenuBackup = async (source: string) => {
  const { data: categories } = await supabase.from('categories').select('*');
  const { data: toppings } = await supabase.from('toppings').select('*');
  const { data: sizes } = await supabase.from('sizes').select('*');
  const { data: pizzas } = await supabase.from('pizzas').select('*');
  const { data: pizzaPrices } = await supabase.from('pizza_prices').select('*');
  const { data: pizzaToppings } = await supabase.from('pizza_toppings').select('*');
  const { data: extras } = await supabase.from('extras').select('*');

  const backupData = {
    categories,
    toppings,
    sizes,
    pizzas,
    pizzaPrices,
    pizzaToppings,
    extras
  };

  const checksum = Buffer.from(JSON.stringify(backupData)).toString('base64').slice(0, 16);

  return {
    metadata: {
      version: '1.0',
      created: new Date().toISOString(),
      source,
      type: 'menu',
      checksum
    },
    data: backupData
  };
};

// Placeholder functions for other operations
export const restoreFromBackup = async (_backup: unknown) => {
  console.log('Restore not implemented yet');
};

export const restoreFromBackupFile = async (_filePath: string) => {
  console.log('File restore not implemented yet');
};

export const resetToDefaults = async () => {
  console.log('Reset to defaults not implemented yet');
};

export const listBackups = async () => {
  const { data } = await supabase.from('backups').select('*').order('created_at', { ascending: false });
  return data || [];
};

export const deleteBackup = async (id: string) => {
  await supabase.from('backups').delete().eq('id', id);
};

export const downloadBackup = async (id: string) => {
  const { data } = await supabase.from('backups').select('backup_data').eq('id', id).single();
  return data?.backup_data;
};
