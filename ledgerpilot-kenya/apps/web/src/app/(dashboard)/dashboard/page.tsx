import { DashboardShell } from '@/components/layout/DashboardShell';
import { FirmOverviewCards } from '@/components/dashboard/FirmOverviewCards';
import { ClientStatusTable } from '@/components/dashboard/ClientStatusTable';
import { ComplianceAlerts } from '@/components/dashboard/ComplianceAlerts';

export const metadata = { title: 'Firm Dashboard' };

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Firm Dashboard"
      subtitle="Overview of all client companies"
    >
      <FirmOverviewCards />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClientStatusTable />
        </div>
        <div>
          <ComplianceAlerts />
        </div>
      </div>
    </DashboardShell>
  );
}
