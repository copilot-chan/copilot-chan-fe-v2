'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useProduct } from '@/components/ecomerce/product/product-context';
import { Product, ProductVariant } from '@/lib/ecomerce/foodshop/types';
import { useCart } from './cart-context';
import { useEcommerceApi } from '@/components/providers/ecommerce-api-provider';
import { useState } from 'react';
import { toast } from 'sonner';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isLoading,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
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

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Vui lòng chọn tùy chọn"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Thêm vào giỏ
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
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { isAuthenticated } = useEcommerceApi();
  const { state } = useProduct();
  const [isLoading, setIsLoading] = useState(false);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (!finalVariant) {
      toast.error('Vui lòng chọn tùy chọn sản phẩm');
      return;
    }

    setIsLoading(true);
    try {
      addCartItem(finalVariant, product);
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
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isLoading={isLoading}
      />
    </form>
  );
}
