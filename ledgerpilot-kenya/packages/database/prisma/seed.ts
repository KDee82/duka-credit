import { PrismaClient, AccountType, AccountSubType } from '@prisma/client';

const prisma = new PrismaClient();

const KENYA_SME_ACCOUNTS = [
  // ── ASSETS ──────────────────────────────────
  { code: '1000', name: 'Current Assets', type: AccountType.ASSET, subType: AccountSubType.CURRENT_ASSET },
  { code: '1010', name: 'Cash on Hand', type: AccountType.ASSET, subType: AccountSubType.CURRENT_ASSET },
  { code: '1020', name: 'Petty Cash', type: AccountType.ASSET, subType: AccountSubType.CURRENT_ASSET },
  { code: '1100', name: 'Bank Accounts', type: AccountType.ASSET, subType: AccountSubType.BANK },
  { code: '1110', name: 'M-Pesa Account', type: AccountType.ASSET, subType: AccountSubType.BANK },
  { code: '1200', name: 'Trade Debtors', type: AccountType.ASSET, subType: AccountSubType.ACCOUNTS_RECEIVABLE },
  { code: '1300', name: 'Inventory / Stock', type: AccountType.ASSET, subType: AccountSubType.INVENTORY },
  { code: '1400', name: 'Prepayments', type: AccountType.ASSET, subType: AccountSubType.PREPAYMENT },
  { code: '1500', name: 'Other Current Assets', type: AccountType.ASSET, subType: AccountSubType.CURRENT_ASSET },
  { code: '1600', name: 'Non-Current Assets', type: AccountType.ASSET, subType: AccountSubType.NON_CURRENT_ASSET },
  { code: '1610', name: 'Property & Equipment (Cost)', type: AccountType.ASSET, subType: AccountSubType.NON_CURRENT_ASSET },
  { code: '1620', name: 'Accumulated Depreciation', type: AccountType.ASSET, subType: AccountSubType.NON_CURRENT_ASSET },
  { code: '1700', name: 'Intangible Assets', type: AccountType.ASSET, subType: AccountSubType.NON_CURRENT_ASSET },

  // ── LIABILITIES ─────────────────────────────
  { code: '2000', name: 'Current Liabilities', type: AccountType.LIABILITY, subType: AccountSubType.CURRENT_LIABILITY },
  { code: '2100', name: 'Trade Creditors', type: AccountType.LIABILITY, subType: AccountSubType.ACCOUNTS_PAYABLE },
  { code: '2200', name: 'VAT Payable', type: AccountType.LIABILITY, subType: AccountSubType.VAT_LIABILITY },
  { code: '2210', name: 'VAT Input Control', type: AccountType.LIABILITY, subType: AccountSubType.VAT_LIABILITY },
  { code: '2220', name: 'VAT Output Control', type: AccountType.LIABILITY, subType: AccountSubType.VAT_LIABILITY },
  { code: '2300', name: 'PAYE Payable', type: AccountType.LIABILITY, subType: AccountSubType.PAYE_LIABILITY },
  { code: '2310', name: 'NSSF Payable', type: AccountType.LIABILITY, subType: AccountSubType.NSSF_LIABILITY },
  { code: '2320', name: 'SHIF/SHA Payable', type: AccountType.LIABILITY, subType: AccountSubType.SHIF_LIABILITY },
  { code: '2330', name: 'Housing Levy Payable', type: AccountType.LIABILITY, subType: AccountSubType.HOUSING_LEVY_LIABILITY },
  { code: '2340', name: 'Withholding Tax Payable', type: AccountType.LIABILITY, subType: AccountSubType.CURRENT_LIABILITY },
  { code: '2400', name: 'Accrued Liabilities', type: AccountType.LIABILITY, subType: AccountSubType.CURRENT_LIABILITY },
  { code: '2500', name: 'Short-term Loans', type: AccountType.LIABILITY, subType: AccountSubType.CURRENT_LIABILITY },
  { code: '2900', name: 'Non-Current Liabilities', type: AccountType.LIABILITY, subType: AccountSubType.NON_CURRENT_LIABILITY },
  { code: '2910', name: 'Long-term Loans', type: AccountType.LIABILITY, subType: AccountSubType.NON_CURRENT_LIABILITY },

  // ── EQUITY ──────────────────────────────────
  { code: '3000', name: 'Equity', type: AccountType.EQUITY, subType: AccountSubType.SHARE_CAPITAL },
  { code: '3100', name: 'Share Capital', type: AccountType.EQUITY, subType: AccountSubType.SHARE_CAPITAL },
  { code: '3200', name: 'Retained Earnings', type: AccountType.EQUITY, subType: AccountSubType.RETAINED_EARNINGS },
  { code: '3300', name: 'Current Year Profit/Loss', type: AccountType.EQUITY, subType: AccountSubType.RETAINED_EARNINGS },

  // ── INCOME ──────────────────────────────────
  { code: '4000', name: 'Revenue', type: AccountType.INCOME, subType: AccountSubType.REVENUE },
  { code: '4100', name: 'Sales Revenue', type: AccountType.INCOME, subType: AccountSubType.REVENUE },
  { code: '4200', name: 'Service Revenue', type: AccountType.INCOME, subType: AccountSubType.REVENUE },
  { code: '4300', name: 'Other Income', type: AccountType.INCOME, subType: AccountSubType.OTHER_INCOME },
  { code: '4310', name: 'Interest Income', type: AccountType.INCOME, subType: AccountSubType.OTHER_INCOME },
  { code: '4320', name: 'Gains on Disposal', type: AccountType.INCOME, subType: AccountSubType.OTHER_INCOME },

  // ── COST OF SALES ────────────────────────────
  { code: '5000', name: 'Cost of Sales', type: AccountType.COST_OF_SALES, subType: AccountSubType.DIRECT_COST },
  { code: '5100', name: 'Purchases / Cost of Goods', type: AccountType.COST_OF_SALES, subType: AccountSubType.DIRECT_COST },
  { code: '5200', name: 'Direct Labour', type: AccountType.COST_OF_SALES, subType: AccountSubType.DIRECT_COST },
  { code: '5300', name: 'Direct Expenses', type: AccountType.COST_OF_SALES, subType: AccountSubType.DIRECT_COST },

  // ── EXPENSES ────────────────────────────────
  { code: '6000', name: 'Staff Costs', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6010', name: 'Salaries and Wages', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6020', name: 'Employer NSSF', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6030', name: 'Employer SHIF/SHA', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6040', name: 'Housing Levy (Employer)', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6050', name: 'Staff Benefits', type: AccountType.EXPENSE, subType: AccountSubType.STAFF_COST },
  { code: '6100', name: 'Rent and Rates', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6110', name: 'Electricity and Water', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6120', name: 'Telephone and Internet', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6130', name: 'Office Supplies', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6140', name: 'Repairs and Maintenance', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6150', name: 'Transport and Travel', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6160', name: 'Marketing and Advertising', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6170', name: 'Professional Fees', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6180', name: 'Insurance', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6190', name: 'Bank Charges', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6200', name: 'M-Pesa Charges', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6210', name: 'Postage and Courier', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6220', name: 'Licence and Permits', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6230', name: 'Printing and Stationery', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6240', name: 'Cleaning and Security', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6250', name: 'Miscellaneous Expenses', type: AccountType.EXPENSE, subType: AccountSubType.OPERATING_EXPENSE },
  { code: '6300', name: 'Depreciation', type: AccountType.EXPENSE, subType: AccountSubType.DEPRECIATION },
  { code: '6400', name: 'Finance Costs', type: AccountType.EXPENSE, subType: AccountSubType.FINANCE_COST },
  { code: '6410', name: 'Interest Expense', type: AccountType.EXPENSE, subType: AccountSubType.FINANCE_COST },
  { code: '6500', name: 'Tax Expense', type: AccountType.EXPENSE, subType: AccountSubType.TAX_EXPENSE },
  { code: '9000', name: 'Suspense Account', type: AccountType.ASSET, subType: AccountSubType.CURRENT_ASSET },
];

async function main() {
  console.warn('Seeding Kenya SME chart of accounts template...');

  // The seed creates template accounts at firm level (no companyId)
  // that are cloned to each new company. For now we just log them.
  console.warn(`Template has ${KENYA_SME_ACCOUNTS.length} accounts ready for deployment.`);
  console.warn('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { KENYA_SME_ACCOUNTS };
