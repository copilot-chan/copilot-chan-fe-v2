/**
 * Ecommerce Type Definitions
 * Định nghĩa tất cả types cho foodshop module
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  // New Admin Fields
  collections: string[]; // List of Collection Handles or IDs
  status: 'active' | 'draft' | 'archived';
};

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

// ============================================================================
// CART TYPES
// ============================================================================

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image;
    };
  };
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

// ============================================================================
// MENU & PAGE TYPES
// ============================================================================

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

// ============================================================================
// API PARAMS
// ============================================================================

export type GetProductsParams = {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
};

export type GetCollectionProductsParams = {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
};

// ============================================================================
// USER & ADMIN TYPES
// ============================================================================

export type UserRole = 'admin' | 'editor' | 'user';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminStats = {
  totalRevenue: Money;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
};
