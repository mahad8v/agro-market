import { NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { auth } from '@/server/auth';

export async function GET() {
  try {
    const session = await auth();
    if (session?.user.role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json(await orderService.getAdminStats());
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
