'use client';

import { useEffect, useState } from 'react';
import { createAdminApiClient } from '@/lib/ecomerce/foodshop/api/admin';
import { Order } from '@/lib/ecomerce/foodshop/types';
import { useAuth } from '@/components/providers/auth-provider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, CreditCard, Truck, RefreshCcw } from 'lucide-react';

const FINANCIAL_STATUS_LABELS: Record<string, { label: string, color: string }> = {
  pending: { label: 'Chờ thanh toán', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  paid: { label: 'Đã thanh toán', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const FULFILLMENT_STATUS_LABELS: Record<string, { label: string, color: string }> = {
  unfulfilled: { label: 'Đang xử lý', color: 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20' },
  fulfilled: { label: 'Đã giao', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const client = createAdminApiClient({ token });
      const data = await client.getOrders();
      // Sort by date descending
      setOrders(data.sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, type: 'financial' | 'fulfillment', value: string) => {
    if (!token) return;
    try {
      const client = createAdminApiClient({ token });
      const updateData = type === 'financial' 
        ? { financialStatus: value } 
        : { fulfillmentStatus: value };
      
      await client.updateOrder(orderId, updateData);
      toast.success('Cập nhật trạng thái thành công');
      fetchOrders(); // Refresh table
    } catch (error) {
      console.error(error);
      toast.error('Cập nhật trạng thái thất bại');
    }
  };

  useEffect(() => {
    if (token) {
        fetchOrders();
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <Button variant="outline" size="sm" onClick={() => fetchOrders()} disabled={loading}>
           <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
           Làm mới
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Mã đơn</TableHead>
              <TableHead>Email khách hàng</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Thanh toán</TableHead>
              <TableHead>Giao hàng</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[180px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Chưa có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const fin = FINANCIAL_STATUS_LABELS[order.financialStatus] || { label: order.financialStatus, color: '' };
                const ful = FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus] || { label: order.fulfillmentStatus, color: '' };

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                    </TableCell>
                    <TableCell>{order.email || order.shippingAddress.address1}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.currentTotalPrice.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={fin.color}>
                        {fin.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ful.color}>
                        {ful.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.processedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Trạng thái thanh toán</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'financial', 'paid')}>
                            <CreditCard className="mr-2 h-4 w-4 text-green-600" />
                            Đánh dấu Đã thanh toán
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'financial', 'refunded')}>
                            <RefreshCcw className="mr-2 h-4 w-4 text-red-600" />
                            Đánh dấu Đã hoàn tiền
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Trạng thái giao hàng</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'fulfillment', 'fulfilled')}>
                            <Truck className="mr-2 h-4 w-4 text-blue-600" />
                            Đánh dấu Đã giao
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'fulfillment', 'unfulfilled')}>
                            <Truck className="mr-2 h-4 w-4 text-neutral-600" />
                            Đánh dấu Đang xử lý
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
