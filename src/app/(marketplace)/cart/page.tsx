'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartItem } from '@/components/cart/CartItem';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { vendorGroups, totalAmount, totalItems, clearCart } = useCart();

  if (totalItems === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-6 block">🛒</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Browse our products and add items to your cart.</p>
        <Link href="/products" className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items grouped by vendor */}
        <div className="lg:col-span-2 space-y-5">
          {vendorGroups.map(group => (
            <div key={group.vendor?.id ?? 'unknown'} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              {/* Vendor header */}
              <div className="flex items-center gap-3 bg-gray-50 px-5 py-3 border-b border-gray-200">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                  {group.vendor?.logo && (
                    <Image src={group.vendor.logo} alt={group.vendor.businessName} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/vendors/${group.vendor?.id}`} className="font-medium text-gray-900 hover:text-green-700 text-sm">
                    {group.vendor?.businessName ?? 'Unknown Vendor'}
                  </Link>
                </div>
                <span className="text-sm text-gray-500">{group.items.length} item{group.items.length > 1 ? 's' : ''}</span>
              </div>

              {/* Items */}
              <div className="px-5">
                {group.items.map(item => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>

              {/* Vendor subtotal */}
              <div className="flex items-center justify-between bg-green-50 px-5 py-3 border-t border-green-100">
                <span className="text-sm text-gray-600">Subtotal from {group.vendor?.businessName}</span>
                <span className="font-bold text-green-700">{formatCurrency(group.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

            <div className="space-y-2">
              {vendorGroups.map(group => (
                <div key={group.vendor?.id ?? 'unknown'} className="flex justify-between text-sm text-gray-600">
                  <span>{group.vendor?.businessName ?? 'Vendor'}</span>
                  <span>{formatCurrency(group.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-green-700 text-lg">{formatCurrency(totalAmount)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout →
            </Link>

            <Link href="/products" className="block text-center text-sm text-green-600 hover:text-green-700">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
