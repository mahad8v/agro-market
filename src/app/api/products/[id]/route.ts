// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/server/db';
// import { verifyToken } from '@/server/jwt';

// type Ctx = { params: { id: string } };

// // GET /api/vendor/products/[id]
// export async function GET(req: NextRequest, { params }: Ctx) {
//   try {
//     const token = req.headers.get('authorization')?.slice(7);
//     const payload = token ? verifyToken(token) : null;
//     if (!payload || payload.role !== 'VENDOR')
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const product = await db.product.findFirst({
//       where: { id: params.id, vendorId: payload.vendorId },
//       include: {
//         category: { select: { id: true, name: true, slug: true, icon: true } },
//       },
//     });

//     if (!product)
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     return NextResponse.json(product);
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// // PUT /api/vendor/products/[id]
// export async function PUT(req: NextRequest, { params }: Ctx) {
//   try {
//     const token = req.headers.get('authorization')?.slice(7);
//     const payload = token ? verifyToken(token) : null;
//     if (!payload || payload.role !== 'VENDOR')
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const existing = await db.product.findFirst({
//       where: { id: params.id, vendorId: payload.vendorId },
//     });
//     if (!existing)
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     const body = await req.json();
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       stock,
//       unit,
//       categoryId,
//       isOrganic,
//       isFeatured,
//       images,
//     } = body;

//     const updated = await db.product.update({
//       where: { id: params.id },
//       data: {
//         ...(name !== undefined && { name }),
//         ...(description !== undefined && { description }),
//         ...(price !== undefined && { price: Number(price) }),
//         ...(discountPrice !== undefined && {
//           discountPrice: discountPrice ? Number(discountPrice) : null,
//         }),
//         ...(stock !== undefined && { stock: Number(stock) }),
//         ...(unit !== undefined && { unit }),
//         ...(categoryId !== undefined && { categoryId }),
//         ...(isOrganic !== undefined && { isOrganic }),
//         ...(isFeatured !== undefined && { isFeatured }),
//         ...(images !== undefined && { images }),
//       },
//       include: {
//         category: { select: { id: true, name: true, slug: true, icon: true } },
//       },
//     });

//     return NextResponse.json(updated);
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// // PATCH /api/vendor/products/[id] — quick stock toggle
// export async function PATCH(req: NextRequest, { params }: Ctx) {
//   try {
//     const token = req.headers.get('authorization')?.slice(7);
//     const payload = token ? verifyToken(token) : null;
//     if (!payload || payload.role !== 'VENDOR')
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const existing = await db.product.findFirst({
//       where: { id: params.id, vendorId: payload.vendorId },
//     });
//     if (!existing)
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     const body = await req.json();
//     const updated = await db.product.update({
//       where: { id: params.id },
//       data: { stock: body.stock },
//     });

//     return NextResponse.json(updated);
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }

// // DELETE /api/vendor/products/[id]
// export async function DELETE(req: NextRequest, { params }: Ctx) {
//   try {
//     const token = req.headers.get('authorization')?.slice(7);
//     const payload = token ? verifyToken(token) : null;
//     if (!payload || payload.role !== 'VENDOR')
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const existing = await db.product.findFirst({
//       where: { id: params.id, vendorId: payload.vendorId },
//     });
//     if (!existing)
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });

//     await db.product.delete({ where: { id: params.id } });
//     return NextResponse.json({ success: true });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

type Ctx = { params: Promise<{ id: string }> }; // ← Promise

// GET /api/products/[id]
export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params; // ← await
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'VENDOR')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await db.product.findFirst({
      where: { id, vendorId: payload.vendorId },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
      },
    });

    if (!product)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'VENDOR')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await db.product.findFirst({
      where: { id, vendorId: payload.vendorId },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      unit,
      categoryId,
      isOrganic,
      isFeatured,
      images,
    } = body;

    const updated = await db.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(discountPrice !== undefined && {
          discountPrice: discountPrice ? Number(discountPrice) : null,
        }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(unit !== undefined && { unit }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isOrganic !== undefined && { isOrganic }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(images !== undefined && { images }),
      },
      include: {
        category: { select: { id: true, name: true, slug: true, icon: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH /api/products/[id] — quick stock toggle
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'VENDOR')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await db.product.findFirst({
      where: { id, vendorId: payload.vendorId },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const updated = await db.product.update({
      where: { id },
      data: { stock: body.stock },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.slice(7);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== 'VENDOR')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await db.product.findFirst({
      where: { id, vendorId: payload.vendorId },
    });
    if (!existing)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
