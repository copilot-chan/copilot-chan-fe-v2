'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CollectionForm } from '@/components/admin/collections/collection-form';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Collection } from '@/lib/ecomerce/foodshop/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCollectionPage() {
  const params = useParams();
  const id = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const client = createAdminApiClient();
        const data = await client.getCollection(id);
        setCollection(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [id]);

  if (loading) {
      return <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[300px] w-full max-w-2xl" />
      </div>;
  }

  if (!collection) return <div>Collection not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
      <CollectionForm initialData={collection} id={id} />
    </div>
  );
}
