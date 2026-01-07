'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Grid from '@/components/ecomerce/grid';
import ProductGridItems from '@/components/ecomerce/layout/product-grid-items';
import { defaultSort, sorting } from '@/lib/ecomerce/constants';
import { useProducts, useCollections } from '@/components/providers/ecommerce-api-provider';
import type { Product, Collection } from '@/lib/ecomerce/foodshop/types';

function CollectionSkeleton() {
  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-square animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
      ))}
    </Grid>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { getProducts } = useProducts();
  const { getCollection } = useCollections();
  
  const collectionHandle = params.collection as string;
  const sort = searchParams.get('sort') || undefined;
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  
  const [collection, setCollection] = useState<Collection | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    Promise.all([
      getCollection(collectionHandle),
      getProducts({ collection: collectionHandle, sortKey, reverse }),
    ])
      .then(([col, prods]) => {
        setCollection(col);
        setProducts(prods);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [collectionHandle, sortKey, reverse, getCollection, getProducts]);

  if (isLoading) {
    return <CollectionSkeleton />;
  }

  return (
    <>
      {collection && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.description && (
            <p className="mt-4 text-neutral-500 dark:text-neutral-400">{collection.description}</p>
          )}
        </div>
      )}
      {products.length === 0 ? (
        <p className="py-3 text-lg text-neutral-500">Không tìm thấy sản phẩm trong danh mục này</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </>
  );
}
