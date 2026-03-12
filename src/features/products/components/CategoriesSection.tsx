import React from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Grains & Cereals', icon: '🌾', slug: 'grains', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
  { name: 'Vegetables', icon: '🥦', slug: 'vegetables', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { name: 'Fruits', icon: '🍎', slug: 'fruits', color: 'bg-red-50 hover:bg-red-100 border-red-200' },
  { name: 'Livestock', icon: '🐄', slug: 'livestock', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { name: 'Dairy', icon: '🥛', slug: 'dairy', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { name: 'Spices & Herbs', icon: '🌶️', slug: 'spices', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { name: 'Roots & Tubers', icon: '🥔', slug: 'roots', color: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
  { name: 'Organic', icon: '🌿', slug: 'organic', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
];

export function CategoriesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-colors ${cat.color}`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
