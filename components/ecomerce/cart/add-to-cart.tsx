'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { useCart } from './cart-context';
import { useEcommerceApi } from '@/components/providers/ecommerce-api-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

function SubmitButton({
  availableForSale,
  isLoading,
}: {
  availableForSale: boolean;
  isLoading?: boolean;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white transition-all';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Hết hàng
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Thêm vào giỏ hàng"
      disabled={isLoading}
      className={clsx(buttonClasses, {
        'hover:opacity-90': !isLoading,
        [disabledClasses]: isLoading,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { status } = product;
  const { addCartItem } = useCart();
  const { isAuthenticated } = useEcommerceApi();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng', {
        action: {
          label: 'Đăng nhập',
          onClick: () => router.push(`/login?redirect=${pathname}`)
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      addCartItem(product);
      toast.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddToCart}>
      <SubmitButton
        availableForSale={status === 'active'}
        isLoading={isLoading}
      />
    </form>
  );
}
