'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CartItem } from '@/lib/ecomerce/foodshop/types';

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, type: 'delete') => void;
}) {
  const handleDelete = () => {
    optimisticUpdate(item.merchandise.id, 'delete');
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Remove cart item"
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500 hover:bg-neutral-600 transition-colors"
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  );
}
