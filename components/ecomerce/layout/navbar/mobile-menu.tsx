'use client';

import clsx from 'clsx';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Menu } from '@/lib/ecomerce/foodshop/types';
import Search, { SearchSkeleton } from './search';
import { useAuth } from '@/components/providers/auth-provider';

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <Bars3Icon className="h-4" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
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
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search />
                  </Suspense>
                </div>
                {menu.length ? (
                  <ul className="flex w-full flex-col">
                    {menu.map((item: Menu) => {
                      const isActive = pathname === item.path;
                      return (
                        <li
                          className={clsx(
                            'py-2 text-xl transition-colors hover:text-neutral-500',
                            isActive ? 'text-black font-bold dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'
                          )}
                          key={item.title}
                        >
                          <Link href={item.path} prefetch={true} onClick={closeMobileMenu}>
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                <div className="mt-4 border-t pt-4">
                    {user ? (
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 px-2 py-2">
                                <span className="text-sm font-medium">{user.fullName || user.email}</span>
                             </div>
                             <Link href="/account?tab=orders" onClick={closeMobileMenu} className="px-2 py-2 text-xl text-neutral-700 dark:text-neutral-300">
                                Đơn hàng
                             </Link>
                             <button onClick={() => { logout(); closeMobileMenu(); }} className="px-2 py-2 text-left text-xl text-red-600">
                                Đăng xuất
                             </button>
                        </div>
                    ) : (
                        <Link href="/login" onClick={closeMobileMenu} className="px-2 py-2 text-xl font-bold text-black dark:text-neutral-100">
                            Đăng nhập
                        </Link>
                    )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
