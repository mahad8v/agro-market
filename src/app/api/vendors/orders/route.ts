// src/app/api/vendor/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/server/jwt';
import { orderService } from '@/server/services/order.service';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7);
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized — no token provided' },
        { status: 401 },
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized — token verification failed' },
        { status: 401 },
      );
    }

    // Fallback pattern matching your other routes, in case vendor tokens
    // use a different field name than expected
    const vendorId = payload.vendorId ?? payload.id;
    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID missing from token', payload },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? undefined;

    const orders = await orderService.getByVendor(vendorId, { status });

    return NextResponse.json({
      orders,
      total: orders.length,
      page: 1,
      limit: orders.length,
      totalPages: 1,
    });
  } catch (err) {
    console.error('Fetch vendor orders failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch vendor orders' },
      { status: 500 },
    );
  }
}
