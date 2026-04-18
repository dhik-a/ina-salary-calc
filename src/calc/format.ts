export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseRupiahInput(input: string): number {
  const digits = input.replace(/\D/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
