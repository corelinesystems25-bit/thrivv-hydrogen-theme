export function formatPrice(amount: number, currencyCode = 'USD') {
  if (Number.isNaN(amount)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function isFutureDate(value: string) {
  const date = new Date(value);
  return date.getTime() > Date.now();
}
