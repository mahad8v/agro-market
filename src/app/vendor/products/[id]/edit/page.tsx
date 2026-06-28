'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/forms/ProductForm';
import { VendorProduct } from '@/hooks/useVendorProduct';
import api from '@/lib/apiClient';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<VendorProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<VendorProduct>(`/products/${params.id}`)
      .then(({ data }) => setProduct(data))
      .catch((e) => setError(e.response?.data?.error ?? e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/vendor/products"
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading
              ? 'Loading…'
              : product
                ? `Editing: ${product.name}`
                : 'Product not found'}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error} —{' '}
          <Link href="/vendor/products" className="underline">
            Back to products
          </Link>
        </div>
      )}

      {!loading && product && <ProductForm mode="edit" initialData={product} />}
    </div>
  );
}
