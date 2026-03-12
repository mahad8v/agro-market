'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Badge } from '@/components/ui';
import { useProduct, useProducts } from '@/features/products/hooks';
import { useCart } from '@/context/CartContext';
import { formatCurrency, formatDate, getDiscountPercent } from '@/lib/utils';

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const { data: product, isLoading, error } = useProduct(params.slug);
  const { addItem, isInCart, updateQuantity, items } = useCart();
  const [qty, setQty] = useState(1);

  const { data: relatedData } = useProducts({
    category: product?.category,
    limit: 4,
  });

  if (isLoading) return <ProductDetailSkeleton />;
  if (error || !product) return notFound();

  const inCart = isInCart(product.id);
  const cartItem = items.find(i => i.product.id === product.id);
  const effectivePrice = product.discountPrice ?? product.price;

  const handleAddToCart = () => {
    if (inCart) {
      updateQuantity(product.id, (cartItem?.quantity ?? 0) + qty);
    } else {
      addItem(product, qty);
    }
  };

  const related = (relatedData?.data ?? []).filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-green-600">Products</Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-green-600 capitalize">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="green">{product.category}</Badge>
            {product.isOrganic && <Badge variant="green">🌿 Organic</Badge>}
            <Badge variant={product.stock > 0 ? 'green' : 'red'}>
              {product.stock > 0 ? `In Stock (${product.stock} ${product.unit})` : 'Out of Stock'}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.rating.toFixed(1)} ({product.totalReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-green-700">{formatCurrency(effectivePrice)}</span>
            <span className="text-gray-500 text-sm">per {product.unit}</span>
            {product.discountPrice && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 line-through text-lg">{formatCurrency(product.price)}</span>
                <Badge variant="red">-{getDiscountPercent(product.price, product.discountPrice)}%</Badge>
              </div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <span>📍</span><span>{product.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <span>🌾</span><span>Harvested: {formatDate(product.harvestDate)}</span>
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                disabled={qty >= product.stock}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {inCart ? `Update Cart (${cartItem?.quantity} in cart)` : 'Add to Cart 🛒'}
            </button>
          </div>

          {/* Vendor Summary */}
          {product.vendor && (
            <Link href={`/vendors/${product.vendorId}`}>
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:border-green-400 transition-colors mt-2">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={product.vendor.logo || '/placeholder-logo.jpg'}
                    alt={product.vendor.businessName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{product.vendor.businessName}</p>
                  <p className="text-sm text-gray-500">{product.vendor.location}</p>
                </div>
                <div className="text-right">
                  {product.vendor.isVerified && <Badge variant="green">✓ Verified</Badge>}
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">{product.vendor.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-80 bg-gray-200 rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-10 bg-gray-200 rounded w-1/4" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
