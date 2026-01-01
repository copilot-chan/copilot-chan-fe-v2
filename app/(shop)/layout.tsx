'use client';

import { EcommerceApiProvider } from '@/components/providers/ecommerce-api-provider';
import { CartProvider } from '@/components/ecomerce/cart/cart-context';
import { Navbar } from '@/components/ecomerce/layout/navbar';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white min-h-screen">
      <EcommerceApiProvider>
        <CartProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </CartProvider>
      </EcommerceApiProvider>
    </div>
  );
}
