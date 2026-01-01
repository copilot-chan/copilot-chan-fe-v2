'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Collection } from '@/lib/ecomerce/foodshop/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';

interface CollectionFormProps {
  initialData?: Collection;
  id?: string; // Optional ID if editing
}

export function CollectionForm({ initialData, id }: CollectionFormProps) {
  const router = useRouter();
  const client = createAdminApiClient();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Collection>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    handle: initialData?.handle || '',
    // path, seo, etc can be handled, simplified for now
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (id) {
            await client.updateCollection(id, formData);
            toast.success('Collection updated');
        } else {
             // Auto generate handle
             const submitData = {
                ...formData,
                handle: formData.handle || formData.title?.toLowerCase().replace(/\s+/g, '-') || 'new-collection',
                seo: { title: formData.title || '', description: formData.description || '' },
                updatedAt: new Date().toISOString(),
                // Add default properties if needed
                path: `/shop/search/${formData.handle || 'new'}`
            } as any;

            await client.createCollection(submitData);
            toast.success('Collection created');
        }
        router.push('/admin/collections');
        router.refresh(); 
    } catch (error) {
        toast.error('Something went wrong');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-card p-6 rounded-lg border">
      <div className="space-y-4">
        <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Collection Name" 
                required 
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="handle">Handle (Slug)</Label>
            <Input 
                id="handle" 
                name="handle" 
                value={formData.handle} 
                onChange={handleChange} 
                placeholder="collection-slug" 
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
            />
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
        >
            Cancel
        </Button>
        <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Collection' : 'Create Collection')}
        </Button>
      </div>
    </form>
  );
}
