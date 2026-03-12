'use client';

import React, { useState } from 'react';
import { Button, Badge, Card, Table, Td, Modal, Input } from '@/components/ui';
import { MOCK_VENDORS } from '@/lib/mockData';
import { Vendor, VendorStatus } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

function getStatusBadge(status: VendorStatus) {
  const map: Record<VendorStatus, { label: string; variant: any }> = {
    approved: { label: 'Approved', variant: 'success' },
    pending: { label: 'Pending', variant: 'warning' },
    suspended: { label: 'Suspended', variant: 'danger' },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

function getPlanBadge(plan: string) {
  const map: Record<string, any> = {
    free: 'neutral',
    pro: 'info',
    enterprise: 'purple',
  };
  return <Badge variant={map[plan] ?? 'neutral'}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</Badge>;
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ vendor: Vendor; action: 'suspend' | 'delete' } | null>(null);

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.businessName.toLowerCase().includes(search.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: VendorStatus) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status, isVerified: status === 'approved' } : v)));
    setViewVendor(null);
  };

  const deleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
    setConfirmAction(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage all marketplace vendors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, color: 'bg-slate-100 text-slate-800' },
          { label: 'Approved', value: vendors.filter((v) => v.status === 'approved').length, color: 'bg-emerald-100 text-emerald-800' },
          { label: 'Pending Review', value: vendors.filter((v) => v.status === 'pending').length, color: 'bg-amber-100 text-amber-800' },
          { label: 'Suspended', value: vendors.filter((v) => v.status === 'suspended').length, color: 'bg-red-100 text-red-800' },
        ].map((s) => (
          <Card key={s.label} className="text-center py-4">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
              {s.label}
            </span>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search vendors by name, owner, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          <div className="flex gap-2">
            {['all', 'approved', 'pending', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === s
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <Table headers={['Vendor', 'Owner', 'Location', 'Plan', 'Revenue', 'Status', 'Actions']}>
          {filtered.map((vendor) => (
            <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                    {vendor.logo ? (
                      <img src={vendor.logo} alt={vendor.businessName} className="w-full h-full object-cover rounded-xl" />
                    ) : '🌿'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                      {vendor.businessName}
                      {vendor.isVerified && (
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l2.4 5 5.6.8-4 4 .9 5.5-5-2.7-5 2.7.9-5.5-4-4 5.6-.8z" />
                        </svg>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{vendor.totalProducts} products</p>
                  </div>
                </div>
              </Td>
              <Td>
                <p className="text-sm text-gray-700">{vendor.ownerName}</p>
                <p className="text-xs text-gray-400">{vendor.email}</p>
              </Td>
              <Td className="text-sm text-gray-600">{vendor.location}</Td>
              <Td>{getPlanBadge(vendor.subscriptionPlan)}</Td>
              <Td>
                <p className="font-semibold text-gray-900 text-sm">{formatCurrency(vendor.totalRevenue)}</p>
                <p className="text-xs text-gray-400">{vendor.totalOrders} orders</p>
              </Td>
              <Td>{getStatusBadge(vendor.status)}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewVendor(vendor)}>
                    View
                  </Button>
                  {vendor.status === 'pending' && (
                    <Button variant="primary" size="sm" onClick={() => updateStatus(vendor.id, 'approved')}>
                      Approve
                    </Button>
                  )}
                  {vendor.status === 'approved' && (
                    <Button variant="ghost" size="sm" onClick={() => setConfirmAction({ vendor, action: 'suspend' })}>
                      Suspend
                    </Button>
                  )}
                  {vendor.status === 'suspended' && (
                    <Button variant="secondary" size="sm" onClick={() => updateStatus(vendor.id, 'approved')}>
                      Reinstate
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => setConfirmAction({ vendor, action: 'delete' })}>
                    Delete
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">🏪</p>
            <p className="font-medium">No vendors found</p>
          </div>
        )}
      </Card>

      {/* Vendor Detail Modal */}
      <Modal isOpen={!!viewVendor} onClose={() => setViewVendor(null)} title="Vendor Details" size="lg">
        {viewVendor && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl">🌿</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{viewVendor.businessName}</h3>
                <p className="text-sm text-gray-500">{viewVendor.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Owner', value: viewVendor.ownerName },
                { label: 'Email', value: viewVendor.email },
                { label: 'Phone', value: viewVendor.phone },
                { label: 'Location', value: viewVendor.location },
                { label: 'Commission Rate', value: `${(viewVendor.commissionRate * 100).toFixed(0)}%` },
                { label: 'Rating', value: `${viewVendor.rating} ⭐ (${viewVendor.totalReviews} reviews)` },
                { label: 'Total Revenue', value: formatCurrency(viewVendor.totalRevenue) },
                { label: 'Total Orders', value: viewVendor.totalOrders },
                { label: 'Member Since', value: formatDate(viewVendor.createdAt) },
                { label: 'Plan', value: viewVendor.subscriptionPlan.toUpperCase() },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              {viewVendor.status === 'pending' && (
                <Button className="flex-1" onClick={() => updateStatus(viewVendor.id, 'approved')}>
                  ✓ Approve Vendor
                </Button>
              )}
              {viewVendor.status === 'approved' && (
                <Button variant="ghost" className="flex-1" onClick={() => { updateStatus(viewVendor.id, 'suspended'); }}>
                  Suspend Vendor
                </Button>
              )}
              {viewVendor.status === 'suspended' && (
                <Button variant="secondary" className="flex-1" onClick={() => updateStatus(viewVendor.id, 'approved')}>
                  Reinstate Vendor
                </Button>
              )}
              <Button variant="outline" onClick={() => setViewVendor(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.action === 'delete' ? 'Delete Vendor' : 'Suspend Vendor'}
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to {confirmAction?.action}{' '}
          <span className="font-semibold text-gray-900">"{confirmAction?.vendor.businessName}"</span>?
          {confirmAction?.action === 'delete' && ' This action cannot be undone.'}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!confirmAction) return;
              if (confirmAction.action === 'delete') deleteVendor(confirmAction.vendor.id);
              else { updateStatus(confirmAction.vendor.id, 'suspended'); setConfirmAction(null); }
            }}
          >
            {confirmAction?.action === 'delete' ? 'Delete' : 'Suspend'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
