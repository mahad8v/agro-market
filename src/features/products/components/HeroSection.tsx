import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-600 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-green-900/40 rounded-full px-4 py-1.5 text-sm text-green-100 mb-6">
            <span>🌿</span>
            <span>100% Fresh & Locally Sourced</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Fresh From
            <span className="block text-yellow-300">Farm to Table</span>
          </h1>

          <p className="text-lg text-green-100 mb-8 leading-relaxed">
            Shop directly from verified farmers and agricultural vendors. Get the freshest produce, grains, and organic products delivered to your door.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-yellow-400 text-green-900 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition-colors text-base"
            >
              Shop Now 🛒
            </Link>
            <Link
              href="/vendors"
              className="border-2 border-white/70 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors text-base"
            >
              Meet Our Vendors
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-10 text-sm text-green-100">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-bold text-lg">500+</span>
              <span>Vendors</span>
            </div>
            <div className="w-px h-6 bg-green-500" />
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-bold text-lg">10k+</span>
              <span>Products</span>
            </div>
            <div className="w-px h-6 bg-green-500" />
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-bold text-lg">50k+</span>
              <span>Happy Buyers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
