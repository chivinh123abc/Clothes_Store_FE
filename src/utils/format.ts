/**
 * Utility to format product prices dynamically based on the current language context.
 * - 'en' -> Formatted in USD ($150.00)
 * - 'vi' -> Converted to VND using 25,000 rate and formatted in VND (3.750.000 ₫)
 */
export const formatPrice = (priceUSD: number, language: string): string => {
  const safePrice = priceUSD || 0
  if (language === 'vi') {
    const priceVND = Math.round(safePrice * 25000)
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(priceVND)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(safePrice)
}
