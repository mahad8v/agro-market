// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from '@/server/jwt';
// import { orderService } from '@/server/services/order.service'; // adjust path to where this actually lives

// export async function POST(req: NextRequest) {
//   try {
//     // 1. Auth check
//     const token = req.headers.get('authorization')?.slice(7);
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }
//     const payload = await verifyToken(token);
//     if (!payload) {
//       return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
//     }

//     // 2. Parse body
//     const body = await req.json();
//     const { vendorGroups, shippingAddress } = body;
//     if (!vendorGroups?.length || !shippingAddress) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 },
//       );
//     }

//     // 3. Create one order per vendor group using the existing service
//     const orders = await Promise.all(
//       vendorGroups.map((group: any) =>
//         orderService.create(payload.customerId, {
//           vendorId: group.vendor.id,
//           shippingAddress: JSON.stringify(shippingAddress),
//           items: group.items.map((item: any) => ({
//             productId: item.product.id,
//             quantity: item.quantity,
//             price: item.product.discountPrice ?? item.product.price,
//           })),
//         }),
//       ),
//     );

//     return NextResponse.json({ orders }, { status: 201 });
//   } catch (err) {
//     console.error('Order creation failed:', err);
//     return NextResponse.json(
//       { error: 'Failed to create order' },
//       { status: 500 },
//     );
//   }
// }
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/server/jwt';
import { orderService } from '@/server/services/order.service';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const token = req.headers.get('authorization')?.slice(7);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const customerId = payload.customerId ?? payload.userId ?? payload.id;
    if (!customerId) {
      return NextResponse.json(
        { error: 'Could not resolve customer from token' },
        { status: 400 },
      );
    }

    // 2. Parse body
    const body = await req.json();
    const { vendorGroups, shippingAddress } = body;

    if (!vendorGroups?.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // 3. Validate each group has a resolvable vendorId
    for (const group of vendorGroups) {
      if (!group.items?.[0]?.product?.vendorId) {
        return NextResponse.json(
          { error: 'A vendor group is missing vendorId', group },
          { status: 400 },
        );
      }
    }

    // 4. Create one order per vendor group
    const orders = await Promise.all(
      vendorGroups.map((group: any) =>
        orderService.create(customerId, {
          vendorId: group.items[0].product.vendorId,
          shippingAddress: JSON.stringify(shippingAddress),
          items: group.items.map((item: any) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.discountPrice ?? item.product.price,
          })),
        }),
      ),
    );

    return NextResponse.json({ orders }, { status: 201 });
  } catch (err) {
    console.error('Order creation failed:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 },
    );
  }
}

// Keep GET if fetchVendorOrders() already relies on it
// src/app/api/orders/route.ts — replace the GET stub
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.slice(7);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? undefined;
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 20);

    // Confirm this matches your actual role field/value — adjust if needed
    if (payload.role === 'ADMIN') {
      const result = await orderService.getAll({ status, page, limit });
      return NextResponse.json(result);
    }

    const vendorId = payload.vendorId;
    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID missing from token' },
        { status: 400 },
      );
    }
    const orders = await orderService.getByVendor(vendorId, { status });
    return NextResponse.json({
      orders,
      total: orders.length,
      page: 1,
      limit: orders.length,
      totalPages: 1,
    });
  } catch (err) {
    console.error('Fetch orders failed:', err);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 },
    );
  }
}
