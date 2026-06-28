import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/server/services/order.service';
import { auth } from '@/server/auth';

const VALID_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ────────────────────────────────────────────────────────────
    let body: { status?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const newStatus = body.status?.toUpperCase();
    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 422 },
      );
    }

    // ── Fetch order to verify ownership ───────────────────────────────────────
    const order = await orderService.getById(params.orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Vendors can only update their own orders; admins can update any
    if (
      session.user.role !== 'ADMIN' &&
      order.vendorId !== session.user.vendorId
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ── Validate transition ───────────────────────────────────────────────────
    const currentStatus = (order.orderStatus as string).toUpperCase();
    const allowed = VALID_TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot move order from ${currentStatus} to ${newStatus}` },
        { status: 422 },
      );
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    const updated = await orderService.updateStatus(params.orderId, newStatus);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
