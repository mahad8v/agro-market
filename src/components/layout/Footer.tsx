import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="text-xl font-bold text-white">AgroMarket</span>
            </div>
            <p className="text-sm text-green-300 leading-relaxed">
              Connecting farmers directly to buyers. Fresh, organic, and locally sourced agricultural products.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li><Link href="/products" className="hover:text-white">Browse Products</Link></li>
              <li><Link href="/vendors" className="hover:text-white">Our Vendors</Link></li>
              <li><Link href="/products?isOrganic=true" className="hover:text-white">Organic Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">For Vendors</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li><Link href="/register" className="hover:text-white">Become a Vendor</Link></li>
              <li><Link href="/vendor/dashboard" className="hover:text-white">Vendor Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-400">
          © {new Date().getFullYear()} AgroMarket. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
