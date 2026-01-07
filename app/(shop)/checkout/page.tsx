'use client';

import { useCartApi, useEcommerceApi, useOrderApi } from '@/components/providers/ecommerce-api-provider';
import { useCart } from '@/components/ecomerce/cart/cart-context';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Price from '@/components/ecomerce/price';
import Image from 'next/image';


function CheckoutContent() {
  const { cart, isLoading: isCartLoading, refreshCart } = useCart();
  const { removeItem } = useCartApi();
  const { user } = useAuth();
  const { createOrder } = useOrderApi();
  const router = useRouter();
  const isAuthenticated = !!user;
  const [isProcessing, setIsProcessing] = useState(false);

  // No filter needed - always use full cart
  const filteredItems = cart?.lines || [];
  
  const totalPrice = filteredItems.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thanh toán');
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || filteredItems.length === 0) return;

    if (!user?.email) {
        toast.error("Vui lòng cập nhật email trước khi thanh toán");
        return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const address = formData.get('address') as string;
      const city = formData.get('city') as string || 'Hồ Chí Minh'; // Mock city

      // 1. Create Order via API
      await createOrder({
          email: user.email,
          shippingAddress: {
              address1: address,
              city: city,
              country: 'Vietnam'
          }
      });
      
      // 2. Cleanup Cart
      // If we checked out all items, clear the cart ID to start fresh
      if (filteredItems.length === cart.lines.length) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ecommerce_cart_id');
        }
      } else {
        // Otherwise remove only selected items
        await Promise.all(filteredItems.map(item => item.id && removeItem(item.id)));
      }
      
      await refreshCart();
      
      toast.success('Đặt hàng thành công!');
      router.push('/'); 
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.lines.length && filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Thanh toán giỏ hàng</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-4 text-xl font-semibold">Thông tin giao hàng</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Họ tên</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                  defaultValue={user?.fullName || ''}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                  defaultValue={user?.email || ''}
                  readOnly
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  placeholder="Số nhà, tên đường..."
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black">
            <h2 className="mb-4 text-xl font-semibold">Đơn hàng ({filteredItems.length} món)</h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex py-4">
                  <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700">
                    <Image
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium">
                        <h3>{item.merchandise.product.title}</h3>
                        <Price
                          amount={item.cost.totalAmount.amount}
                          currencyCode={item.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-neutral-500">SL: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4 border-t border-neutral-200 pt-6 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <p className="text-sm">Tạm tính</p>
                <Price
                  amount={totalPrice.toString()}
                  currencyCode={cart?.cost.totalAmount.currencyCode || 'VND'}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Thuế</p>
                <Price
                  amount={'0'} 
                  currencyCode={cart?.cost.totalAmount.currencyCode || 'VND'}
                />
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <p className="text-base font-medium">Tổng cộng</p>
                <Price
                  className="text-base font-medium"
                  amount={totalPrice.toString()}
                  currencyCode={cart?.cost.totalAmount.currencyCode || 'VND'}
                />
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
            >
              {isProcessing ? 'Đang xử lý...' : `Thanh toán ${totalPrice.toLocaleString('vi-VN')} ${cart?.cost.totalAmount.currencyCode || 'VND'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
       <div className="flex h-[50vh] w-full items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
       </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
