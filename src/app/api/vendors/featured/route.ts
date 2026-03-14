import { NextResponse } from 'next/server';
import { vendorService } from '@/server/services/vendor.service';

export async function GET() {
  try {
    const vendors = await vendorService.getFeatured();
    return NextResponse.json(vendors);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
