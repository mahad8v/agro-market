'use client';

import React from 'react';
import Link from 'next/link';
import { ProductForm } from '@/components/forms/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/vendor/products"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details to list a new product</p>
        </div>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
