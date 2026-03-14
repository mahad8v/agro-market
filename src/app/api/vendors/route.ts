import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '@/server/services/vendor.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendors = await vendorService.getAll({
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    });
    return NextResponse.json(vendors);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
