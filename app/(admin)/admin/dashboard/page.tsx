'use client';

import { useAdminStats } from '@/hooks/admin/use-admin-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { stats, loading, error } = useAdminStats();

  if (error) {
    return <div className="text-red-500">Error loading stats: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* REVENUE */}
        <StatCard
          title="Total Revenue"
          value={loading ? undefined : stats?.totalRevenue.amount}
          icon={DollarSign}
          description="Total revenue from all orders"
          loading={loading}
        />
        
        {/* ORDERS */}
        <StatCard
          title="Orders"
          value={loading ? undefined : stats?.totalOrders}
          icon={ShoppingBag}
          description="+12% from last month"
          loading={loading}
        />

        {/* PRODUCTS */}
        <StatCard
          title="Products"
          value={loading ? undefined : stats?.totalProducts}
          icon={Package}
          description="Active products in store"
          loading={loading}
        />

        {/* USERS */}
        <StatCard
          title="Users"
          value={loading ? undefined : stats?.totalUsers}
          icon={Users}
          description="Registered customers"
          loading={loading}
        />
      </div>

      {/* Placeholder for future charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Olivia Martin</p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
              {/* More items... */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sub-component for Cleaner Code
function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    loading 
}: { 
    title: string; 
    value?: string | number; 
    icon: any; 
    description?: string; 
    loading: boolean;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-24 mb-1" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
