'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package, // Or generic Box icon
  },
  {
    title: 'Collections',
    href: '/admin/collections',
    icon: Menu,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  // Keep Settings at the bottom usually
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4 border-b flex items-center justify-between bg-background">
        <span className="font-bold text-lg">Admin</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                    Copilot Admin
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                        isActive 
                                            ? "bg-primary/10 text-primary" 
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)} // Close on mobile click
                                >
                                    <Icon size={18} />
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer / User Profile */}
            <div className="mt-auto border-t p-4 space-y-4">
                {user && (
                    <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-9 w-9 border">
                            <AvatarImage src={user.avatar || undefined} alt={user.fullName || user.email} />
                            <AvatarFallback>{(user.fullName?.[0] || user.email?.[0] || 'A').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.fullName || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                
                <div className="grid gap-1">
                    <Link 
                        href="/" 
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Shop
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors w-full"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
