import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '@/server/services/vendor.service';
import { auth } from '@/server/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const stats = await vendorService.getStats(params.id);
    return NextResponse.json(stats);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
