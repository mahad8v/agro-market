'use client';

import React, { useState } from 'react';
import { ProductFilters as Filters } from '@/types';
import { Button, Input, Select } from '@/components/ui';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'grains', label: 'Grains & Cereals' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'livestock', label: 'Livestock & Poultry' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'spices', label: 'Spices & Herbs' },
  { value: 'roots', label: 'Roots & Tubers' },
];

interface ProductFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const update = (key: keyof Filters, value: unknown) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const apply = () => onChange(localFilters);
  const reset = () => {
    const cleared: Filters = {};
    setLocalFilters(cleared);
    onChange(cleared);
  };

  return (
    <aside className="w-full space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Filters</h3>

        <div className="space-y-4">
          <Select
            label="Category"
            options={CATEGORIES}
            value={localFilters.category || ''}
            onChange={e => update('category', e.target.value)}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice || ''}
                onChange={e => update('minPrice', Number(e.target.value))}
              />
              <span className="text-gray-400">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice || ''}
                onChange={e => update('maxPrice', Number(e.target.value))}
              />
            </div>
          </div>

          <Input
            label="Location"
            placeholder="e.g. Lagos, Kano"
            value={localFilters.location || ''}
            onChange={e => update('location', e.target.value)}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.isOrganic || false}
              onChange={e => update('isOrganic', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Organic Only 🌿</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={apply} variant="primary" size="md">Apply Filters</Button>
        <Button onClick={reset} variant="ghost" size="md">Reset</Button>
      </div>
    </aside>
  );
}
