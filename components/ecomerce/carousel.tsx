'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { useProducts } from '@/components/providers/ecommerce-api-provider';
import type { Product } from '@/lib/ecomerce/foodshop/types';

function CarouselSkeleton() {
  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <div className="flex gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none animate-pulse rounded-lg bg-neutral-200 md:w-1/3 dark:bg-neutral-800"
          />
        ))}
      </div>
    </div>
  );
}

export function Carousel() {
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts({ collection: 'hidden-homepage-carousel', limit: 10 })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [getProducts]);

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (!products?.length) return null;

  // Duplicate products for infinite scroll effect
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link href={`/product/${product.handle}`} className="relative h-full w-full">
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
