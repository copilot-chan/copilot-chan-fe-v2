import { Product } from '@/lib/ecomerce/foodshop/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ProductImage } from './shared/ProductImage';
import { ProductPrice } from './shared/ProductPrice';
import { AddToCartButton } from './shared/AddToCartButton';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={cn('overflow-hidden flex flex-col h-full', className)}>
      <div className="relative group cursor-pointer overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <ProductImage
            image={product.featuredImage}
            title={product.title}
            aspectRatio="square"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {/* Discount Badge */}
        {product.originalPrice &&
          parseFloat(product.originalPrice.amount) >
            parseFloat(product.price.amount) && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full pointer-events-none">
              -
              {Math.round(
                ((parseFloat(product.originalPrice.amount) -
                  parseFloat(product.price.amount)) /
                  parseFloat(product.originalPrice.amount)) *
                  100
              )}
              %
            </div>
          )}
      </div>

      <CardContent className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col gap-1 sm:gap-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-xs sm:text-sm md:text-base line-clamp-2 hover:text-primary transition-colors" title={product.title}>
            {product.title}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-1 sm:pt-2">
          <ProductPrice
            price={product.price}
            originalPrice={product.originalPrice}
          />
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 md:p-4 pt-0 gap-1 sm:gap-2">
        <AddToCartButton product={product} className="flex-1" />
      </CardFooter>
    </Card>
  );
}
