'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant, Collection } from '@/lib/ecomerce/foodshop/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const client = createAdminApiClient();

  const [loading, setLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState<Option[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    handle: initialData?.handle || '',
    featuredImage: initialData?.featuredImage || { url: '', altText: '', width: 800, height: 600 },
    priceRange: initialData?.priceRange || {
        minVariantPrice: { amount: '0', currencyCode: 'VND' },
        maxVariantPrice: { amount: '0', currencyCode: 'VND' }
    },
    // Safe fallback for new fields
    collections: initialData?.collections || [],
    status: initialData?.status || 'active',
  });

  useEffect(() => {
      // Fetch collections for MultiSelect options
      const fetchCollections = async () => {
          try {
              const collections = await client.getCollections();
              setCollectionOptions(collections.map(c => ({
                  label: c.title,
                  value: c.handle // Using handle as value reference
              })));
          } catch (error) {
              console.error("Failed to load collections", error);
          }
      };
      fetchCollections();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const price = e.target.value;
      setFormData(prev => ({
          ...prev,
          priceRange: {
              minVariantPrice: { amount: price, currencyCode: 'VND' },
              maxVariantPrice: { amount: price, currencyCode: 'VND' }
          }
      }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      setFormData(prev => ({
          ...prev,
          featuredImage: { ...prev.featuredImage!, url } 
      }));
  };

  const handleCollectionsChange = (selected: string[]) => {
      setFormData(prev => ({ ...prev, collections: selected }));
  };

  const handleCreateCollection = async (title: string) => {
      const handle = title.toLowerCase().replace(/\s+/g, '-');
      // Optimistic update
      const newOption = { label: title, value: handle };
      setCollectionOptions(prev => [...prev, newOption]);
      handleCollectionsChange([...(formData.collections || []), handle]);
      
      try {
          toast.info(`Creating collection: ${title}...`);
          await client.createCollection({
              title,
              handle,
              description: '',
              seo: { title, description: '' },
              path: `/shop/search/${handle}`,
              // updatedAt is added by client/api usually
          } as any);
          toast.success(`Collection ${title} created`);
      } catch (error) {
           toast.error(`Failed to create collection ${title}`);
           // Revert?
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (initialData) {
            await client.updateProduct(initialData.id, formData);
            toast.success('Product updated');
        } else {
            // New Product
            const submitData = {
                ...formData,
                handle: formData.handle || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
                options: [], 
                variants: [], 
                images: formData.featuredImage ? [formData.featuredImage] : [],
                seo: { title: formData.title || '', description: formData.description || '' },
                tags: []
            } as any;

            await client.createProduct(submitData);
            toast.success('Product created');
        }
        router.push('/admin/products');
        router.refresh(); 
    } catch (error) {
        toast.error('Something went wrong');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
         {/* Method 1: Left Main Content */}
         <div className="md:col-span-2 space-y-8">
            <div className="bg-card p-6 rounded-lg border space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                        id="title" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        placeholder="Product Name" 
                        required 
                    />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border space-y-4">
                 <h3 className="font-semibold">Media</h3>
                 <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input 
                        id="image" 
                        name="image" 
                        value={formData.featuredImage?.url} 
                        onChange={handleImageChange} 
                        placeholder="https://..." 
                    />
                    {formData.featuredImage?.url && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            <img src={formData.featuredImage.url} alt="Preview" className="h-40 w-auto object-cover rounded border" />
                        </div>
                    )}
                </div>
            </div>

             <div className="bg-card p-6 rounded-lg border space-y-4">
                <h3 className="font-semibold">Pricing</h3>
                <div className="grid gap-2">
                    <Label htmlFor="price">Price (VND)</Label>
                    <Input 
                        id="price" 
                        name="price" 
                        type="number"
                        value={formData.priceRange?.minVariantPrice.amount} 
                        onChange={handlePriceChange} 
                        placeholder="0" 
                        required 
                    />
                </div>
             </div>
             
             
             {/* Inventory section removed per user request */}
         </div>

         {/* Method 2: Right Sidebar */}
         <div className="space-y-8">
             <div className="bg-card p-6 rounded-lg border space-y-4">
                <h3 className="font-semibold">Status</h3>
                <select 
                    name="status" 
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
             </div>

             <div className="bg-card p-6 rounded-lg border space-y-4">
                <h3 className="font-semibold">Product Organization</h3>
                 <div className="grid gap-2">
                    <Label>Collections</Label>
                    <MultiSelect 
                        options={collectionOptions}
                        selected={formData.collections || []}
                        onChange={handleCollectionsChange}
                        placeholder="Select collections..."
                        onCreate={handleCreateCollection}
                    />
                     <p className="text-xs text-muted-foreground">
                        Add this product to a collection so it's easy to find in your store.
                    </p>
                </div>
                
                 <div className="grid gap-2">
                     <Label>Handle</Label>
                      <Input 
                        id="handle" 
                        name="handle" 
                        value={formData.handle} 
                        onChange={handleChange} 
                        placeholder="product-slug" 
                    />
                 </div>
             </div>
         </div>
         
      </div>

      <div className="flex gap-4 justify-end border-t pt-4">
        <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
        >
            Cancel
        </Button>
        <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (initialData ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
}
