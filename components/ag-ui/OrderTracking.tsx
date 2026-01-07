import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { ProductImage } from './shared/ProductImage'; // Reusing for items if images available (though spec says items list might just be text, but UI shows [img])
import { ProductPrice } from './shared/ProductPrice';
import Link from 'next/link';

// Define types based on tool-fe.md
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  product_id: string; // Mandatory for linking
  image_url?: string; // Optional in spec but good to have
}

interface OrderTrackingProps {
  order_id: string;
  current_status: OrderStatus;
  total_amount: number;
  items: OrderItem[];
  address?: string;
  estimated_delivery?: string; // e.g. "14:00 - 16:00 hôm nay"
  className?: string;
  created_at?: string; // ISO string
}

const STEPS = [
  { id: 'confirmed', label: 'Đã xác nhận', icon: CheckCircle2 },
  { id: 'preparing', label: 'Đang chuẩn bị', icon: Package },
  { id: 'shipping', label: 'Đang giao', icon: Truck },
  { id: 'delivered', label: 'Đã giao', icon: CheckCircle2 },
];

export function OrderTracking({
  order_id,
  current_status,
  total_amount,
  items,
  address,
  estimated_delivery,
  created_at,
  className,
}: OrderTrackingProps) {
  // Determine current step index
  const getCurrentStepIndex = (status: OrderStatus) => {
    if (status === 'pending') return -1;
    if (status === 'cancelled') return -1; // Special case
    const index = STEPS.findIndex((s) => s.id === status);
    return index !== -1 ? index : STEPS.length - 1; // Default to end if unknown/completed
  };

  const currentStepIndex = getCurrentStepIndex(current_status);
  const isCancelled = current_status === 'cancelled';

  return (
    <Card className={cn('w-full max-w-lg', className)}>
      <CardHeader className="pb-2 sm:pb-4 p-2 sm:p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm sm:text-base md:text-lg">Đơn hàng #{order_id}</CardTitle>
            <CardDescription className="text-[10px] sm:text-xs">
              Đặt ngày: {created_at ? new Date(created_at).toLocaleString('vi-VN') : 'N/A'}
            </CardDescription>
          </div>
          {isCancelled && (
            <span className="bg-destructive/10 text-destructive text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              Đã hủy
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 p-2 sm:p-4">
        {/* Timeline */}
        {!isCancelled && (
          <div className="relative flex justify-between items-center px-1 sm:px-2">
            {/* Progress Bar Background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 sm:h-1 bg-secondary -z-10" />
            {/* Progress Bar Active */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 sm:h-1 bg-primary transition-all duration-500 -z-10"
              style={{
                width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%`,
              }}
            />

            {STEPS.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center gap-1 sm:gap-2 bg-background p-0.5 sm:p-1">
                  <div
                    className={cn(
                      'w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border sm:border-2 transition-colors',
                      isActive
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-background border-muted text-muted-foreground'
                    )}
                  >
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                  </div>
                  <span
                    className={cn(
                      'text-[8px] sm:text-[10px] font-medium text-center absolute -bottom-4 sm:-bottom-6 w-14 sm:w-20',
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Spacer for timeline labels */}
        {!isCancelled && <div className="h-3 sm:h-4" />}

        {/* Items */}
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-semibold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
            Sản phẩm
          </h4>
          <div className="space-y-2 sm:space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 sm:gap-3 items-center">
                <Link href={`/product/${item.product_id}`} className="shrink-0">
                  <ProductImage
                    image={item.image_url ? { url: item.image_url, altText: item.title, width: 64, height: 64 } : undefined}
                    title={item.title}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-sm cursor-pointer hover:opacity-80 transition-opacity"
                    fill={true}
                    aspectRatio="square"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product_id}`}>
                    <p className="font-medium text-[10px] sm:text-xs md:text-sm line-clamp-1 hover:text-primary transition-colors cursor-pointer">{item.title}</p>
                  </Link>
                  <p className="text-[8px] sm:text-[10px] md:text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
                <ProductPrice
                   price={{ amount: (item.price * item.quantity).toString(), currencyCode: 'VND' }}
                   className="text-[10px] sm:text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Delivery Info */}
        <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs md:text-sm">
           <h4 className="font-semibold text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1 sm:mb-2">
            Giao hàng
          </h4>
          {address && (
              <div className="flex gap-1.5 sm:gap-2 items-start">
                  <div className="min-w-3 pt-0.5"><div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" /></div>
                  <span className="line-clamp-2">{address}</span>
              </div>
          )}
           {estimated_delivery && (
              <div className="flex gap-1.5 sm:gap-2 items-start text-muted-foreground">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Dự kiến: {estimated_delivery}</span>
              </div>
          )}
        </div>

        <Separator />
        
        {/* Cost Summary */}
        <div className="space-y-0.5 sm:space-y-1">
            <div className="flex justify-between text-[10px] sm:text-xs md:text-sm">
                <span>Tổng tiền hàng</span>
                <ProductPrice price={{ amount: total_amount.toString(), currencyCode: 'VND' }} />
            </div>
             <div className="flex justify-between font-bold text-sm sm:text-base md:text-lg pt-1 sm:pt-2">
                 <span>TỔNG</span>
                  <ProductPrice price={{ amount: total_amount.toString(), currencyCode: 'VND' }} />
             </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-1 sm:gap-2 justify-end p-2 sm:p-4">
        <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">Liên hệ</Button>
        {current_status === 'pending' && <Button variant="destructive" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">Hủy đơn</Button>}
      </CardFooter>
    </Card>
  );
}
