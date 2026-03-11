import { NextResponse } from 'next/server';
import { resetToDefaults } from '@/lib/cms-backup-restore';

export async function POST() {
  try {
    await resetToDefaults();
    return NextResponse.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    );
  }
}
