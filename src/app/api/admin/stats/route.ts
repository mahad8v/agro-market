import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { verifyToken } from '@/server/jwt';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Verify with your custom JWT secret
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── 3. Fetch and return stats
    const stats = await orderService.getAdminStats();
    return NextResponse.json(stats);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
