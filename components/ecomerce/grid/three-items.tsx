'use client';

import { useEffect, useState } from 'react';
import { GridTileImage } from '@/components/ecomerce/grid/tile';
import { useProducts } from '@/components/providers/ecommerce-api-provider';
import type { Product } from '@/lib/ecomerce/foodshop/types';
import Link from 'next/link';

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage?.url}
          fill
          sizes={size === 'full' ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
          priority={priority}
          alt={item.title}
          label={{
            position: size === 'full' ? 'center' : 'bottom',
            title: item.title as string,
            amount: item.price.amount,
            currencyCode: item.price.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

function ThreeItemGridSkeleton() {
  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <div className="md:col-span-4 md:row-span-2 aspect-square animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="md:col-span-2 md:row-span-1 aspect-square animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      <div className="md:col-span-2 md:row-span-1 aspect-square animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
    </section>
  );
}

export function ThreeItemGrid() {
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts({ collection: 'hidden-homepage-featured-items', limit: 3 })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [getProducts]);

  if (isLoading) {
    return <ThreeItemGridSkeleton />;
  }

  if (!products[0] || !products[1] || !products[2]) {
    return null;
  }

  const [firstProduct, secondProduct, thirdProduct] = products;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
