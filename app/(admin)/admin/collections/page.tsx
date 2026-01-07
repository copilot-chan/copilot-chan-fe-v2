'use client';

import Link from 'next/link';
import { useAdminCollections } from '@/hooks/admin/use-admin-collections';
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

export default function CollectionsPage() {
  const { collections, loading, deleteCollection } = useAdminCollections();

  const handleDelete = async (id: string) => {
      if (confirm('Are you sure you want to delete this collection?')) {
          await deleteCollection(id);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
          <p className="text-muted-foreground">Manage your product collections (categories)</p>
        </div>
        <Button asChild>
            <Link href="/admin/collections/new">
                <Plus className="mr-2 h-4 w-4" /> Add Collection
            </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Handle</TableHead>
              <TableHead className="hidden md:table-cell">Product Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-[50px]" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : collections.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                        No collections found.
                    </TableCell>
                </TableRow>
            ) : (
                collections.map((collection) => (
                    <TableRow key={collection.id}>
                        <TableCell className="font-medium">
                            {collection.title}
                        </TableCell>
                        <TableCell>
                           {collection.handle}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            - {/* Count calculation needed later */}
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
                                    {/* NOTE: Assuming ID is available, but mock might use handle as ID or auto-gen ID. 
                                        In db.json collections just have handle. 
                                        Let's assume handle IS the ID for edit url if id is missing */}
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/collections/${collection.handle}`} className="cursor-pointer">
                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(collection.id)} className="text-red-600 cursor-pointer">
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
