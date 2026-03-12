'use client';

import React, { useState } from 'react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { MOCK_VENDORS } from '@/lib/mockData';

export default function VendorSettingsPage() {
  const vendor = MOCK_VENDORS[0];
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    businessName: vendor.businessName,
    description: vendor.description,
    ownerName: vendor.ownerName,
    email: vendor.email,
    phone: vendor.phone,
    location: vendor.location,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const planColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store profile and preferences</p>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      {/* Plan */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Subscription Plan</h3>
            <p className="text-sm text-gray-500 mt-0.5">Your current subscription plan</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold capitalize ${planColors[vendor.subscriptionPlan]}`}>
              {vendor.subscriptionPlan}
            </span>
            <div className="mt-2">
              <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">
                Upgrade Plan →
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          {[
            { label: 'Commission Rate', value: `${(vendor.commissionRate * 100).toFixed(0)}%` },
            { label: 'Status', value: vendor.isVerified ? 'Verified ✓' : 'Pending' },
            { label: 'Member Since', value: new Date(vendor.createdAt).getFullYear().toString() },
          ].map((s) => (
            <div key={s.label} className="text-center bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Business Info */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Business Information</h3>
        <div className="space-y-4">
          <Input
            label="Business Name"
            value={form.businessName}
            onChange={(e) => set('businessName', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
          <Input
            label="Location / Address"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
          />
        </div>
      </Card>

      {/* Contact */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h3>
        <div className="space-y-4">
          <Input label="Owner Name" value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
      </Card>

      {/* Branding */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Branding</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Store Logo</p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-emerald-100 flex items-center justify-center text-3xl">
                🌿
              </div>
              <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Upload Logo
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Store Banner</p>
            <div className="h-24 rounded-xl bg-gradient-to-r from-emerald-100 to-green-200 flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-300 hover:border-emerald-400 cursor-pointer transition-colors">
              Click to upload banner image
            </div>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3 pb-4">
        <Button variant="outline">Reset Changes</Button>
        <Button onClick={handleSave} loading={saving}>Save Settings</Button>
      </div>
    </div>
  );
}
