const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers['Authorization'] = `Bearer ${opts.token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  auth: {
    register: (body: unknown) => request('/auth/register', { method: 'POST', body }),
    login: (body: unknown) => request<{ accessToken: string; refreshToken: string; user: unknown }>('/auth/login', { method: 'POST', body }),
    logout: (token: string) => request('/auth/logout', { method: 'POST', token }),
    refresh: (refreshToken: string) => request<{ accessToken: string }>('/auth/refresh', { method: 'POST', body: { refreshToken } }),
    verifyEmail: (token: string) => request('/auth/verify-email', { method: 'POST', body: { token } }),
    forgotPassword: (email: string) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
    resetPassword: (body: unknown) => request('/auth/reset-password', { method: 'POST', body }),
    initTotp: (token: string) => request<{ secret: string; otpauthUrl: string }>('/auth/totp/init', { method: 'POST', token }),
    confirmTotp: (code: string, token: string) => request('/auth/totp/confirm', { method: 'POST', body: { code }, token }),
    disableTotp: (code: string, token: string) => request('/auth/totp/disable', { method: 'POST', body: { code }, token }),
  },
  firms: {
    register: (body: unknown) => request('/firms/register', { method: 'POST', body }),
    get: (firmId: string, token: string) => request(`/firms/${firmId}`, { token }),
    update: (firmId: string, body: unknown, token: string) => request(`/firms/${firmId}`, { method: 'PATCH', body, token }),
    dashboard: (firmId: string, token: string) => request(`/firms/${firmId}/dashboard`, { token }),
  },
  staff: {
    list: (firmId: string, token: string) => request(`/firms/${firmId}/staff`, { token }),
    invite: (firmId: string, body: unknown, token: string) => request(`/firms/${firmId}/staff/invite`, { method: 'POST', body, token }),
    updateRole: (firmId: string, staffId: string, role: string, token: string) =>
      request(`/firms/${firmId}/staff/${staffId}/role`, { method: 'PATCH', body: { role }, token }),
    deactivate: (firmId: string, staffId: string, token: string) =>
      request(`/firms/${firmId}/staff/${staffId}`, { method: 'DELETE', token }),
    acceptInvite: (body: unknown) => request('/staff/accept-invite', { method: 'POST', body }),
  },
  companies: {
    list: (firmId: string, token: string) => request(`/firms/${firmId}/companies`, { token }),
    create: (firmId: string, body: unknown, token: string) =>
      request(`/firms/${firmId}/companies`, { method: 'POST', body, token }),
    get: (companyId: string, token: string) => request(`/companies/${companyId}`, { token }),
    update: (companyId: string, body: unknown, token: string) =>
      request(`/companies/${companyId}`, { method: 'PATCH', body, token }),
    archive: (companyId: string, token: string) =>
      request(`/companies/${companyId}/archive`, { method: 'PATCH', token }),
    restore: (companyId: string, token: string) =>
      request(`/companies/${companyId}/restore`, { method: 'PATCH', token }),
    inviteClient: (companyId: string, body: unknown, token: string) =>
      request(`/companies/${companyId}/invite-client`, { method: 'POST', body, token }),
    healthScore: (companyId: string, token: string) =>
      request(`/companies/${companyId}/health-score`, { token }),
    acceptClientInvite: (body: unknown) =>
      request('/client-onboarding/accept', { method: 'POST', body }),
  },
  audit: {
    query: (companyId: string, params: Record<string, string>, token: string) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/companies/${companyId}/audit${qs ? `?${qs}` : ''}`, { token });
    },
  },
};
