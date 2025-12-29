'use client';

import { Suspense, useCallback, useState } from 'react';
import { useMemories, useDeleteMemory } from '@/hooks/use-memory';
import { useAuth } from '@/components/providers/auth-provider';
import { toast } from 'sonner'; // or your toast library
import { Trash2, RefreshCw, AlertCircle, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function MemoryList() {
    const { token } = useAuth();
    console.log(token);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const {
        memories,
        total,
        error,
        isLoading,
        isLoadingMore,
        isReachingEnd,
        setSize,
        mutate,
    } = useMemories(token);

    const { deleteMemory, isDeleting } = useDeleteMemory(token);

    // Search filter
    const filteredMemories = memories.filter((memory) =>
        memory.memory.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle delete với toast
    const handleDelete = useCallback(
        async (memoryId: string) => {
            const deletePromise = async () => {
                // Optimistic update
                mutate((data) => {
                    if (!data) return data;
                    return data.map((page) => ({
                        ...page,
                        memories: page.results.filter((m) => m.id !== memoryId),
                        total: page.count - 1,
                    }));
                }, false);

                try {
                    await deleteMemory(memoryId);
                    // Revalidate sau khi delete thành công
                    await mutate();
                } catch (err) {
                    // Rollback nếu lỗi
                    await mutate();
                    throw err;
                }
            };

            toast.promise(deletePromise(), {
                loading: 'Deleting memory...',
                success: 'Memory deleted successfully',
                error: (err) => err.message || 'Failed to delete memory',
            });

            setDeleteId(null);
        },
        [deleteMemory, mutate]
    );

    // Load more
    const loadMore = useCallback(() => {
        setSize((size) => size + 1);
    }, [setSize]);

    // Error state
    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error.message}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => mutate()}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="pt-6">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Empty state
    if (memories.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6 text-center py-12">
                    <p className="text-muted-foreground">No memories found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Your conversation memories will appear here
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search memories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        {filteredMemories.length} of {total} memories
                    </span>
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                        >
                            Clear search
                        </Button>
                    )}
                </div>

                {/* Memory list */}
                <div className="space-y-3">
                    {filteredMemories.map((memory) => (
                        <Card
                            key={memory.id}
                            className="group hover:bg-muted/50 transition-colors"
                        >
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base break-words">
                                            {memory.memory}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(
                                                memory.created_at
                                            ).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        onClick={() => setDeleteId(memory.id)}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load more */}
                {!isReachingEnd && (
                    <div className="flex justify-center pt-4">
                        <Button
                            variant="outline"
                            onClick={loadMore}
                            disabled={isLoadingMore}
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Load more'
                            )}
                        </Button>
                    </div>
                )}

                {isReachingEnd && memories.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground pt-4">
                        No more memories to load
                    </p>
                )}
            </div>

            {/* Delete confirmation dialog */}
            <AlertDialog
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Memory</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this memory? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Main component với Suspense
export function MemorySettings() {
    return (
        <div className="space-y-6">
            <Suspense
                fallback={
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="pt-6">
                                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                }
            >
                <MemoryList />
            </Suspense>
        </div>
    );
}
