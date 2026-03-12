'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'green' | 'blue' | 'amber' | 'purple' | 'red';
}

export function StatCard({ title, value, icon, change, changeType = 'positive', color = 'green' }: StatCardProps) {
  const colors = {
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
    red: 'bg-red-50 text-red-700',
  };
  const changeColors = {
    positive: 'text-emerald-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={cn('mt-1 text-xs font-medium', changeColors[changeType])}>{change}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colors[color])}>{icon}</div>
      </div>
    </Card>
  );
}
