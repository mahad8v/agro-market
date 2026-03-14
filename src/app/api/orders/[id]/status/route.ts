import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { auth } from '@/server/auth';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !['VENDOR','ADMIN'].includes(session.user.role))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { orderStatus } = await req.json();
    const order = await orderService.updateStatus(params.id, orderStatus);
    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
