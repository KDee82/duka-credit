// Kenya-specific constants — updated when KRA rules change

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
  'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
  'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
] as const;

// VAT rate (16% standard as at 2026)
export const VAT_RATE = 0.16;

// Affordable Housing Levy: 1.5% of gross pay (employer + employee each)
export const HOUSING_LEVY_RATE = 0.015;

// NSSF Tier 1 and Tier 2 (as per NSSF Act 2013, subject to changes)
export const NSSF_TIER1_LIMIT = 7000;   // KES
export const NSSF_TIER1_RATE = 0.06;
export const NSSF_TIER2_LIMIT = 36000;  // KES upper earnings limit
export const NSSF_TIER2_RATE = 0.06;

// SHIF rate: 2.75% of gross pay (no cap as at 2026)
export const SHIF_RATE = 0.0275;

// Personal relief (KES per month)
export const PAYE_PERSONAL_RELIEF = 2400;

// PAYE bands (monthly — KES, as at 2026)
export const PAYE_BANDS = [
  { min: 0,      max: 24000,  rate: 0.10 },
  { min: 24001,  max: 32333,  rate: 0.25 },
  { min: 32334,  max: 500000, rate: 0.30 },
  { min: 500001, max: 800000, rate: 0.325 },
  { min: 800001, max: Infinity, rate: 0.35 },
] as const;

// WHT rates for common payment types
export const WHT_RATES = {
  PROFESSIONAL_FEES_RESIDENT: 0.05,
  PROFESSIONAL_FEES_NON_RESIDENT: 0.20,
  RENT_RESIDENT: 0.075,
  RENT_NON_RESIDENT: 0.30,
  DIVIDENDS_RESIDENT: 0.05,
  DIVIDENDS_NON_RESIDENT: 0.10,
  INTEREST_RESIDENT: 0.15,
  MANAGEMENT_FEES_RESIDENT: 0.05,
} as const;

// Tax due dates (day of month after period end)
export const TAX_DUE_DATES = {
  VAT: 20,           // 20th of month following the tax period
  PAYE: 9,           // 9th of following month
  NSSF: 9,           // 9th of following month
  SHIF: 9,           // 9th of following month
  HOUSING_LEVY: 9,   // 9th of following month
  WHT: 20,           // 20th of month following deduction
  TURNOVER_TAX: 20,  // 20th of month following quarter end
  INSTALMENT_TAX: [4, 6, 9, 12], // months: April, June, September, December
} as const;

export const MPESA_CHARGE_NARRATIONS = [
  'mpesa charges',
  'transaction cost',
  'service fee',
  'mobile money charges',
] as const;

export const COMMON_BANK_RULE_PATTERNS: Array<{ pattern: string; accountCode: string; label: string }> = [
  { pattern: 'safaricom post pay',  accountCode: '6120', label: 'Telephone expense' },
  { pattern: 'kplc',                accountCode: '6110', label: 'Electricity' },
  { pattern: 'nairobi water',       accountCode: '6110', label: 'Water' },
  { pattern: 'rent',                accountCode: '6100', label: 'Rent expense' },
  { pattern: 'paye',                accountCode: '2300', label: 'PAYE payable' },
  { pattern: 'nssf',                accountCode: '2310', label: 'NSSF payable' },
  { pattern: 'sha',                 accountCode: '2320', label: 'SHIF/SHA payable' },
  { pattern: 'shif',                accountCode: '2320', label: 'SHIF/SHA payable' },
  { pattern: 'housing levy',        accountCode: '2330', label: 'Housing levy payable' },
  { pattern: 'mpesa charges',       accountCode: '6200', label: 'M-Pesa charges' },
  { pattern: 'bank charges',        accountCode: '6190', label: 'Bank charges' },
  { pattern: 'insurance',           accountCode: '6180', label: 'Insurance expense' },
];
