'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Grid from '@/components/ecomerce/grid';
import ProductGridItems from '@/components/ecomerce/layout/product-grid-items';
import { defaultSort, sorting } from '@/lib/ecomerce/constants';
import { useProducts } from '@/components/providers/ecommerce-api-provider';
import type { Product } from '@/lib/ecomerce/foodshop/types';

function SearchSkeleton() {
  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      ))}
    </Grid>
  );
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sort = searchParams.get('sort') || undefined;
  const searchValue = searchParams.get('q') || undefined;
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  useEffect(() => {
    setIsLoading(true);
    getProducts({ sortKey, reverse, query: searchValue })
      .then(setProducts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [getProducts, sortKey, reverse, searchValue]);

  if (isLoading) {
    return <SearchSkeleton />;
  }

  const resultsText = products.length > 1 ? 'kết quả' : 'kết quả';
  console.log("products", products);
  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'Không tìm thấy sản phẩm phù hợp với '
            : `Hiển thị ${products.length} ${resultsText} cho `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        !searchValue && (
          <p className="py-3 text-lg text-neutral-500">Không có sản phẩm nào</p>
        )
      )}
    </>
  );
}
