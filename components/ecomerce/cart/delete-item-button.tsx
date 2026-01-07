'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import type { CartItem } from '@/lib/ecomerce/foodshop/types';
import { TrashIcon } from '@/components/ui/icons';
import { Trash } from 'lucide-react';

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
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full cursor-pointer hover:bg-red-500 hover:text-white transition-colors text-red-500 dark:text-black"
    >
      <Trash className="mx-[1px] h-4 w-4 dark:text-black" />
    </button>
  );
}
