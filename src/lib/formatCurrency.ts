export function formatCurrency(amount: number,currency: string='GTQ',locale: string='es-GT'): string {
    return new Intl.NumberFormat(locale,{
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}