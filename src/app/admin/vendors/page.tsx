'use client';

import React, { useState } from 'react';
import { Button, Badge, Card, Table, Td, Modal, Input } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  useAdminVendors,
  useApproveVendor,
  useSuspendVendor,
  useDeleteVendor,
} from '@/features/admin/hooks';
import { VendorWithStatus } from '@/types/admin';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type VendorStatusFilter = 'all' | 'pending' | 'approved' | 'suspended';

// ─── BADGES ──────────────────────────────────────────────────────────────────

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: any }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    APPROVED: { label: 'Approved', variant: 'success' },
    SUSPENDED: { label: 'Suspended', variant: 'danger' },
  };
  const s = map[status?.toUpperCase()] ?? { label: status, variant: 'neutral' };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

function getPlanBadge(plan: string) {
  const map: Record<string, any> = {
    FREE: 'neutral',
    PRO: 'info',
    ENTERPRISE: 'purple',
  };
  const key = plan?.toUpperCase();
  return (
    <Badge variant={map[key] ?? 'neutral'}>
      {plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()}
    </Badge>
  );
}

// ─── SKELETONS ────────────────────────────────────────────────────────────────

function StatSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 text-center animate-pulse">
      <div className="h-8 w-12 bg-gray-200 rounded mx-auto mb-2" />
      <div className="h-4 w-24 bg-gray-100 rounded mx-auto" />
    </div>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {/* Vendor col */}
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          </td>
          {Array.from({ length: 5 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </td>
          ))}
          {/* Actions col */}
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <div className="h-7 w-14 bg-gray-200 rounded-lg" />
              <div className="h-7 w-16 bg-gray-100 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── VENDOR DETAIL MODAL ──────────────────────────────────────────────────────

interface VendorDetailModalProps {
  vendor: VendorWithStatus | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onSuspend: (id: string) => void;
  isApproving: boolean;
  isSuspending: boolean;
}

function VendorDetailModal({
  vendor,
  onClose,
  onApprove,
  onSuspend,
  isApproving,
  isSuspending,
}: VendorDetailModalProps) {
  if (!vendor) return null;

  const status = vendor.status?.toUpperCase();

  return (
    <Modal isOpen={!!vendor} onClose={onClose} title="Vendor Details" size="lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl overflow-hidden shrink-0">
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              '🌿'
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {vendor.businessName}
            </h3>
            <p className="text-sm text-gray-500">{vendor.description}</p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Owner', value: vendor.user?.name ?? '—' },
            { label: 'Email', value: vendor.user?.email ?? '—' },
            { label: 'Phone', value: vendor.phone ?? '—' },
            { label: 'Location', value: vendor.location },
            {
              label: 'Commission Rate',
              value: `${(vendor.commissionRate * 100).toFixed(0)}%`,
            },
            {
              label: 'Rating',
              value: `${vendor.rating} ⭐ (${vendor.totalReviews} reviews)`,
            },
            {
              label: 'Total Revenue',
              value: formatCurrency(vendor.totalRevenue ?? 0),
            },
            { label: 'Total Orders', value: vendor.totalOrders ?? 0 },
            { label: 'Member Since', value: formatDate(vendor.createdAt) },
            { label: 'Plan', value: vendor.subscriptionPlan },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {status === 'PENDING' && (
            <Button
              className="flex-1"
              onClick={() => onApprove(vendor.id)}
              disabled={isApproving}
            >
              {isApproving ? 'Approving…' : '✓ Approve Vendor'}
            </Button>
          )}
          {status === 'APPROVED' && (
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => onSuspend(vendor.id)}
              disabled={isSuspending}
            >
              {isSuspending ? 'Suspending…' : 'Suspend Vendor'}
            </Button>
          )}
          {status === 'SUSPENDED' && (
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onApprove(vendor.id)}
              disabled={isApproving}
            >
              {isApproving ? 'Reinstating…' : 'Reinstate Vendor'}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  action: { vendor: VendorWithStatus; type: 'suspend' | 'delete' } | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function ConfirmModal({
  action,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={!!action}
      onClose={onClose}
      title={action?.type === 'delete' ? 'Delete Vendor' : 'Suspend Vendor'}
      size="sm"
    >
      <p className="text-gray-600 mb-6">
        Are you sure you want to {action?.type}{' '}
        <span className="font-semibold text-gray-900">
          "{action?.vendor.businessName}"
        </span>
        ?{action?.type === 'delete' && ' This action cannot be undone.'}
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading
            ? 'Processing…'
            : action?.type === 'delete'
              ? 'Delete'
              : 'Suspend'}
        </Button>
      </div>
    </Modal>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AdminVendorsPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<VendorStatusFilter>('all');
  const [page, setPage] = useState(1);
  const [viewVendor, setViewVendor] = useState<VendorWithStatus | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    vendor: VendorWithStatus;
    type: 'suspend' | 'delete';
  } | null>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useAdminVendors({
    status: filterStatus,
    search: search || undefined,
    page,
    limit: 20,
  });

  console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', data);

  const approveMutation = useApproveVendor();
  const suspendMutation = useSuspendVendor();
  const deleteMutation = useDeleteVendor();

  const vendors = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  // ── Derived counts from current page data ──────────────────────────────────
  // For accurate counts, ideally the API returns these — fall back to page data
  const counts = {
    total: data?.total ?? 0,
    approved: vendors.filter((v) => v.status?.toUpperCase() === 'APPROVED')
      .length,
    pending: vendors.filter((v) => v.status?.toUpperCase() === 'PENDING')
      .length,
    suspended: vendors.filter((v) => v.status?.toUpperCase() === 'SUSPENDED')
      .length,
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleApprove = (id: string) => {
    approveMutation.mutate(id, { onSuccess: () => setViewVendor(null) });
  };

  const handleSuspend = (id: string) => {
    suspendMutation.mutate(id, {
      onSuccess: () => {
        setViewVendor(null);
        setConfirmAction(null);
      },
    });
  };

  const handleDelete = () => {
    if (!confirmAction) return;
    deleteMutation.mutate(confirmAction.vendor.id, {
      onSuccess: () => setConfirmAction(null),
    });
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'delete') handleDelete();
    else handleSuspend(confirmAction.vendor.id);
  };

  // ── Search debounce — reset page on new search ────────────────────────────
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilterStatus = (s: VendorStatusFilter) => {
    setFilterStatus(s);
    setPage(1);
  };

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20 gap-4">
        <div className="text-5xl">⚠️</div>
        <p className="text-gray-900 font-semibold">Failed to load vendors</p>
        <p className="text-sm text-gray-500">{(error as any)?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage all marketplace vendors
        </p>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : [
              {
                label: 'Total Vendors',
                value: data?.total ?? 0,
                color: 'bg-slate-100 text-slate-800',
              },
              {
                label: 'Approved',
                value: counts.approved,
                color: 'bg-emerald-100 text-emerald-800',
              },
              {
                label: 'Pending Review',
                value: counts.pending,
                color: 'bg-amber-100 text-amber-800',
              },
              {
                label: 'Suspended',
                value: counts.suspended,
                color: 'bg-red-100 text-red-800',
              },
            ].map((s) => (
              <Card key={s.label} className="text-center py-4">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <span
                  className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}
                >
                  {s.label}
                </span>
              </Card>
            ))}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search vendors by name, owner, or location..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                'all',
                'approved',
                'pending',
                'suspended',
              ] as VendorStatusFilter[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => handleFilterStatus(s)}
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

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Card padding="none">
        <Table
          headers={[
            'Vendor',
            'Owner',
            'Location',
            'Plan',
            'Revenue',
            'Status',
            'Actions',
          ]}
        >
          {isLoading ? (
            <TableSkeleton rows={6} />
          ) : vendors.length === 0 ? null : (
            vendors.map((vendor) => {
              const status = vendor.status?.toUpperCase();
              return (
                <tr
                  key={vendor.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Vendor name + product count */}
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                        {vendor.logo ? (
                          <img
                            src={vendor.logo}
                            alt={vendor.businessName}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          '🌿'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          {vendor.businessName}
                          {vendor.isVerified && (
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l2.4 5 5.6.8-4 4 .9 5.5-5-2.7-5 2.7.9-5.5-4-4 5.6-.8z" />
                            </svg>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">
                          {vendor.totalProducts ?? 0} products
                        </p>
                      </div>
                    </div>
                  </Td>

                  {/* Owner */}
                  <Td>
                    <p className="text-sm text-gray-700">
                      {vendor.user?.name ?? '—'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {vendor.user?.email ?? '—'}
                    </p>
                  </Td>

                  <Td className="text-sm text-gray-600">{vendor.location}</Td>

                  <Td>{getPlanBadge(vendor.subscriptionPlan)}</Td>

                  {/* Revenue */}
                  <Td>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatCurrency(vendor.totalRevenue ?? 0)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {vendor.totalOrders ?? 0} orders
                    </p>
                  </Td>

                  <Td>{getStatusBadge(vendor.status)}</Td>

                  {/* Actions */}
                  <Td>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewVendor(vendor)}
                      >
                        View
                      </Button>

                      {status === 'PENDING' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(vendor.id)}
                          disabled={approveMutation.isPending}
                        >
                          {approveMutation.isPending ? '…' : 'Approve'}
                        </Button>
                      )}

                      {status === 'APPROVED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmAction({ vendor, type: 'suspend' })
                          }
                        >
                          Suspend
                        </Button>
                      )}

                      {status === 'SUSPENDED' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApprove(vendor.id)}
                          disabled={approveMutation.isPending}
                        >
                          Reinstate
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          setConfirmAction({ vendor, type: 'delete' })
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </Td>
                </tr>
              );
            })
          )}
        </Table>

        {/* Empty state */}
        {!isLoading && vendors.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-2">🏪</p>
            <p className="font-medium">No vendors found</p>
            {search && (
              <p className="text-sm mt-1">
                Try clearing the search or changing the filter.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages} · {data?.total} vendors
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* ── Vendor Detail Modal ──────────────────────────────────────────────── */}
      <VendorDetailModal
        vendor={viewVendor}
        onClose={() => setViewVendor(null)}
        onApprove={handleApprove}
        onSuspend={(id) =>
          setConfirmAction({ vendor: viewVendor!, type: 'suspend' })
        }
        isApproving={approveMutation.isPending}
        isSuspending={suspendMutation.isPending}
      />

      {/* ── Confirm Modal ────────────────────────────────────────────────────── */}
      <ConfirmModal
        action={confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        isLoading={suspendMutation.isPending || deleteMutation.isPending}
      />
    </div>
  );
}
