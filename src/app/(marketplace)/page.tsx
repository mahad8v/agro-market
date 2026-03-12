import React from 'react';
import Link from 'next/link';
import { HeroSection } from '@/features/products/components/HeroSection';
import { FeaturedProductsSection } from '@/features/products/components/FeaturedProductsSection';
import { FeaturedVendorsSection } from '@/features/vendors/components/FeaturedVendorsSection';
import { CategoriesSection } from '@/features/products/components/CategoriesSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FeaturedVendorsSection />

      {/* CTA Banner */}
      <section className="bg-green-700 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Farmer or Agricultural Vendor?</h2>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of vendors selling fresh produce directly to buyers across the country.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors"
        >
          Start Selling Today
        </Link>
      </section>
    </div>
  );
}
