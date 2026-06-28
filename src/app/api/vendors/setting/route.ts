// src/app/api/vendors/setting/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyToken } from '@/server/jwt';

/* ------------------------------------------------------------------ */
/*  GET /api/vendors/setting                                            */
/* ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (!payload?.vendorId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const vendor = await db.vendor.findUnique({
      where: { id: payload.vendorId },
      select: {
        id: true,
        businessName: true,
        slug: true,
        description: true,
        logo: true,
        banner: true,
        phone: true,
        location: true,
        rating: true,
        totalReviews: true,
        isVerified: true,
        status: true,
        commissionRate: true,
        subscriptionPlan: true,
        createdAt: true,
        // Pull owner name + email from the related User
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ vendor }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/vendors/setting]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/*  PATCH /api/vendors/setting                                          */
/* ------------------------------------------------------------------ */
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (!payload?.vendorId) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const body = await req.json();
    const { businessName, description, phone, location, ownerName } = body;

    if (!businessName?.trim()) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 },
      );
    }

    // Update Vendor fields first
    const updated = await db.vendor.update({
      where: { id: payload.vendorId },
      data: {
        ...(businessName !== undefined && {
          businessName: businessName.trim(),
        }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        // Update owner name on the related User inline
        ...(ownerName?.trim() && {
          user: { update: { name: ownerName.trim() } },
        }),
      },
      select: {
        id: true,
        businessName: true,
        slug: true,
        description: true,
        logo: true,
        banner: true,
        phone: true,
        location: true,
        rating: true,
        totalReviews: true,
        isVerified: true,
        status: true,
        commissionRate: true,
        subscriptionPlan: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ vendor: updated }, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/vendors/setting]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
