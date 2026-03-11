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

interface BackupMetadata {
  version: string;
  created: string;
  source: string;
  type: string;
  checksum: string;
}

interface BackupPayload {
  metadata: BackupMetadata;
  data: Record<string, unknown>;
}

export const restoreFromBackup = async (backup: BackupPayload) => {
  console.info(
    `[restoreFromBackup] Requested type="${backup.metadata.type}" checksum=${backup.metadata.checksum}`
  );
  // TODO: Implement restore logic when finalized
};

export const restoreFromBackupFile = async (filePath: string) => {
  console.info(`[restoreFromBackupFile] Requested file ${filePath}`);
  // TODO: Implement file-based restore flow when finalized
};

export const resetToDefaults = async () => {
  console.info('[resetToDefaults] No-op reset invoked. Implement actual logic when ready.');
};
