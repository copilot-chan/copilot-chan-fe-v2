'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User as UserIcon, ShoppingBag, Settings, LogOut, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/ecomerce/foodshop/types';

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-8 text-center">Loading account info...</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>
      
      <Tabs defaultValue={defaultTab} className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <TabsList className="flex flex-col h-auto w-full justify-start space-y-2 bg-transparent p-0">
            <TabsTrigger 
              value="profile" 
              className="w-full justify-start px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 transition-colors"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Hồ sơ
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="w-full justify-start px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 transition-colors"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Đơn hàng
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="w-full justify-start px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 data-[state=active]:bg-neutral-100 dark:data-[state=active]:bg-neutral-800 transition-colors"
            >
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8 pt-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </aside>

        <main className="flex-1 min-h-[500px] border rounded-lg p-6">
          <TabsContent value="profile" className="m-0 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Hồ sơ cá nhân</h2>
              <p className="text-sm text-muted-foreground">Quản lý thông tin tài khoản của bạn.</p>
            </div>
            <ProfileForm user={user} />
          </TabsContent>

          <TabsContent value="orders" className="m-0 space-y-6">
             <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Lịch sử đơn hàng</h2>
              <p className="text-sm text-muted-foreground">Xem lại các đơn hàng đã đặt.</p>
            </div>
            <OrdersList />
          </TabsContent>

          <TabsContent value="settings" className="m-0 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Cài đặt</h2>
              <p className="text-sm text-muted-foreground">Tùy chỉnh trải nghiệm của bạn.</p>
            </div>
            <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
              Chưa có cài đặt nào.
            </div>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}

import { useOrderApi } from '@/components/providers/ecommerce-api-provider';
import { Order } from '@/lib/ecomerce/foodshop/types';
import Link from 'next/link';

// ============================================================================
// PROFILE FORM COMPONENT
// ============================================================================

function ProfileForm({ user }: { user: User }) {
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    avatar: user.avatar || '',
  });

  // Reset form when user changes
  useEffect(() => {
    setFormData({
      fullName: user.fullName || '',
      avatar: user.avatar || '',
    });
  }, [user]);

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName || '',
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      // Toast already shown in updateProfile
    } finally {
      setLoading(false);
    }
  };

  const avatarPlaceholder = formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || user.email)}&background=random`;

  return (
    <div className="grid gap-6 max-w-xl">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={avatarPlaceholder}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
          />
        </div>
        <div>
          <p className="font-medium">{user.fullName || 'Chưa cập nhật tên'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Họ và tên</label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            disabled={!isEditing}
            placeholder="Nhập họ và tên"
            className={!isEditing ? 'bg-neutral-50 dark:bg-neutral-900' : ''}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            value={user.email}
            disabled
            className="bg-neutral-50 dark:bg-neutral-900 text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Avatar URL</label>
          <Input
            value={formData.avatar}
            onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
            disabled={!isEditing}
            placeholder="https://example.com/avatar.jpg"
            className={!isEditing ? 'bg-neutral-50 dark:bg-neutral-900' : ''}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Sửa thông tin
          </Button>
        ) : (
          <>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
            <Button onClick={handleCancel} variant="outline" disabled={loading}>
              Hủy
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ORDERS LIST COMPONENT
// ============================================================================

function OrdersList() {
    const { listOrders } = useOrderApi();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        listOrders()
            .then(setOrders)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [listOrders]);

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Đang tải đơn hàng...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="p-8 text-center border border-dashed rounded-lg text-muted-foreground">
                Bạn chưa có đơn hàng nào. <Link href="/" className="text-blue-600 underline">Mua sắm ngay</Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <p className="font-semibold text-sm">Đơn hàng #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.processedAt).toLocaleDateString('vi-VN')} {new Date(order.processedAt).toLocaleTimeString('vi-VN')}</p>
                     </div>
                     <div className="flex flex-col md:items-end gap-1">
                        <span className="font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.currentTotalPrice.amount))}
                        </span>
                        <div className="flex gap-2">
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                                order.fulfillmentStatus === 'fulfilled' 
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' 
                                    : 'bg-neutral-50 text-muted-foreground dark:bg-neutral-800'
                            }`}>
                                {order.fulfillmentStatus === 'fulfilled' ? 'Đã giao' : 'Đang xử lý'}
                            </span>
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                                order.financialStatus === 'paid' 
                                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20' 
                                    : order.financialStatus === 'refunded'
                                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                        : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20'
                            }`}>
                                {order.financialStatus === 'paid' ? 'Đã thanh toán' : 
                                 order.financialStatus === 'refunded' ? 'Đã hoàn tiền' : 'Chờ thanh toán'}
                            </span>
                        </div>
                     </div>
                </div>
            ))}
        </div>
    );
}
