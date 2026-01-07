import { AddToCart } from '@/components/ecomerce/cart/add-to-cart';
import Price from '@/components/ecomerce/price';
import Prose from '@/components/ecomerce/prose';
import { Product } from '@/lib/ecomerce/foodshop/types';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white flex items-center gap-2">
          <Price
            amount={product.price.amount}
            currencyCode={product.price.currencyCode}
          />
          {product.originalPrice && Number(product.originalPrice.amount) > Number(product.price.amount) && (
             <span className="line-through opacity-70">
                <Price
                    amount={product.originalPrice.amount}
                    currencyCode={product.originalPrice.currencyCode}
                />
             </span>
          )}
        </div>
      </div>
      {/* VariantSelector removed */}
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
