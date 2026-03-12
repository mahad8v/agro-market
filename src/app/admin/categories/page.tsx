'use client';

import React, { useState } from 'react';
import { Button, Badge, Card, Table, Td, Modal, Input } from '@/components/ui';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [form, setForm] = useState({ name: '', icon: '', description: '' });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setForm({ name: '', icon: '', description: '' });
    setIsCreateOpen(true);
  };

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      icon: cat.icon ?? '',
      description: cat.description ?? '',
    });
    setEditTarget(cat);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);

    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editTarget.id ? { ...c, ...form } : c)),
      );
      setEditTarget(null);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        icon: form.icon,
        productCount: 0,
        // @ts-ignore
        createdAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCat]);
      setIsCreateOpen(false);
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteTarget(null);
  };

  const isModalOpen = isCreateOpen || !!editTarget;
  const modalTitle = editTarget ? 'Edit Category' : 'New Category';
  const closeModal = () => {
    setIsCreateOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage product categories
          </p>
        </div>
        <Button
          onClick={openCreate}
          icon={
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          Add Category
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className="text-center hover:shadow-md transition-shadow cursor-pointer"
            padding="sm"
          >
            <div className="text-4xl mb-2">{cat.icon ?? '📦'}</div>
            <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {cat.productCount} products
            </p>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card padding="none">
        <Table headers={['Icon', 'Name', 'Slug', 'Products', 'Actions']}>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
              <Td>
                <span className="text-2xl">{cat.icon ?? '📦'}</span>
              </Td>
              <Td>
                <p className="font-semibold text-gray-900">{cat.name}</p>
                {cat.description && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat.description}
                  </p>
                )}
              </Td>
              <Td>
                <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {cat.slug}
                </span>
              </Td>
              <Td>
                <span className="font-semibold text-gray-900">
                  {cat.productCount}
                </span>
                <span className="text-xs text-gray-400 ml-1">products</span>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(cat)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(cat)}
                    // @ts-ignore
                    disabled={cat.productCount > 0}
                  >
                    Delete
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </Table>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-3xl border-2 border-dashed border-gray-300">
              {form.icon || '📦'}
            </div>
            <Input
              label="Emoji Icon"
              placeholder="e.g. 🥬"
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              className="w-24"
            />
          </div>
          <Input
            label="Category Name *"
            placeholder="e.g. Vegetables"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={2}
              placeholder="Optional description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>
              {editTarget ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">
            "{deleteTarget?.name}"
          </span>
          ?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteTarget && deleteCategory(deleteTarget.id)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
