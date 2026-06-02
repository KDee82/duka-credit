'use client';

export function ClientStatusTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Client Companies</h3>
        <a href="/clients" className="text-xs text-brand-600 hover:underline">View all</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Bookkeeper</th>
              <th className="px-5 py-3 font-medium">Close Status</th>
              <th className="px-5 py-3 font-medium">Health</th>
              <th className="px-5 py-3 font-medium">Next Deadline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">
                No client companies yet.{' '}
                <a href="/clients/new" className="text-brand-600 hover:underline">
                  Add your first client
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
