'use client';

import React from 'react';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useFeaturedProducts } from '../hooks';

export function FeaturedProductsSection() {
  const { data: products, isLoading } = useFeaturedProducts();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-gray-500 text-sm mt-1">Handpicked fresh produce from our top vendors</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-green-600 hover:text-green-700">
          View All →
        </Link>
      </div>
      <ProductGrid
        products={products?.slice(0, 8) ?? []}
        isLoading={isLoading}
      />
    </section>
  );
}
