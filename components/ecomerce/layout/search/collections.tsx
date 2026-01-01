'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useCollections } from '@/components/providers/ecommerce-api-provider';
import FilterList from './filter';
import type { Collection } from '@/lib/ecomerce/foodshop/types';

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded-sm';
const activeAndTitles = 'bg-neutral-800 dark:bg-neutral-300';
const items = 'bg-neutral-400 dark:bg-neutral-700';

function CollectionsSkeleton() {
  return (
    <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
      <div className={clsx(skeleton, activeAndTitles)} />
      <div className={clsx(skeleton, activeAndTitles)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
      <div className={clsx(skeleton, items)} />
    </div>
  );
}

export default function Collections() {
  const { getCollections } = useCollections();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCollections()
      .then(setCollections)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [getCollections]);

  if (isLoading) {
    return <CollectionsSkeleton />;
  }

  return <FilterList list={collections} title="Danh mục" />;
}
