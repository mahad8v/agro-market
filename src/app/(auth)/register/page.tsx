'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Input, Button } from '@/components/ui';
import { RegisterData } from '@/types';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(form);
    } catch (err: unknown) {
      setError((err as { message?: string }).message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const set = (key: keyof RegisterData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-bold text-green-700">AgroMarket</span>
            </Link>
            <p className="text-gray-500 mt-2 text-sm">Create your account to get started.</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(['customer', 'vendor'] as const).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => set('role', role)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                  form.role === role
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{role === 'customer' ? '🛒' : '🏪'}</span>
                <span className="text-sm font-medium capitalize">{role}</span>
                <span className="text-xs text-center text-gray-400">
                  {role === 'customer' ? 'Buy products' : 'Sell products'}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="John Doe"
            />
            {form.role === 'vendor' && (
              <Input
                label="Business Name"
                required
                value={form.businessName || ''}
                onChange={e => set('businessName', e.target.value)}
                placeholder="Green Farm Co."
              />
            )}
            <Input
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={e => set('password', e.target.value)}
              placeholder="At least 8 characters"
            />

            <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
