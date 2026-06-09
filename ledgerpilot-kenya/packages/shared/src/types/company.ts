export interface CompanyHealthScore {
  total: number;
  bankReconScore: number;
  vatInvoiceScore: number;
  missingReceiptScore: number;
  payrollScore: number;
  taxReturnsScore: number;
  unreconciledScore: number;
  debtorScore: number;
  creditorScore: number;
  documentScore: number;
  closeScore: number;
}

export interface MonthlyCloseChecklistItem {
  step: number;
  name: string;
  description?: string;
  isRequired: boolean;
}

export const DEFAULT_CLOSE_CHECKLIST: MonthlyCloseChecklistItem[] = [
  { step: 1,  name: 'Import bank statements',          isRequired: true },
  { step: 2,  name: 'Import M-Pesa statements',        isRequired: true },
  { step: 3,  name: 'Upload supplier invoices',        isRequired: true },
  { step: 4,  name: 'Upload customer invoices',        isRequired: true },
  { step: 5,  name: 'Match receipts',                  isRequired: true },
  { step: 6,  name: 'Reconcile bank accounts',         isRequired: true },
  { step: 7,  name: 'Reconcile M-Pesa accounts',       isRequired: true },
  { step: 8,  name: 'Review debtors',                  isRequired: false },
  { step: 9,  name: 'Review creditors',                isRequired: false },
  { step: 10, name: 'Review payroll journal',          isRequired: false },
  { step: 11, name: 'Review VAT control',              isRequired: true },
  { step: 12, name: 'Review PAYE/NSSF/SHA/Housing Levy', isRequired: true },
  { step: 13, name: 'Post accruals',                   isRequired: false },
  { step: 14, name: 'Post depreciation',               isRequired: false },
  { step: 15, name: 'Review suspense account',         isRequired: true },
  { step: 16, name: 'Lock month',                      isRequired: true },
  { step: 17, name: 'Generate management pack',        isRequired: false },
  { step: 18, name: 'Send client report',              isRequired: false },
];
