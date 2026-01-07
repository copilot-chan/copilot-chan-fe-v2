'use client';

import { useState } from 'react';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { useCart } from '@/components/ecomerce/cart/cart-context';
import { useEcommerceApi } from '@/components/providers/ecommerce-api-provider';
import { Button, ButtonProps } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  quantity?: number;
  showIcon?: boolean;
  minimal?: boolean; // If true, only shows icon
}

export function AddToCartButton({
  product,
  quantity = 1,
  showIcon = true,
  minimal = false,
  className,
  children,
  ...props
}: AddToCartButtonProps) {
  const { addCartItem } = useCart();
  const { isAuthenticated } = useEcommerceApi();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent parent clicks (e.g., if card is clickable)

    if (product.status !== 'active') return;

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng', {
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push(`/login?redirect=${pathname}`),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      // Logic from similar component suggests addCartItem doesn't need await if it's sync context update,
      // but usually API calls might happen or we want to simulate delay.
      await addCartItem(product); 
      toast.success(`Đã thêm ${product.title} vào giỏ`, {
        position: 'bottom-center'
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || product.status !== 'active';

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isDisabled}
      size={minimal ? 'icon' : props.size || 'sm'}
      className={cn('text-xs sm:text-sm h-7 sm:h-8 md:h-9 px-2 sm:px-3', className, minimal && 'rounded-full h-6 w-6 sm:h-7 sm:w-7')}
      {...props}
      aria-label={isDisabled?'Sản phẩm không còn được bán' : 'Thêm vào giỏ'}
      
    >
      {isLoading ? (
        <Loader2 className={cn("animate-spin h-3 w-3 sm:h-4 sm:w-4", !minimal && "mr-1 sm:mr-2")} />
      ) : showIcon ? (
        <ShoppingCart className={cn("h-3 w-3 sm:h-4 sm:w-4", !minimal && children && "mr-1 sm:mr-2")} />
      ) : null}
      
      {!minimal && (children || (isLoading ? 'Đang xử lý...': isDisabled?'Hết hàng' : 'Thêm giỏ'))}
    </Button >
  );
}
