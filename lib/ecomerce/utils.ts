/**
 * Ecommerce Utilities
 * Helper functions cho ecommerce module
 */

/**
 * Tạo URL với search params
 */
export function createUrl(pathname: string, params: URLSearchParams | Record<string, string>): string {
  const paramsString = params instanceof URLSearchParams 
    ? params.toString() 
    : new URLSearchParams(params).toString();
    
  const queryString = paramsString ? `?${paramsString}` : '';
  return `${pathname}${queryString}`;
}

/**
 * Format tiền tệ
 */
export function formatPrice(amount: string | number, currencyCode: string = 'VND'): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Ensure URL starts with /
 */
export function ensureStartsWith(str: string, prefix: string): string {
  return str.startsWith(prefix) ? str : `${prefix}${str}`;
}
