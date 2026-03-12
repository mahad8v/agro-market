'use client';

import React from 'react';
import Link from 'next/link';
import { VendorCard } from '@/components/vendor/VendorCard';
import { useFeaturedVendors } from '../hooks';

export function FeaturedVendorsSection() {
  const { data: vendors, isLoading } = useFeaturedVendors();

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Top Vendors</h2>
            <p className="text-gray-500 text-sm mt-1">Verified farmers and agricultural suppliers</p>
          </div>
          <Link href="/vendors" className="text-sm font-medium text-green-600 hover:text-green-700">
            View All →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(vendors ?? []).slice(0, 4).map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
