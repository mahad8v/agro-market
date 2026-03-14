'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🌾</span>
            <span className="text-xl font-bold text-green-700 hidden sm:block">
              Senela market
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, vendors..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/products"
              className="text-sm text-gray-600 hover:text-green-700 hidden md:block"
            >
              Products
            </Link>
            <Link
              href="/vendors"
              className="text-sm text-gray-600 hover:text-green-700 hidden md:block"
            >
              Vendors
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-green-700"
            >
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'VENDOR' && (
                  <Link
                    href="/vendor/dashboard"
                    className="text-sm text-green-700 font-medium hidden md:block"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm text-green-700 font-medium hidden md:block"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-red-600 hidden md:block"
                >
                  Logout
                </button>
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-green-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-gray-100 bg-green-50 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 py-2 text-sm whitespace-nowrap">
          {[
            'Grains',
            'Vegetables',
            'Fruits',
            'Livestock',
            'Dairy',
            'Spices',
            'Roots & Tubers',
          ].map((cat) => (
            <Link
              key={cat}
              href={`/products?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-gray-600 hover:text-green-700 font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
