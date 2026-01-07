import React from 'react';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminGuard } from '@/components/admin/admin-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/20">
        <AdminSidebar />
        
        <main className="flex-1 md:overflow-y-auto h-screen">
          <div className="container mx-auto p-6 md:p-8 max-w-7xl">
              {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
