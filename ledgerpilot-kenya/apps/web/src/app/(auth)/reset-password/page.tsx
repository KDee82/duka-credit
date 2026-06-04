'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.auth.resetPassword({ token, password });
      router.push('/login?reset=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600">Invalid reset link.</p>
        <Link href="/forgot-password" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="label">New password</label>
        <input
          type="password"
          className="input"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Confirm password</label>
        <input
          type="password"
          className="input"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? 'Resetting…' : 'Set new password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set a new password</h1>
        <p className="text-gray-500 text-sm mb-6">Choose a strong password of at least 8 characters.</p>
        <Suspense fallback={<div className="animate-pulse h-40 bg-gray-100 rounded-lg" />}>
          <ResetPasswordForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
