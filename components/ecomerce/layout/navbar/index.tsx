'use client';

import { useEffect, useState, Suspense } from 'react';
import CartModal from '@/components/ecomerce/cart/modal';
import { UserMenu } from './user-menu';
import LogoSquare from '@/components/ecomerce/logo-square';
import { useCollections } from '@/components/providers/ecommerce-api-provider';
import type { Collection, Menu } from '@/lib/ecomerce/foodshop/types';
import Link from 'next/link';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Shop';

export function Navbar() {
  const { getCollections } = useCollections();
  const [menu, setMenu] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    getCollections()
      .then((collections: Collection[]) => {
        const dynamicMenu: Menu[] = [
          { title: 'Tất cả', path: '/search' },
          ...collections
        ];
        setMenu(dynamicMenu);
      })
      .finally(() => setIsLoading(false));
  }, [getCollections]);

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {!isLoading && menu.length > 0 && (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className={clsx(
                        'underline-offset-4 hover:underline',
                        {
                          'text-black underline dark:text-neutral-100': isActive,
                          'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300': !isActive
                        }
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3 gap-4">
          <UserMenu />
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
