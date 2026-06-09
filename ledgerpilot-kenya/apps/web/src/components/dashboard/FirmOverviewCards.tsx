'use client';

import { Building2, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const STAT_CARDS = [
  {
    label: 'Active Clients',
    value: '—',
    icon: Building2,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
  },
  {
    label: 'Closes Complete',
    value: '—',
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Obligations Due',
    value: '—',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Overdue',
    value: '—',
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
];

export function FirmOverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
