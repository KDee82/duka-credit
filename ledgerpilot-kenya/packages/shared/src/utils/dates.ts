export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString('en-KE', { month: 'long' });
}

export function getPeriodLabel(year: number, month: number): string {
  return `${getMonthName(month)} ${year}`;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getObligationDueDate(year: number, month: number, dayOfNextMonth: number): Date {
  // Most KRA obligations are due on a specific day of the FOLLOWING month
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  return new Date(nextYear, nextMonth - 1, dayOfNextMonth);
}

export function isOverdue(dueDate: Date): boolean {
  return new Date() > dueDate;
}

export function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
