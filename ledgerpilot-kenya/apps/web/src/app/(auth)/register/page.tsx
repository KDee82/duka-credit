'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Step = 'account' | 'firm' | 'done';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountData, setAccountData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [firmData, setFirmData] = useState({ firmName: '' });

  async function handleFirmRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.firms.register({
        firmName: firmData.firmName,
        ownerEmail: accountData.email,
        ownerPassword: accountData.password,
        ownerFirstName: accountData.firstName,
        ownerLastName: accountData.lastName,
        ownerPhone: accountData.phone || undefined,
      });
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re in!</h2>
          <p className="text-gray-600 mb-6">
            Your firm has been registered. Check <strong>{accountData.email}</strong> to verify your
            account before logging in.
          </p>
          <Link href="/login" className="btn-primary block w-full text-center">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            {(['account', 'firm'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full ${
                  step === s || (step === 'firm' && s === 'account') ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'account' ? 'Create your account' : 'Set up your firm'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {step === 'account'
              ? 'Step 1 of 2 — Your personal details'
              : 'Step 2 of 2 — Firm information'}
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {step === 'account' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('firm');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input
                  className="input"
                  required
                  value={accountData.firstName}
                  onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  className="input"
                  required
                  value={accountData.lastName}
                  onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                required
                value={accountData.email}
                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                required
                minLength={8}
                value={accountData.password}
                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>
            <div>
              <label className="label">Phone (optional)</label>
              <input
                type="tel"
                className="input"
                placeholder="+254712345678"
                value={accountData.phone}
                onChange={(e) => setAccountData({ ...accountData, phone: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleFirmRegister} className="space-y-4">
            <div>
              <label className="label">Firm / Practice name</label>
              <input
                className="input"
                required
                placeholder="e.g. Wanjiku & Associates CPA"
                value={firmData.firmName}
                onChange={(e) => setFirmData({ firmName: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setStep('account')}
              >
                Back
              </button>
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Creating…' : 'Create firm'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
