'use client';

import React, { useState } from 'react';
import { Button, Badge, Card, Table, Td, Modal, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import {
  useAdminProducts,
  useAdminDeleteProduct,
  useFeatureProduct,
} from '@/features/admin/hooks';
import { Product } from '@/types/client';

// ─── SKELETONS ────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 text-center animate-pulse">
      <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
      <div className="h-4 w-24 bg-gray-100 rounded mx-auto" />
    </div>
  );
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-36 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          </td>
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </td>
          ))}
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-gray-200 rounded-lg" />
              <div className="h-7 w-16 bg-gray-100 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // ── Queries & mutations ────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useAdminProducts({
    search: search || undefined,
    category: category || undefined,
    page,
    limit: 20,
  });

  const deleteMutation = useAdminDeleteProduct();
  const featureMutation = useFeatureProduct();

  const products = Array.isArray(data) ? data : ((data as any)?.data ?? []);
  const totalPages = Array.isArray(data) ? 1 : ((data as any)?.totalPages ?? 1);

  console.log('AdminProductsPage data:', data);

  // ── Derived stat counts ────────────────────────────────────────────────────
  const stats = {
  total: Array.isArray(data) ? data.length : (data as any)?.total ?? 0,
  featured: products.filter((p) => p.isFeatured).length,
  organic: products.filter((p) => p.isOrganic).length,
  outOfStock: products.filter((p) => p.stock === 0).length,
};

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleToggleFeatured = (product: Product) => {
    featureMutation.mutate({
      id: product.id,
      isFeatured: !product.isFeatured,
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-gray-900 font-semibold">Failed to load products</p>
        <p className="text-sm text-gray-500">{(error as any)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All marketplace products {!isLoading && `(${data?.total ?? 0} total)`}
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : [
              {
                label: 'Total Products',
                value: stats.total,
                color: 'bg-gray-100 text-gray-800',
              },
              {
                label: 'Featured',
                value: stats.featured,
                color: 'bg-purple-100 text-purple-800',
              },
              {
                label: 'Organic',
                value: stats.organic,
                color: 'bg-emerald-100 text-emerald-800',
              },
              {
                label: 'Out of Stock',
                value: stats.outOfStock,
                color: 'bg-red-100 text-red-800',
              },
            ].map((s) => (
              <Card key={s.label} className="text-center py-4">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}
                >
                  {s.label}
                </span>
              </Card>
            ))}
      </div>

      {/* ── Search & filters ───────────────────────────────────────────────── */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search products by name, category, or vendor..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          {/* Category quick-filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              '',
              'Vegetables',
              'Grains & Nuts',
              'Dairy & Livestock',
              'Fish & Seafood',
            ].map((cat) => (
              <button
                key={cat || 'all'}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  category === cat
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat || 'All'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Card padding="none">
        <Table
          headers={[
            'Product',
            'Vendor',
            'Category',
            'Price',
            'Stock',
            'Tags',
            'Actions',
          ]}
        >
          {isLoading ? (
            <TableSkeleton rows={8} />
          ) : products.length === 0 ? null : (
            products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Product image + name */}
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-50 shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-full h-full text-xl">
                          🌿
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {product.unit?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </Td>

                {/* Vendor */}
                <Td>
                  <p className="text-sm text-gray-700">
                    {product.vendor?.businessName ?? product.vendorName ?? '—'}
                  </p>
                  <p className="text-xs text-gray-400">{product.location}</p>
                </Td>

                {/* Category */}
                <Td className="text-sm text-gray-600">
                  {(product.category as any)?.name ?? product.category ?? '—'}
                </Td>

                {/* Price */}
                <Td>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(product.discountPrice ?? product.price)}
                  </p>
                  {product.discountPrice && (
                    <p className="text-xs text-gray-400 line-through">
                      {formatCurrency(product.price)}
                    </p>
                  )}
                </Td>

                {/* Stock */}
                <Td>
                  <span
                    className={`font-semibold text-sm ${
                      product.stock > 50
                        ? 'text-emerald-600'
                        : product.stock > 0
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}
                  >
                    {product.stock} {product.unit?.toLowerCase()}
                  </span>
                </Td>

                {/* Tags */}
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {product.isOrganic && (
                      <Badge variant="success" size="sm">
                        Organic
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge variant="purple" size="sm">
                        Featured
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="danger" size="sm">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Td>

                {/* Actions */}
                <Td>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={product.isFeatured ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleFeatured(product)}
                      disabled={featureMutation.isPending}
                    >
                      {featureMutation.isPending &&
                      featureMutation.variables?.id === product.id
                        ? '…'
                        : product.isFeatured
                          ? 'Unfeature'
                          : 'Feature'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(product)}
                    >
                      Delete
                    </Button>
                  </div>
                </Td>
              </tr>
            ))
          )}
        </Table>

        {/* Empty state */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📦</p>
            <p className="font-medium">No products found</p>
            {search && (
              <p className="text-sm mt-1">
                Try clearing the search or changing the filter.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {data?.total} products
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Delete confirm modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-gray-900">
            "{deleteTarget?.name}"
          </span>
          ? This cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setDeleteTarget(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
