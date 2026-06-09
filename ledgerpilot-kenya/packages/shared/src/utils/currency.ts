export function formatKES(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return 'KES 0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `KES ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'KES',
): string {
  if (amount === null || amount === undefined) return `${currency} 0.00`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${currency} ${num.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}
