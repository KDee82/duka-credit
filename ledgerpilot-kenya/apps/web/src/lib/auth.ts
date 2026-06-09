'use server';

import { cookies } from 'next/headers';
import { api } from './api';

const ACCESS_COOKIE = 'lp_access';
const REFRESH_COOKIE = 'lp_refresh';
const USER_COOKIE = 'lp_user';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  totpEnabled: boolean;
}

export async function getSession(): Promise<{ token: string; user: AuthUser } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE)?.value;
  const userRaw = cookieStore.get(USER_COOKIE)?.value;
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser };
  } catch {
    return null;
  }
}

export async function setSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
): Promise<void> {
  const cookieStore = await cookies();
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', sameSite: 'lax' as const };
  cookieStore.set(ACCESS_COOKIE, accessToken, { ...opts, maxAge: 15 * 60 });
  cookieStore.set(REFRESH_COOKIE, refreshToken, { ...opts, maxAge: 30 * 24 * 60 * 60 });
  cookieStore.set(USER_COOKIE, JSON.stringify(user), { ...opts, maxAge: 30 * 24 * 60 * 60, httpOnly: false });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(USER_COOKIE);
}

export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  try {
    const { accessToken } = await api.auth.refresh(refreshToken);
    cookieStore.set(ACCESS_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60,
    });
    return accessToken;
  } catch {
    return null;
  }
}
