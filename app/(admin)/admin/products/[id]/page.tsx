'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/products/product-form';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Product } from '@/lib/ecomerce/foodshop/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const client = createAdminApiClient();
        const data = await client.getProduct(id);
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
      return <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[500px] w-full max-w-2xl" />
      </div>;
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  );
}
