'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const FIRM_ROLES = ['FIRM_OWNER', 'FIRM_ADMIN', 'SENIOR_ACCOUNTANT', 'BOOKKEEPER', 'PAYROLL_OFFICER', 'TAX_REVIEWER'];

function roleBadge(role: string) {
  const colours: Record<string, string> = {
    FIRM_OWNER: 'bg-purple-100 text-purple-800',
    FIRM_ADMIN: 'bg-blue-100 text-blue-800',
    SENIOR_ACCOUNTANT: 'bg-green-100 text-green-800',
    BOOKKEEPER: 'bg-teal-100 text-teal-800',
    PAYROLL_OFFICER: 'bg-orange-100 text-orange-800',
    TAX_REVIEWER: 'bg-yellow-100 text-yellow-800',
  };
  const label = role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colours[role] ?? 'bg-gray-100 text-gray-800'}`}>
      {label}
    </span>
  );
}

interface StaffMember {
  id: string;
  role: string;
  isActive: boolean;
  invitedAt: string;
  acceptedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    lastLoginAt: string | null;
  };
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('BOOKKEEPER');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [error, setError] = useState('');

  // These would come from the session in a real app
  const firmId = typeof window !== 'undefined' ? localStorage.getItem('firmId') ?? '' : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') ?? '' : '';

  useEffect(() => {
    if (!firmId || !token) return;
    api.staff.list(firmId, token).then((data) => {
      setStaff(data as StaffMember[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [firmId, token]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setError('');
    try {
      await api.staff.invite(firmId, { email: inviteEmail, role: inviteRole }, token);
      setInviteSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  }

  async function handleDeactivate(staffId: string) {
    if (!confirm('Deactivate this staff member?')) return;
    try {
      await api.staff.deactivate(firmId, staffId, token);
      setStaff((prev) => prev.map((s) => s.id === staffId ? { ...s, isActive: false } : s));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate');
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage staff access and roles</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary">
          + Invite staff
        </button>
      </div>

      {inviteSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
          {inviteSuccess}
        </div>
      )}

      {showInvite && (
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Invite a team member</h3>
          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleInvite} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="bookkeeper@example.com"
              />
            </div>
            <div className="w-52">
              <label className="label">Role</label>
              <select className="input" value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {FIRM_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pb-0.5">
              <button type="button" className="btn-secondary" onClick={() => setShowInvite(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={inviteLoading}>
                {inviteLoading ? 'Sending…' : 'Send invite'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last login
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading…</td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No staff members yet. Invite your first team member above.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className={member.isActive ? '' : 'opacity-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        {member.user.firstName[0]}{member.user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{member.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{roleBadge(member.role)}</td>
                  <td className="px-6 py-4">
                    {member.acceptedAt ? (
                      <span className={`text-xs font-medium ${member.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {member.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Invite pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {member.user.lastLoginAt
                      ? new Date(member.user.lastLoginAt).toLocaleDateString('en-KE')
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member.isActive && member.role !== 'FIRM_OWNER' && (
                      <button
                        onClick={() => handleDeactivate(member.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
