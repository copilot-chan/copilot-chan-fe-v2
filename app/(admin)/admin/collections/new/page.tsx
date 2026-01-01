'use client';

import { CollectionForm } from '@/components/admin/collections/collection-form';

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create Collection</h1>
      <CollectionForm />
    </div>
  );
}
