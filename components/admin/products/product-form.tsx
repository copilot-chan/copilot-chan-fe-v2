'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Collection, Image as ProductImage } from '@/lib/ecomerce/foodshop/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { toast } from 'sonner';
import { X, Plus, Image as ImageIcon } from 'lucide-react';

import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { useAuth } from '@/components/providers/auth-provider';
import { useMemo } from 'react';

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const client = useMemo(() => createAdminApiClient({ token }), [token]);

  const [loading, setLoading] = useState(false);
  const [collectionOptions, setCollectionOptions] = useState<Option[]>([]);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    descriptionHtml: initialData?.descriptionHtml || '',
    handle: initialData?.handle || '',
    featuredImage: initialData?.featuredImage || { url: '', altText: '', width: 800, height: 600 },
    images: initialData?.images || [],
    price: initialData?.price || { amount: '0', currencyCode: 'VND' },
    originalPrice: initialData?.originalPrice || { amount: '0', currencyCode: 'VND' },
    collections: initialData?.collections || [],
    status: initialData?.status || 'active',
    vendor: initialData?.vendor || '',
    productType: initialData?.productType || '',
    tags: initialData?.tags || [],
  });

  useEffect(() => {
      const fetchCollections = async () => {
          if (!token) return;
          try {
              const collections = await client.getCollections();
              setCollectionOptions(collections.map(c => ({
                  label: c.title,
                  value: c.id // Use ID instead of handle
              })));
          } catch (error) {
              console.error("Failed to load collections", error);
          }
      };
      fetchCollections();
  }, [client, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: { amount: value, currencyCode: 'VND' }
      }));
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      toast.info('Uploading featured image...');
      const { url } = await client.uploadFile(file);
      setFormData(prev => ({
        ...prev,
        featuredImage: { ...prev.featuredImage!, url }
      }));
      toast.success('Featured image uploaded');
    } catch (error) {
      console.error('Upload failed', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      toast.info(`Uploading ${files.length} image(s)...`);
      
      const uploadPromises = Array.from(files).map(file => client.uploadFile(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages: ProductImage[] = results.map(res => ({
        url: res.url,
        altText: formData.title || 'Product image',
        width: 800,
        height: 600
      }));

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
      
      toast.success('Gallery updated');
    } catch (error) {
      console.error('Gallery upload failed', error);
      toast.error('Failed to upload some images');
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleCollectionsChange = (selected: string[]) => {
      setFormData(prev => ({ ...prev, collections: selected }));
  };

  const handleCreateCollection = async (title: string) => {
      const handle = title.toLowerCase().replace(/\s+/g, '-');
      
      try {
          toast.info(`Creating collection: ${title}...`);
          const newCollection = await client.createCollection({
              title,
              handle,
              description: '',
              seo: { title, description: '' },
              path: `/shop/search/${handle}`,
          } as any);
          
          toast.success(`Collection ${title} created`);

          // Use the real ID from user created collection
          const newOption = { label: newCollection.title, value: newCollection.id };
          setCollectionOptions(prev => [...prev, newOption]);
          handleCollectionsChange([...(formData.collections || []), newCollection.id]);
          
      } catch (error) {
           toast.error(`Failed to create collection ${title}`);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const commonData = {
            handle: formData.handle || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
            title: formData.title || '',
            description: formData.description || '',
            descriptionHtml: formData.descriptionHtml || '',
            status: formData.status as any,
            price: parseFloat(String(formData.price?.amount || '0')),
            originalPrice: formData.originalPrice?.amount ? parseFloat(String(formData.originalPrice.amount)) : 0,
            featuredImage: formData.featuredImage?.url || '',
            images: formData.images?.map(img => ({
                url: img.url,
                altText: img.altText || formData.title || 'Product image'
            })) || [],
            tags: formData.tags || [],
            collections: formData.collections || [],
            seo: formData.seo || { title: formData.title || '', description: formData.description || '' },
            vendor: formData.vendor || '',
            productType: formData.productType || '',
        };

        if (initialData) {
            await client.updateProduct(initialData.id, commonData);
            toast.success('Product updated');
        } else {
            await client.createProduct(commonData);
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
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
                    <Label htmlFor="description">Description (Plain text)</Label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="descriptionHtml">Description HTML</Label>
                    <textarea
                        id="descriptionHtml"
                        name="descriptionHtml"
                        value={formData.descriptionHtml}
                        onChange={handleChange}
                        placeholder="<p>Custom HTML content...</p>"
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg border space-y-6">
                 <div>
                    <h3 className="font-semibold mb-4">Media</h3>
                    
                    {/* Featured Image */}
                    <div className="space-y-4 mb-6 pt-4 border-t">
                        <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Featured Image</Label>
                        <div className="flex items-start gap-4">
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                {formData.featuredImage?.url ? (
                                    <>
                                        <img src={formData.featuredImage.url} alt="Featured" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, featuredImage: { ...prev.featuredImage!, url: '' } }))}
                                            className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input 
                                    id="featuredImageFile" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFeaturedImageUpload} 
                                    disabled={loading}
                                    className="max-w-[200px]"
                                />
                                <p className="text-[10px] text-muted-foreground">This image will be used for the product listing cards.</p>
                                <Input 
                                    name="featuredImageURL"
                                    value={formData.featuredImage?.url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: { ...prev.featuredImage!, url: e.target.value } }))}
                                    placeholder="Or paste URL here..."
                                    className="text-xs h-8"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="text-muted-foreground uppercase text-[10px] font-bold tracking-wider">Gallery Images</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {formData.images?.map((img, index) => (
                                <div key={index} className="relative group aspect-square border rounded-lg overflow-hidden bg-muted">
                                    <img src={img.url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeGalleryImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="aspect-square border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                <Input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleGalleryUpload}
                                    disabled={loading}
                                />
                                <Plus className="h-6 w-6 text-muted-foreground" />
                                <span className="text-[10px] mt-1 text-muted-foreground">Add images</span>
                            </label>
                        </div>
                    </div>
                 </div>
            </div>

             <div className="bg-card p-6 rounded-lg border space-y-4">
                <h3 className="font-semibold">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price (VND)</Label>
                        <Input 
                            id="price" 
                            name="price" 
                            type="number"
                            value={formData.price?.amount} 
                            onChange={handlePriceChange} 
                            placeholder="0" 
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                        <Input 
                            id="originalPrice" 
                            name="originalPrice" 
                            type="number"
                            value={formData.originalPrice?.amount || ''} 
                            onChange={handlePriceChange} 
                            placeholder="0" 
                        />
                    </div>
                </div>
             </div>
         </div>

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
                 <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label>Collections</Label>
                        <MultiSelect 
                            options={collectionOptions}
                            selected={formData.collections || []}
                            onChange={handleCollectionsChange}
                            placeholder="Select collections..."
                            onCreate={handleCreateCollection}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="vendor">Vendor</Label>
                        <Input 
                            id="vendor" 
                            name="vendor" 
                            value={formData.vendor} 
                            onChange={handleChange} 
                            placeholder="e.g. Acme Corp" 
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Input 
                            id="productType" 
                            name="productType" 
                            value={formData.productType} 
                            onChange={handleChange} 
                            placeholder="e.g. Electronics" 
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="handle">Handle</Label>
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
