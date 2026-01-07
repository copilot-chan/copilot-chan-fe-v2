'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';

import { GridTileImage } from '@/components/ecomerce/grid/tile';
import Footer from '@/components/ecomerce/layout/footer';
import { Gallery } from '@/components/ecomerce/product/gallery';
import { ProductProvider } from '@/components/ecomerce/product/product-context';
import { ProductDescription } from '@/components/ecomerce/product/product-description';
import { HIDDEN_PRODUCT_TAG } from '@/lib/ecomerce/foodshop';
import { useProducts } from '@/components/providers/ecommerce-api-provider';
import type { Product, Image as ProductImage } from '@/lib/ecomerce/foodshop/types';
import Link from 'next/link';

function ProductSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <div className="relative aspect-square h-full max-h-[550px] w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="basis-full lg:basis-2/6 space-y-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-24 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-12 w-full animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
  return (
    <div className="py-8">
      <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 mb-4" />
      <div className="flex w-full gap-4 overflow-x-auto pt-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square w-1/5 flex-none animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;
  const { getProduct, getRecommendations } = useProducts();
  
  const [product, setProduct] = useState<Product | undefined>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    console.log("handle", handle);
    getProduct(handle)
      .then((data) => {
        if (!data) {
          setNotFoundState(true);
          return;
        }
        setProduct(data);
        // Fetch related products
        return getRecommendations(data.id);
      })
      .then((related) => {
        if (related) setRelatedProducts(related);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [handle, getProduct, getRecommendations]);

  if (notFoundState) {
    notFound();
  }

  if (isLoading) {
    return (
      <>
        <ProductSkeleton />
        <RelatedProductsSkeleton />
        <Footer />
      </>
    );
  }

  if (!product) {
    return notFound();
  }

    const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.price.currencyCode,
      highPrice: product.originalPrice ? product.originalPrice.amount : product.price.amount,
      lowPrice: product.price.amount,
    },
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Gallery
              images={product.images.slice(0, 5).map((image: ProductImage) => ({
                src: image.url,
                altText: image.altText,
              }))}
              
            />
          </div>

          <div className="basis-full lg:basis-2/6">
            <ProductDescription product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-8">
            <h2 className="mb-4 text-2xl font-bold">Sản phẩm liên quan</h2>
            <ul className="flex w-full gap-4 overflow-x-auto pt-1">
              {relatedProducts.map((relatedProduct) => (
                <li
                  key={relatedProduct.id}
                  className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                >
                  <Link
                    className="relative h-full w-full"
                    href={`/product/${relatedProduct.id}`}
                    prefetch={true}
                  >
                    <GridTileImage
                      alt={relatedProduct.title}
                      label={{
                        title: relatedProduct.title,
                        amount: relatedProduct.price.amount,
                        currencyCode: relatedProduct.price.currencyCode,
                      }}
                      src={relatedProduct.featuredImage?.url}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Footer />
    </ProductProvider>
  );
}
