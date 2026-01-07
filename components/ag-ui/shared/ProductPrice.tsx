import { Money } from '@/lib/ecomerce/foodshop/types';
import { cn } from '@/lib/utils';

interface ProductPriceProps {
  price: Money;
  originalPrice?: Money;
  className?: string;
  currencyCode?: string;
}

export function ProductPrice({
  price,
  originalPrice,
  className,
  currencyCode = 'VND', // Default fallback
}: ProductPriceProps) {
  // Helper to format currency
  const formatPrice = (amount: string, currency: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  // Convert string amount to number for comparison
  const isDiscounted =
    originalPrice &&
    parseFloat(originalPrice.amount) > parseFloat(price.amount);

  return (
    <div className={cn('flex flex-wrap items-baseline gap-1 sm:gap-2', className)}>
      <span className="font-semibold text-sm sm:text-base md:text-lg text-primary">
        {formatPrice(price.amount, price.currencyCode || currencyCode)}
      </span>
      {isDiscounted && (
        <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-through decoration-muted-foreground/50">
          {formatPrice(
            originalPrice.amount,
            originalPrice.currencyCode || currencyCode
          )}
        </span>
      )}
    </div>
  );
}
