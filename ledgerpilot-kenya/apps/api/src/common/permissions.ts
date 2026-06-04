import { FirmRole, ClientRole } from '@ledgerpilot/database';

export type Permission =
  | 'firm:read'
  | 'firm:update'
  | 'firm:manage_staff'
  | 'firm:manage_billing'
  | 'company:create'
  | 'company:read'
  | 'company:update'
  | 'company:archive'
  | 'company:invite_client'
  | 'accounts:read'
  | 'accounts:write'
  | 'journals:read'
  | 'journals:write'
  | 'journals:approve'
  | 'invoices:read'
  | 'invoices:write'
  | 'bills:read'
  | 'bills:write'
  | 'bills:approve'
  | 'payroll:read'
  | 'payroll:write'
  | 'payroll:approve'
  | 'compliance:read'
  | 'compliance:write'
  | 'documents:read'
  | 'documents:write'
  | 'reports:read'
  | 'audit:read';

const FIRM_PERMISSIONS: Record<FirmRole, Permission[]> = {
  FIRM_OWNER: [
    'firm:read', 'firm:update', 'firm:manage_staff', 'firm:manage_billing',
    'company:create', 'company:read', 'company:update', 'company:archive', 'company:invite_client',
    'accounts:read', 'accounts:write',
    'journals:read', 'journals:write', 'journals:approve',
    'invoices:read', 'invoices:write',
    'bills:read', 'bills:write', 'bills:approve',
    'payroll:read', 'payroll:write', 'payroll:approve',
    'compliance:read', 'compliance:write',
    'documents:read', 'documents:write',
    'reports:read', 'audit:read',
  ],
  FIRM_ADMIN: [
    'firm:read', 'firm:update', 'firm:manage_staff',
    'company:create', 'company:read', 'company:update', 'company:archive', 'company:invite_client',
    'accounts:read', 'accounts:write',
    'journals:read', 'journals:write', 'journals:approve',
    'invoices:read', 'invoices:write',
    'bills:read', 'bills:write', 'bills:approve',
    'payroll:read', 'payroll:write', 'payroll:approve',
    'compliance:read', 'compliance:write',
    'documents:read', 'documents:write',
    'reports:read', 'audit:read',
  ],
  SENIOR_ACCOUNTANT: [
    'firm:read',
    'company:read', 'company:update',
    'accounts:read', 'accounts:write',
    'journals:read', 'journals:write', 'journals:approve',
    'invoices:read', 'invoices:write',
    'bills:read', 'bills:write', 'bills:approve',
    'payroll:read', 'payroll:write', 'payroll:approve',
    'compliance:read', 'compliance:write',
    'documents:read', 'documents:write',
    'reports:read', 'audit:read',
  ],
  BOOKKEEPER: [
    'firm:read',
    'company:read',
    'accounts:read', 'accounts:write',
    'journals:read', 'journals:write',
    'invoices:read', 'invoices:write',
    'bills:read', 'bills:write',
    'payroll:read', 'payroll:write',
    'compliance:read',
    'documents:read', 'documents:write',
    'reports:read',
  ],
  PAYROLL_OFFICER: [
    'firm:read',
    'company:read',
    'accounts:read',
    'payroll:read', 'payroll:write',
    'compliance:read',
    'documents:read',
    'reports:read',
  ],
  TAX_REVIEWER: [
    'firm:read',
    'company:read',
    'accounts:read',
    'journals:read',
    'invoices:read',
    'bills:read',
    'payroll:read',
    'compliance:read', 'compliance:write',
    'documents:read',
    'reports:read',
    'audit:read',
  ],
};

const CLIENT_PERMISSIONS: Record<ClientRole, Permission[]> = {
  CLIENT_OWNER: [
    'company:read',
    'accounts:read',
    'journals:read',
    'invoices:read', 'invoices:write',
    'bills:read',
    'payroll:read',
    'compliance:read',
    'documents:read', 'documents:write',
    'reports:read',
  ],
  CLIENT_FINANCE_STAFF: [
    'company:read',
    'accounts:read',
    'invoices:read', 'invoices:write',
    'bills:read',
    'documents:read', 'documents:write',
    'reports:read',
  ],
  AUDITOR_READONLY: [
    'company:read',
    'accounts:read',
    'journals:read',
    'invoices:read',
    'bills:read',
    'payroll:read',
    'compliance:read',
    'documents:read',
    'reports:read',
    'audit:read',
  ],
  EXTERNAL_CONSULTANT: [
    'company:read',
    'accounts:read',
    'journals:read',
    'invoices:read',
    'bills:read',
    'reports:read',
  ],
};

export function getFirmPermissions(role: FirmRole): Permission[] {
  return FIRM_PERMISSIONS[role] ?? [];
}

export function getClientPermissions(role: ClientRole): Permission[] {
  return CLIENT_PERMISSIONS[role] ?? [];
}

export function hasPermission(
  permissions: Permission[],
  required: Permission,
): boolean {
  return permissions.includes(required);
}
