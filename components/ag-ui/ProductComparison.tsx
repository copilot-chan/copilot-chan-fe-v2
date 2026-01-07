import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductImage } from './shared/ProductImage';
import { ProductPrice } from './shared/ProductPrice';
import { AddToCartButton } from './shared/AddToCartButton';
import { Check, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/ecomerce/foodshop/types';
import Link from 'next/link';

interface ComparisonItem {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  image_url?: string;
  best_for?: string[];
  pros?: string[];
  cons?: string[];
}

interface ProductComparisonProps {
  products: ComparisonItem[];
  recommendation?: {
    recommended_product_id: string;
    reason: string;
  };
  className?: string;
}

export function ProductComparison({
  products,
  recommendation,
  className,
}: ProductComparisonProps) {
  const toProduct = (item: ComparisonItem): Product => ({
    id: item.id,
    handle: item.id,
    title: item.title,
    description: '',
    descriptionHtml: '',
    status: 'active',
    price: { amount: item.price.toString(), currencyCode: 'VND' },
    originalPrice: item.original_price
      ? { amount: item.original_price.toString(), currencyCode: 'VND' }
      : undefined,
    featuredImage: {
      url: item.image_url || '',
      altText: item.title,
      width: 500,
      height: 500,
    },
    images: [],
    seo: { title: item.title, description: '' },
    tags: [],
    collections: [],
    updatedAt: new Date().toISOString(),
    vendor: 'Shop',
    productType: 'Food',
  });

  return (
    <Card className={cn('w-full overflow-hidden', className)}>
      <CardHeader className="p-2 sm:p-4">
        <CardTitle className="text-sm sm:text-base md:text-lg">So sánh sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 pt-0">
        {/* Responsive Grid: 2 columns on mobile, side by side */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {products.map((p) => {
            const isRecommended = recommendation?.recommended_product_id === p.id;
            return (
              <div key={p.id} className={cn(
                "flex flex-col rounded-lg border p-2 sm:p-3",
                isRecommended && "border-primary ring-2 ring-primary/20 bg-primary/5"
              )}>
                {/* Badge */}
                {isRecommended && (
                  <Badge variant="secondary" className="mb-2 self-start text-[10px] sm:text-xs">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-yellow-500" />
                    Gợi ý
                  </Badge>
                )}
                
                {/* Image */}
                <Link href={`/product/${p.id}`} className="block mb-2">
                  <ProductImage
                    image={{
                      url: p.image_url || '',
                      altText: p.title,
                      width: 150,
                      height: 150,
                    }}
                    title={p.title}
                    aspectRatio="square"
                    className="w-full rounded-md cursor-pointer hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Title */}
                <Link href={`/product/${p.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-bold text-xs sm:text-sm line-clamp-2 mb-1">{p.title}</h3>
                </Link>

                {/* Price */}
                <ProductPrice
                  price={{ amount: p.price.toString(), currencyCode: 'VND' }}
                  originalPrice={p.original_price ? { amount: p.original_price.toString(), currencyCode: 'VND' } : undefined}
                  className="mb-2"
                />

                {/* Best For */}
                {p.best_for && p.best_for.length > 0 && (
                  <div className="mb-2 hidden sm:block">
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">Phù hợp:</p>
                    <ul className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                      {p.best_for.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="truncate">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pros */}
                {p.pros && p.pros.length > 0 && (
                  <div className="mb-1 sm:mb-2">
                    <p className="text-[10px] sm:text-xs font-medium text-green-600 mb-0.5 sm:mb-1 hidden sm:block">Ưu điểm:</p>
                    <ul className="space-y-0.5">
                      {p.pros.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex gap-1 items-start text-[10px] sm:text-xs">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1 hidden sm:inline">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cons */}
                {p.cons && p.cons.length > 0 && (
                  <div className="mb-1 sm:mb-2">
                    <p className="text-[10px] sm:text-xs font-medium text-red-600 mb-0.5 sm:mb-1 hidden sm:block">Nhược:</p>
                    <ul className="space-y-0.5">
                      {p.cons.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex gap-1 items-start text-[10px] sm:text-xs">
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1 hidden sm:inline">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to Cart */}
                <div className="mt-auto pt-2">
                  <AddToCartButton product={toProduct(p)} className="w-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendation Reason */}
        {recommendation && (
          <div className="bg-secondary/30 p-2 sm:p-3 mt-3 rounded-lg flex gap-2 text-[10px] sm:text-xs">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">AI Gợi ý: </span>
              {recommendation.reason}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
