'use client';

import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useVendor } from '@/features/vendors/hooks';
import { useVendorProducts } from '@/features/products/hooks';
import { formatDate } from '@/lib/utils';

interface Props {
  params: { vendorId: string };
}

export default function VendorPage({ params }: Props) {
  const { data: vendor, isLoading, error } = useVendor(params.vendorId);
  const { data: products, isLoading: productsLoading } = useVendorProducts(params.vendorId);

  if (isLoading) return <VendorPageSkeleton />;
  if (error || !vendor) return notFound();

  return (
    <div>
      {/* Banner */}
      <div className="relative h-52 bg-green-200">
        <Image
          src={vendor.banner || '/placeholder-banner.jpg'}
          alt={vendor.businessName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 -mt-16 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative h-20 w-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={vendor.logo || '/placeholder-logo.jpg'}
                alt={vendor.businessName}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h1>
                {vendor.isVerified && <Badge variant="green">✓ Verified</Badge>}
                <Badge variant="blue">{vendor.subscriptionPlan}</Badge>
              </div>
              <p className="text-gray-500 text-sm">by {vendor.ownerName} · 📍 {vendor.location}</p>
            </div>

            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-green-700">{vendor.rating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{products?.length ?? 0}</p>
                <p className="text-xs text-gray-500">Products</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{vendor.description}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
            <span>📞 {vendor.phone}</span>
            <span>✉️ {vendor.email}</span>
            <span>📅 Member since {formatDate(vendor.createdAt)}</span>
          </div>
        </div>

        {/* Products */}
        <div className="pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Products by {vendor.businessName}
          </h2>
          <ProductGrid
            products={products ?? []}
            isLoading={productsLoading}
            emptyMessage="This vendor hasn't listed any products yet."
          />
        </div>
      </div>
    </div>
  );
}

function VendorPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    </div>
  );
}
