'use client';

import { AlertTriangle, Calendar } from 'lucide-react';

export function ComplianceAlerts() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <h3 className="font-semibold text-gray-900">Upcoming Obligations</h3>
      </div>
      <div className="p-5 flex flex-col items-center justify-center h-48 text-center">
        <AlertTriangle className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">
          Compliance calendar will appear here once clients are added.
        </p>
      </div>
    </div>
  );
}
