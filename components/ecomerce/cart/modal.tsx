'use client';

import clsx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import LoadingDots from '@/components/ecomerce/loading-dots';
import Price from '@/components/ecomerce/price';
import { DEFAULT_OPTION } from '@/lib/ecomerce/constants';
import { createUrl } from '@/lib/ecomerce/utils';
import Image from 'next/image';
import { SafeImage } from '../common/safe-image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useCart } from './cart-context';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';
import { useRouter } from 'next/navigation';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem, isLoading } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const router = useRouter();
  
  const openCart = () => {
    setIsOpen(true);
    setIsCheckingOut(false);
  };
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[600px] dark:border-neutral-700 dark:bg-black/80 dark:text-white transition-all">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-700">
                <p className="text-xl font-semibold">Giỏ hàng</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>

              {isLoading ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center">
                  <LoadingDots className="bg-neutral-500" />
                  <p className="mt-4 text-neutral-500">Đang tải...</p>
                </div>
              ) : !cart || cart.lines.length === 0 ? (
                <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                  <ShoppingCartIcon className="h-16" />
                  <p className="mt-6 text-center text-2xl font-bold">
                    Giỏ hàng trống
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="grow overflow-auto py-4 space-y-4">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title
                        )
                      )
                      .map((item, i) => {
                        const merchandiseUrl = `/product/${item.merchandise.product.handle}`;
                        
                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col rounded-lg border border-neutral-200 p-4 dark:border-neutral-800 transition-all"
                          >
                            <div className="flex w-full flex-row items-start justify-between">
                              {/* Product Image */}
                              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                                {item.merchandise.product.featuredImage?.url && (
                                  <SafeImage
                                    className="h-full w-full object-cover"
                                    width={80}
                                    height={80}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="ml-4 flex flex-1 flex-col justify-between self-stretch">
                                <div className="flex justify-between">
                                   <div className="flex flex-col">
                                      <Link
                                        href={merchandiseUrl}
                                        onClick={closeCart}
                                        className="text-base font-semibold leading-tight hover:underline"
                                      >
                                          {item.merchandise.product.title}
                                      </Link>
                                   </div>
                                   {/* Delete Button (Top Right of Card) */}
                                   <div className="ml-2">
                                     <DeleteItemButton
                                        item={item}
                                        optimisticUpdate={updateCartItem}
                                      />
                                   </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  {/* Quantity Controls */}
                                  <div className="flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                      
                                    />
                                    <p className="w-8 text-center text-sm select-none
">
                                        {item.quantity}
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>

                                  {/* Price */}
                                  <Price
                                    className="text-right text-base font-medium"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={item.cost.totalAmount.currencyCode}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  
                  {/* Footer Section */}
                  <div className="border-t border-neutral-200 bg-white py-4 dark:border-neutral-700 dark:bg-black">
                    <div className="mb-4 flex items-center justify-between text-lg font-bold">
                      <p>Tổng tiền ({cart.totalQuantity} món)</p>
                      <Price
                        className="text-right text-black dark:text-white"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                    <button
                      onClick={() => {
                         setIsCheckingOut(true);
                         closeCart();
                         router.push('/checkout');
                      }}
                      disabled={isCheckingOut || cart.lines.length === 0}
                      className="block w-full rounded-full bg-blue-600 p-4 text-center text-base font-bold text-white shadow-lg shadow-blue-600/20 opacity-90 hover:opacity-100 hover:shadow-blue-600/40 disabled:opacity-60 disabled:shadow-none transition-all"
                    >
                      {isCheckingOut ? (
                        <LoadingDots className="bg-white" />
                      ) : (
                        `Thanh toán • ${Number(cart.cost.totalAmount.amount).toLocaleString('vi-VN')} VND`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
      <XMarkIcon
        className={clsx(
          'h-6 transition-all ease-in-out hover:scale-110',
          className
        )}
      />
    </div>
  );
}
