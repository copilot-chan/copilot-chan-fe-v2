'use client';

import Link from 'next/link';
import { useAdminProducts } from '@/hooks/admin/use-admin-products';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Pencil, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { products, loading, deleteProduct } = useAdminProducts();

  const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this product?')) {
          try {
              await deleteProduct(id);
              toast.success('Product deleted successfully');
          } catch (error) {
              toast.error('Failed to delete product');
          }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your store products</p>
        </div>
        <Button asChild>
            <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Collection</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-12 w-12 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : products.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No products found.
                    </TableCell>
                </TableRow>
            ) : (
                products.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.featuredImage ? (
                                <img 
                                    src={product.featuredImage.url} 
                                    alt={product.title} 
                                    className="h-12 w-12 rounded object-cover border"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs">No Img</div>
                            )}
                        </TableCell>
                        <TableCell className="font-medium">
                            {product.title}
                        </TableCell>
                        <TableCell>
                           {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                        </TableCell>
                        <TableCell className="hidden md:table-cell capitalize">
                            <div className="flex flex-wrap gap-1">
                                {(product.collections && product.collections.length > 0) ? (
                                    product.collections.map(c => (
                                        <span key={c} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                                            {c.replace(/-/g, ' ')}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted-foreground text-xs italic">Uncategorized</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.id}`} className="cursor-pointer">
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600 cursor-pointer">
                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
