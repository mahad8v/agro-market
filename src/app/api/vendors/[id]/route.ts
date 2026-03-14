import { NextRequest, NextResponse } from 'next/server';
import { vendorService } from '@/server/services/vendor.service';
import { auth } from '@/server/auth';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendor = await vendorService.getById(params.id);
    if (!vendor) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(vendor);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !['ADMIN','VENDOR'].includes(session.user.role))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const vendor = await vendorService.update(params.id, await req.json());
    return NextResponse.json(vendor);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (session?.user.role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await vendorService.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
