'use client';

import React, { useState } from 'react';
import { Button, Badge, Card, Table, Td, Modal, Input } from '@/components/ui';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import { Product } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.vendorName ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          All marketplace products ({products.length} total)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Products',
            value: products.length,
            color: 'bg-gray-100 text-gray-800',
          },
          {
            label: 'Featured',
            value: products.filter((p) => p.isFeatured).length,
            color: 'bg-purple-100 text-purple-800',
          },
          {
            label: 'Organic',
            value: products.filter((p) => p.isOrganic).length,
            color: 'bg-emerald-100 text-emerald-800',
          },
          {
            label: 'Out of Stock',
            value: products.filter((p) => p.stock === 0).length,
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

      {/* Search */}
      <Card padding="sm">
        <Input
          placeholder="Search products by name, category, or vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
      </Card>

      {/* Table */}
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
          {filtered.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-emerald-50 shrink-0">
                    {product.images[0] ? (
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
                    <p className="text-xs text-gray-400">{product.unit}</p>
                  </div>
                </div>
              </Td>
              <Td>
                <p className="text-sm text-gray-700">{product.vendorName}</p>
                <p className="text-xs text-gray-400">{product.location}</p>
              </Td>
              <Td className="text-sm text-gray-600">{product.category}</Td>
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
              <Td>
                <span
                  className={`font-semibold text-sm ${product.stock > 50 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}
                >
                  {product.stock} {product.unit}
                </span>
              </Td>
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
              <Td>
                <div className="flex items-center gap-2">
                  <Button
                    variant={product.isFeatured ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => toggleFeatured(product.id)}
                  >
                    {product.isFeatured ? 'Unfeature' : 'Feature'}
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
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">📦</p>
            <p className="font-medium">No products found</p>
          </div>
        )}
      </Card>

      {/* Delete Confirm */}
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
          ?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteTarget && deleteProduct(deleteTarget.id)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
