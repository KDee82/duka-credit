'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, CreditCard,
  BarChart3, Calendar, CheckSquare, Settings, Building2,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Clients',      href: '/clients',      icon: Building2 },
  { label: 'Documents',    href: '/documents',    icon: FileText },
  { label: 'Sales',        href: '/sales',        icon: CreditCard },
  { label: 'Purchases',    href: '/purchases',    icon: CreditCard },
  { label: 'Reports',      href: '/reports',      icon: BarChart3 },
  { label: 'Compliance',   href: '/compliance',   icon: Calendar },
  { label: 'Tasks',        href: '/tasks',        icon: CheckSquare },
  { label: 'Team',         href: '/team',         icon: Users },
  { label: 'Settings',     href: '/settings',     icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 flex-col bg-white border-r border-gray-200 shrink-0">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-lg font-bold text-brand-600">LedgerPilot</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-3 border-t border-gray-200">
        <div className="px-3 py-2 text-xs text-gray-400">
          LedgerPilot Kenya v0.1.0
        </div>
      </div>
    </aside>
  );
}
