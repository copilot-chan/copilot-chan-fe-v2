import React from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add Auth check here (Middleware reference)
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      
      <main className="flex-1 md:overflow-y-auto h-screen">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
            {children}
        </div>
      </main>
    </div>
  );
}
