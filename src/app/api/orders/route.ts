import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { auth } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);

    if (session.user.role === 'ADMIN') {
      return NextResponse.json(
        await orderService.getAll({
          status: searchParams.get('status') ?? undefined,
          page: Number(searchParams.get('page') ?? 1),
          limit: Number(searchParams.get('limit') ?? 20),
        }),
      );
    }
    if (session.user.role === 'vendor' && session.user.vendorId) {
      return NextResponse.json(
        await orderService.getByVendor(session.user.vendorId, {
          status: searchParams.get('status') ?? undefined,
        }),
      );
    }
    return NextResponse.json(
      await orderService.getByCustomer(session.user.id!),
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
