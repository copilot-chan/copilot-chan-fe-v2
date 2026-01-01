/**
 * Ecommerce Constants
 * Định nghĩa các constants cho sorting, filtering, và tags
 */

// ============================================================================
// SORTING
// ============================================================================

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse: boolean;
};

export const sorting: SortFilterItem[] = [
  { title: 'Relevance', slug: null, sortKey: 'RELEVANCE', reverse: false },
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false },
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false },
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const defaultSort: SortFilterItem = sorting[0]!;

// ============================================================================
// CACHE TAGS
// ============================================================================

export const TAGS = {
  cart: 'cart',
  collections: 'collections',
  products: 'products'
} as const;

// ============================================================================
// PRODUCT OPTIONS
// ============================================================================

export const DEFAULT_OPTION = 'Default Title';
export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
