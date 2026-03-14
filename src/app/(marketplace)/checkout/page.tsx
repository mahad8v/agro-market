'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@/features/orders/hooks';
import { Input, Select } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { ShippingAddress } from '@/types';
import Link from 'next/link';

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
].map((s) => ({ value: s, label: s }));

export default function CheckoutPage() {
  const { vendorGroups, totalAmount, clearCart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const router = useRouter();

  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  if (vendorGroups.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-green-600 hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};
    if (!form.fullName) newErrors.fullName = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.address) newErrors.address = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.state) newErrors.state = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createOrder({ vendorGroups, shippingAddress: form });
      clearCart();
      router.push('/');
      alert('Order placed successfully! 🎉');
    } catch {
      alert('Failed to place order. Please try again.');
    }
  };

  const set = (key: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-5">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name"
                    required
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    error={errors.fullName}
                    placeholder="John Doe"
                  />
                </div>
                <Input
                  label="Phone Number"
                  required
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="+234 801 234 5678"
                />
                <Select
                  label="State"
                  required
                  value={form.state}
                  onChange={(e) => set('state', e.target.value)}
                  error={errors.state}
                  options={NIGERIAN_STATES}
                  placeholder="Select State"
                />
                <Input
                  label="City"
                  required
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  error={errors.city}
                  placeholder="Lagos"
                />
                <Input
                  label="Postal Code"
                  value={form.postalCode}
                  onChange={(e) => set('postalCode', e.target.value)}
                  placeholder="100001"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Delivery Address"
                    required
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    error={errors.address}
                    placeholder="123 Main Street, Ikeja"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">
                Delivery Method
              </h2>
              <div className="space-y-3">
                {[
                  {
                    id: 'standard',
                    label: 'Standard Delivery',
                    desc: '3–5 business days',
                    price: 'Free',
                  },
                  {
                    id: 'express',
                    label: 'Express Delivery',
                    desc: '1–2 business days',
                    price: 'D2,500',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-4 cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-green-400 transition-colors"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      defaultChecked={opt.id === 'standard'}
                      className="text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                    <span className="font-semibold text-green-700">
                      {opt.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">Order Summary</h2>

              {vendorGroups.map((group) => (
                <div key={group.vendor?.id ?? 'unknown'} className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    {group.vendor?.businessName}
                  </p>
                  {group.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span className="line-clamp-1 flex-1 mr-2">
                        {item.product.name} ×{item.quantity}
                      </span>
                      <span className="shrink-0">
                        {formatCurrency(
                          (item.product.discountPrice ?? item.product.price) *
                            item.quantity,
                        )}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium text-gray-700 border-t border-gray-100 pt-2">
                    <span>Subtotal</span>
                    <span>{formatCurrency(group.subtotal)}</span>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-700 text-lg">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {isPending
                  ? 'Placing Order...'
                  : `Place Order · ${formatCurrency(totalAmount)}`}
              </button>

              <p className="text-xs text-center text-gray-400">
                🔒 Secure checkout. Your information is protected.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
