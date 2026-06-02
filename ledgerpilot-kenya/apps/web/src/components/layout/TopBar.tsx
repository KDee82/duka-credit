'use client';

import { Bell, Search } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients, documents, transactions…"
          className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-medium">
          JM
        </div>
      </div>
    </header>
  );
}
