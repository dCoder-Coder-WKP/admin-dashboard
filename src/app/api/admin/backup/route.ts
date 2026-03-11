import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createFullBackup, createContentBackup, createMenuBackup } from '@/lib/cms-backup-restore';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { type = 'full' } = await request.json();
    
    let backup;
    switch (type) {
      case 'content':
        backup = await createContentBackup('admin-dashboard');
        break;
      case 'menu':
        backup = await createMenuBackup('admin-dashboard');
        break;
      case 'full':
      default:
        backup = await createFullBackup('admin-dashboard');
        break;
    }

    // Save backup to database
    await supabase.from('backups').insert({
      name: `${type} Backup - ${new Date().toLocaleString()}`,
      description: `${type} database backup created from admin dashboard`,
      backup_data: backup,
      backup_type: type,
      created_by: 'admin-dashboard',
      file_size: JSON.stringify(backup).length,
      checksum: backup.metadata.checksum
    });

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="backup-${type}-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
