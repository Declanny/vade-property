/**
 * Utility functions for formatting values
 */

/**
 * Format a number or string as Nigerian Naira currency
 */
export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseInt(amount) || 0 : amount;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(numAmount);
}

/**
 * Format a date string in Nigerian locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date string with weekday (for shortlet bookings)
 */
export function formatDateWithWeekday(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date string in short format
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG');
}
