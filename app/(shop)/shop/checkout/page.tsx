'use client';

import { useCartApi } from '@/components/providers/ecommerce-api-provider';
import { useCart } from '@/components/ecomerce/cart/cart-context';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Price from '@/components/ecomerce/price';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { removeItem } = useCartApi();
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  // Get selected line IDs from URL
  const selectedLineIds = useMemo(() => {
    const linesParam = searchParams.get('lines');
    if (!linesParam) return [];
    return linesParam.split(',');
  }, [searchParams]);

  // Filter items to checkout
  const checkoutItems = useMemo(() => {
    if (!cart) return [];
    if (selectedLineIds.length === 0) return cart.lines; // Fallback to all if none selected (shouldn't happen with new UI)
    return cart.lines.filter(item => item.id && selectedLineIds.includes(item.id));
  }, [cart, selectedLineIds]);

  // Calculate totals for checkout items
  const checkoutTotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + Number(item.cost.totalAmount.amount), 0);
  }, [checkoutItems]);

  useEffect(() => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thanh toán');
    }
  }, [user]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || checkoutItems.length === 0) return;

    setIsProcessing(true);
    try {
      // Mock API call to process order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove ONLY selected items after successful checkout
      await Promise.all(checkoutItems.map(item => item.id && removeItem(item.id)));
      
      await refreshCart();
      
      toast.success('Đặt hàng thành công!');
      router.push('/shop'); 
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thanh toán');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart?.lines.length && checkoutItems.length === 0) {
     // If cart is empty OR just no items selected (though if accessed via link, implies selection)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <button 
          onClick={() => router.push('/shop')}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Thanh Toán</h1>
      
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
                  required
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                  defaultValue={user?.displayName || ''}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                  defaultValue={user?.email || ''}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
                <input 
                  type="text" 
                  required
                  placeholder="Số nhà, tên đường..."
                  className="w-full rounded-md border border-neutral-300 p-2 dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Số điện thoại</label>
                <input 
                  type="tel" 
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
            <h2 className="mb-4 text-xl font-semibold">Đơn hàng ({checkoutItems.length} món)</h2>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {checkoutItems.map((item) => (
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
                      <p className="mt-1 text-sm text-neutral-500">{item.merchandise.title}</p>
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
                  amount={checkoutTotal.toString()}
                  currencyCode={cart?.cost.subtotalAmount.currencyCode || 'VND'}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Thuế</p>
                <Price
                  amount={'0'} // Simplified tax
                  currencyCode={cart?.cost.totalTaxAmount.currencyCode || 'VND'}
                />
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <p className="text-base font-medium">Tổng cộng</p>
                <Price
                  className="text-base font-medium"
                  amount={checkoutTotal.toString()}
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
              {isProcessing ? 'Đang xử lý...' : `Thanh toán ${checkoutTotal} ${cart?.cost.totalAmount.currencyCode || 'VND'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
